#!/usr/bin/env python3
"""Optical unit-identity matcher for Experiment 0.

ORB (or SIFT) + homography when OpenCV is installed. Numpy Harris +
normalized-patch matching + RANSAC homography otherwise.

No brick measurements live in this file. --self-test is a synthetic
matcher check only (not a brick, not bits, not Experiment 0 EER).

Land one labeled crop (no EER):

    python protocol/optical_unit_identity.py --ingest path/to/A-01_r1.jpg

Paired crops later (EER only when two faces and a genuine pair exist):

    python protocol/optical_unit_identity.py --photos path/to/crops
"""
from __future__ import annotations

import argparse
import hashlib
import json
import struct
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
INGEST_DIR = HERE / "experiment0_ingest"

IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".webp"}


# ---------------------------------------------------------------------------
# scoring
# ---------------------------------------------------------------------------

def _norm01(img: np.ndarray) -> np.ndarray:
    img = np.asarray(img, dtype=np.float64)
    if img.ndim == 3:
        img = img.mean(axis=2)
    lo, hi = float(img.min()), float(img.max())
    if hi - lo < 1e-12:
        return np.zeros_like(img, dtype=np.float64)
    return (img - lo) / (hi - lo)


def _gaussian_kernel(sigma: float) -> np.ndarray:
    radius = max(1, int(np.ceil(3 * sigma)))
    x = np.arange(-radius, radius + 1, dtype=np.float64)
    k = np.exp(-(x * x) / (2 * sigma * sigma))
    return k / k.sum()


def _blur(img: np.ndarray, sigma: float = 1.2) -> np.ndarray:
    k = _gaussian_kernel(sigma)
    tmp = np.apply_along_axis(lambda m: np.convolve(m, k, mode="same"), 1, img)
    return np.apply_along_axis(lambda m: np.convolve(m, k, mode="same"), 0, tmp)


def _gradients(img: np.ndarray):
    # Sobel via separable convolutions (vectorized).
    kx = np.array([-1.0, 0.0, 1.0])
    ky = np.array([1.0, 2.0, 1.0])
    tmpx = np.apply_along_axis(lambda m: np.convolve(m, kx, mode="same"), 1, img)
    ix = np.apply_along_axis(lambda m: np.convolve(m, ky, mode="same"), 0, tmpx)
    tmpy = np.apply_along_axis(lambda m: np.convolve(m, ky, mode="same"), 1, img)
    iy = np.apply_along_axis(lambda m: np.convolve(m, kx, mode="same"), 0, tmpy)
    return ix, iy


def harris_keypoints(img: np.ndarray, n_pts: int = 180, k: float = 0.04) -> np.ndarray:
    """Return (N, 2) array of (row, col) integer keypoints."""
    ix, iy = _gradients(img)
    ixx = _blur(ix * ix, 1.5)
    iyy = _blur(iy * iy, 1.5)
    ixy = _blur(ix * iy, 1.5)
    det = ixx * iyy - ixy * ixy
    tr = ixx + iyy
    resp = det - k * tr * tr
    # suppress edges
    margin = 10
    resp[:margin, :] = 0
    resp[-margin:, :] = 0
    resp[:, :margin] = 0
    resp[:, -margin:] = 0
    # 5×5 non-maxima on the response (stride-tricks, no scipy)
    from numpy.lib.stride_tricks import sliding_window_view

    padded = np.pad(resp, 2, mode="constant")
    windows = sliding_window_view(padded, (5, 5))
    local_max = windows.max(axis=(-2, -1))
    peaks = (resp == local_max) & (resp > 1e-8)
    rs, cs = np.nonzero(peaks)
    if rs.size == 0:
        return np.zeros((0, 2), dtype=np.int32)
    order = np.argsort(-resp[rs, cs])
    keep = [(int(rs[i]), int(cs[i])) for i in order]
    # min-distance thinning
    chosen = []
    for r, c in keep:
        if all((r - rr) ** 2 + (c - cc) ** 2 >= 36 for rr, cc in chosen):
            chosen.append((r, c))
        if len(chosen) >= n_pts:
            break
    if not chosen:
        return np.zeros((0, 2), dtype=np.int32)
    return np.asarray(chosen, dtype=np.int32)


def patch_descriptors(img: np.ndarray, kps: np.ndarray, half: int = 8) -> np.ndarray:
    descs = []
    h, w = img.shape
    for r, c in kps:
        r0, r1 = r - half, r + half
        c0, c1 = c - half, c + half
        if r0 < 0 or c0 < 0 or r1 > h or c1 > w:
            descs.append(None)
            continue
        patch = img[r0:r1, c0:c1].astype(np.float64).ravel()
        patch = patch - patch.mean()
        nrm = np.linalg.norm(patch)
        descs.append(patch / nrm if nrm > 1e-9 else patch)
    return descs


def match_descriptors(desc_a, desc_b, ratio: float = 0.78):
    """Mutual Lowe-ratio matches → list of (ia, ib)."""
    valid_a = [(i, d) for i, d in enumerate(desc_a) if d is not None]
    valid_b = [(j, d) for j, d in enumerate(desc_b) if d is not None]
    if len(valid_a) < 4 or len(valid_b) < 4:
        return []
    db = np.stack([d for _, d in valid_b])
    jb = [j for j, _ in valid_b]
    pairs = []
    for i, da in valid_a:
        dots = db @ da
        # cosine on unit patches ≈ 1 - 0.5*L2^2
        order = np.argsort(-dots)
        best, second = float(dots[order[0]]), float(dots[order[1]]) if len(order) > 1 else -1.0
        if best <= 0:
            continue
        if (1.0 - best) >= ratio * max(1e-9, (1.0 - second)):
            continue
        pairs.append((i, jb[int(order[0])], best))
    # unique B
    best_for_b = {}
    for i, j, s in pairs:
        if j not in best_for_b or s > best_for_b[j][1]:
            best_for_b[j] = (i, s)
    return [(i, j) for j, (i, _) in best_for_b.items()]


def _homography_dlt(src: np.ndarray, dst: np.ndarray) -> np.ndarray | None:
    n = src.shape[0]
    if n < 4:
        return None
    A = np.zeros((2 * n, 9), dtype=np.float64)
    for k in range(n):
        x, y = src[k]
        u, v = dst[k]
        A[2 * k] = [x, y, 1, 0, 0, 0, -u * x, -u * y, -u]
        A[2 * k + 1] = [0, 0, 0, x, y, 1, -v * x, -v * y, -v]
    _, _, vh = np.linalg.svd(A)
    h = vh[-1].reshape(3, 3)
    if abs(h[2, 2]) < 1e-12:
        return None
    return h / h[2, 2]


def _apply_H(H: np.ndarray, pts: np.ndarray) -> np.ndarray:
    ones = np.ones((pts.shape[0], 1), dtype=np.float64)
    hp = np.concatenate([pts, ones], axis=1) @ H.T
    w = hp[:, 2:3]
    w = np.where(np.abs(w) < 1e-12, 1e-12, w)
    return hp[:, :2] / w


def ransac_homography(src, dst, n_iter: int = 180, thresh: float = 3.0, rng=None):
    rng = np.random.default_rng(rng)
    n = src.shape[0]
    if n < 4:
        return None, np.zeros(n, dtype=bool)
    best_inliers = np.zeros(n, dtype=bool)
    best_H = None
    for _ in range(n_iter):
        idx = rng.choice(n, size=4, replace=False)
        H = _homography_dlt(src[idx], dst[idx])
        if H is None:
            continue
        pred = _apply_H(H, src)
        err = np.linalg.norm(pred - dst, axis=1)
        inl = err < thresh
        if inl.sum() > best_inliers.sum():
            best_inliers = inl
            best_H = H
    if best_H is not None and best_inliers.sum() >= 4:
        H = _homography_dlt(src[best_inliers], dst[best_inliers])
        if H is not None:
            best_H = H
            pred = _apply_H(H, src)
            best_inliers = np.linalg.norm(pred - dst, axis=1) < thresh
    return best_H, best_inliers


def numpy_match_score(img_a: np.ndarray, img_b: np.ndarray, rng=None) -> dict:
    a = _norm01(img_a)
    b = _norm01(img_b)
    kpa = harris_keypoints(a)
    kpb = harris_keypoints(b)
    da = patch_descriptors(a, kpa)
    db = patch_descriptors(b, kpb)
    matches = match_descriptors(da, db)
    backend = "numpy-harris"
    if len(matches) < 4:
        return {
            "score": 0.0,
            "n_matches": len(matches),
            "n_inliers": 0,
            "backend": backend,
        }
    src = np.array([[float(kpa[i, 1]), float(kpa[i, 0])] for i, _ in matches])
    dst = np.array([[float(kpb[j, 1]), float(kpb[j, 0])] for _, j in matches])
    _, inl = ransac_homography(src, dst, rng=rng)
    n_inl = int(inl.sum())
    score = n_inl / max(len(matches), 1)
    return {
        "score": float(score),
        "n_matches": len(matches),
        "n_inliers": n_inl,
        "backend": backend,
    }


def opencv_match_score(img_a: np.ndarray, img_b: np.ndarray) -> dict | None:
    try:
        import cv2
    except ImportError:
        return None
    def to_u8(im):
        x = _norm01(im)
        return np.clip(x * 255.0, 0, 255).astype(np.uint8)

    ua, ub = to_u8(img_a), to_u8(img_b)
    backend = "orb"
    detector = cv2.ORB_create(nfeatures=800)
    kpa, da = detector.detectAndCompute(ua, None)
    kpb, db = detector.detectAndCompute(ub, None)
    if da is None or db is None or len(kpa) < 4 or len(kpb) < 4:
        if hasattr(cv2, "SIFT_create"):
            backend = "sift"
            detector = cv2.SIFT_create(nfeatures=800)
            kpa, da = detector.detectAndCompute(ua, None)
            kpb, db = detector.detectAndCompute(ub, None)
        if da is None or db is None or len(kpa) < 4 or len(kpb) < 4:
            return {"score": 0.0, "n_matches": 0, "n_inliers": 0, "backend": backend}
    norm = cv2.NORM_HAMMING if backend == "orb" else cv2.NORM_L2
    bf = cv2.BFMatcher(norm, crossCheck=False)
    knn = bf.knnMatch(da, db, k=2)
    good = []
    for pair in knn:
        if len(pair) < 2:
            continue
        m, n = pair
        if m.distance < 0.75 * n.distance:
            good.append(m)
    if len(good) < 4:
        return {
            "score": 0.0,
            "n_matches": len(good),
            "n_inliers": 0,
            "backend": backend,
        }
    src = np.float32([kpa[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst = np.float32([kpb[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
    H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 3.0)
    n_inl = int(mask.sum()) if mask is not None else 0
    return {
        "score": float(n_inl / max(len(good), 1)),
        "n_matches": len(good),
        "n_inliers": n_inl,
        "backend": backend,
    }


def match_score(img_a: np.ndarray, img_b: np.ndarray, rng=None) -> dict:
    oc = opencv_match_score(img_a, img_b)
    if oc is not None:
        return oc
    return numpy_match_score(img_a, img_b, rng=rng)


# ---------------------------------------------------------------------------
# EER + histograms (no matplotlib)
# ---------------------------------------------------------------------------

def equal_error_rate(genuine: np.ndarray, impostor: np.ndarray) -> dict:
    """Higher score = more genuine. Returns EER and a threshold."""
    g = np.asarray(genuine, dtype=np.float64)
    i = np.asarray(impostor, dtype=np.float64)
    if g.size == 0 or i.size == 0:
        return {"eer": None, "threshold": None}
    thresholds = np.unique(np.concatenate([g, i]))
    best = None
    for t in thresholds:
        # reject if score < t
        frr = float(np.mean(g < t))
        far = float(np.mean(i >= t))
        gap = abs(frr - far)
        rec = {"eer": 0.5 * (frr + far), "threshold": float(t), "frr": frr, "far": far}
        if best is None or gap < best["_gap"] or (gap == best["_gap"] and rec["eer"] < best["eer"]):
            rec["_gap"] = gap
            best = rec
    best.pop("_gap", None)
    return best


def ascii_histogram(values: np.ndarray, lo: float, hi: float, bins: int = 12, width: int = 28) -> str:
    values = np.asarray(values, dtype=np.float64)
    if hi <= lo:
        hi = lo + 1e-6
    counts, edges = np.histogram(values, bins=bins, range=(lo, hi))
    peak = max(int(counts.max()), 1)
    lines = []
    for c, a, b in zip(counts, edges[:-1], edges[1:]):
        bar = "#" * int(round(width * c / peak))
        lines.append(f"  [{a:5.2f},{b:5.2f}) {bar} {c}")
    return "\n".join(lines)


def summarize(genuine, impostor, *, report_eer: bool) -> str:
    """Score-distribution text. EER only when report_eer is True (real pairs)."""
    g = np.asarray(genuine, dtype=np.float64)
    i = np.asarray(impostor, dtype=np.float64)
    lo = 0.0
    hi = 1.0
    if g.size or i.size:
        hi = max(float(np.max(g) if g.size else 0), float(np.max(i) if i.size else 0), 1.0)
    lines = [
        f"genuine n={g.size}  mean={g.mean() if g.size else float('nan'):.3f}  "
        f"min={g.min() if g.size else float('nan'):.3f}  max={g.max() if g.size else float('nan'):.3f}",
        f"impostor n={i.size}  mean={i.mean() if i.size else float('nan'):.3f}  "
        f"min={i.min() if i.size else float('nan'):.3f}  max={i.max() if i.size else float('nan'):.3f}",
    ]
    if report_eer and g.size and i.size:
        eer = equal_error_rate(g, i)
        lines.append(
            f"EER={eer['eer'] if eer['eer'] is not None else 'n/a'}  "
            f"threshold={eer['threshold']}"
        )
        lines.append("These are photo-match scores, not bits-per-brick.")
    lines.append("genuine histogram:")
    lines.append(ascii_histogram(g, lo, hi) if g.size else "  (empty)")
    lines.append("impostor histogram:")
    lines.append(ascii_histogram(i, lo, hi) if i.size else "  (empty)")
    if g.size and i.size:
        lines.append(f"clean_separation={float(g.min()) > float(i.max())}")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# images
# ---------------------------------------------------------------------------

def load_gray(path: Path) -> np.ndarray:
    try:
        import cv2

        im = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
        if im is None:
            raise ValueError(f"unreadable: {path}")
        return im.astype(np.float64)
    except ImportError:
        pass
    try:
        from PIL import Image

        im = Image.open(path).convert("L")
        return np.asarray(im, dtype=np.float64)
    except ImportError as exc:
        raise SystemExit(
            "Scoring photos needs opencv-python or Pillow. "
            "Ingest does not. Self-test does not: "
            "python protocol/optical_unit_identity.py --self-test"
        ) from exc


def parse_face_id(path: Path) -> str | None:
    """A-01_r1.jpg / A-01_1.jpg / A-01-r2.png → face id A-01."""
    stem = path.stem
    for sep in ("_r", "-r", "_"):
        if sep in stem:
            left, right = stem.rsplit(sep, 1)
            if right.isdigit():
                return left
    return None


def _iter_images(path: Path) -> list[Path]:
    if path.is_file():
        if path.suffix.lower() in IMAGE_SUFFIXES:
            return [path]
        return []
    if not path.is_dir():
        return []
    return sorted(
        p for p in path.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_SUFFIXES
    )


def _png_wh(data: bytes) -> tuple[int, int] | None:
    if len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    w, h = struct.unpack(">II", data[16:24])
    return int(w), int(h)


def _jpeg_wh(data: bytes) -> tuple[int, int] | None:
    if len(data) < 4 or data[:2] != b"\xff\xd8":
        return None
    i = 2
    while i + 9 < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xD8, 0xD9) or (0xD0 <= marker <= 0xD7):
            i += 2
            continue
        if i + 4 > len(data):
            break
        seglen = struct.unpack(">H", data[i + 2 : i + 4])[0]
        if marker in (0xC0, 0xC1, 0xC2) and i + 9 <= len(data):
            h, w = struct.unpack(">HH", data[i + 5 : i + 9])
            return int(w), int(h)
        i += 2 + seglen
    return None


def image_wh(path: Path) -> tuple[int, int] | None:
    """Pixel size from file headers. Does not invent a crop or a face."""
    data = path.read_bytes()
    return _png_wh(data) or _jpeg_wh(data)


def _ingest_message() -> str:
    return (
        "not enough pairs to score; no EER\n"
        "ingest one labeled crop first: "
        "python protocol/optical_unit_identity.py --ingest path/to/A-01_r1.jpg\n"
        "checklist: protocol/experiment0_ingest.md"
    )


def score_photos(target: Path) -> int:
    files = _iter_images(target)
    if not files:
        print(_ingest_message())
        return 2
    groups: dict[str, list[Path]] = defaultdict(list)
    skipped = []
    for p in files:
        fid = parse_face_id(p)
        if fid is None:
            skipped.append(p.name)
            continue
        groups[fid].append(p)
    if skipped:
        print("skipped (name not {id}_{rep}):", ", ".join(skipped))
    genuine_pairs = sum(len(v) * (len(v) - 1) // 2 for v in groups.values())
    n_faces = len(groups)
    if n_faces < 2 or genuine_pairs < 1:
        print(_ingest_message())
        return 2
    cache = {p: load_gray(p) for paths in groups.values() for p in paths}
    genuine, impostor = [], []
    faces = sorted(groups)
    for fid in faces:
        paths = groups[fid]
        for i in range(len(paths)):
            for j in range(i + 1, len(paths)):
                rec = match_score(cache[paths[i]], cache[paths[j]])
                genuine.append(rec["score"])
                print(f"genuine  {paths[i].name} vs {paths[j].name}  {rec}")
    for a in range(len(faces)):
        for b in range(a + 1, len(faces)):
            pa, pb = groups[faces[a]][0], groups[faces[b]][0]
            rec = match_score(cache[pa], cache[pb])
            impostor.append(rec["score"])
            print(f"impostor {pa.name} vs {pb.name}  {rec}")
    print()
    print(summarize(genuine, impostor, report_eer=True))
    return 0


# ---------------------------------------------------------------------------
# one-face ingest (no EER, no genuine/impostor)
# ---------------------------------------------------------------------------

CROP_NOTE = (
    "Operator must crop ~5×5 cm of the same region (clay texture, not room). "
    "This script cannot verify physical centimeters."
)


def _parse_crop_box(text: str | None) -> list[int] | None:
    if not text:
        return None
    parts = [p.strip() for p in text.replace("x", ",").split(",")]
    if len(parts) != 4:
        raise ValueError("crop box must be x,y,w,h in pixels")
    box = [int(p) for p in parts]
    if any(v < 0 for v in box) or box[2] <= 0 or box[3] <= 0:
        raise ValueError("crop box must be x,y,w,h with positive w,h")
    return box


def _receipt_paths(photo: Path) -> tuple[Path, Path, Path]:
    """JSON next to the photo; running log under protocol/experiment0_ingest/."""
    local = photo.with_name(photo.stem + ".ingest.json")
    INGEST_DIR.mkdir(parents=True, exist_ok=True)
    manifest_md = INGEST_DIR / "MANIFEST.md"
    manifest_tsv = INGEST_DIR / "MANIFEST.tsv"
    return local, manifest_md, manifest_tsv


def ingest_one(photo: Path, crop_box: list[int] | None) -> dict:
    data = photo.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    wh = image_wh(photo)
    mtime = datetime.fromtimestamp(photo.stat().st_mtime, tz=timezone.utc)
    face_id = parse_face_id(photo)
    receipt = {
        "filename": photo.name,
        "path": str(photo.resolve()),
        "sha256": digest,
        "width_px": wh[0] if wh else None,
        "height_px": wh[1] if wh else None,
        "mtime_utc": mtime.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "name_parses": face_id is not None,
        "face_id": face_id,
        "crop_box_px": crop_box,
        "crop_note": CROP_NOTE,
        "eer": None,
        "genuine_impostor": None,
        "kind": "ingest_receipt",
        "not_a_brick_measurement": True,
    }
    local, manifest_md, manifest_tsv = _receipt_paths(photo)
    local.write_text(json.dumps(receipt, indent=2) + "\n")
    # Fixture files are not a landed brick face; keep them off the running log.
    if "_fixture" not in photo.parts:
        _append_manifest(manifest_md, manifest_tsv, receipt)
    print(f"ingested {photo.name}")
    print(f"  sha256={digest}")
    print(f"  pixels={receipt['width_px']}x{receipt['height_px']}")
    print(f"  mtime_utc={receipt['mtime_utc']}")
    print(f"  name_parses={receipt['name_parses']}  face_id={face_id}")
    print(f"  receipt={local}")
    print(f"  {CROP_NOTE}")
    print("  no EER; one face is enough to land")
    return receipt


def _append_manifest(md: Path, tsv: Path, rec: dict) -> None:
    tsv_header = "filename\tsha256\twidth_px\theight_px\tmtime_utc\tname_parses\tface_id\tpath\n"
    if not tsv.exists():
        tsv.write_text(tsv_header)
    line = (
        f"{rec['filename']}\t{rec['sha256']}\t{rec['width_px']}\t{rec['height_px']}\t"
        f"{rec['mtime_utc']}\t{rec['name_parses']}\t{rec['face_id']}\t{rec['path']}\n"
    )
    existing = tsv.read_text()
    if rec["sha256"] not in existing:
        with tsv.open("a") as f:
            f.write(line)
    if not md.exists():
        md.write_text(
            "# Experiment 0 ingest log\n\n"
            "Receipts only. No EER. No genuine/impostor. "
            "Not a spectrum gate. Not bits-per-brick.\n\n"
            "| file | sha256 | W×H | mtime UTC | name parses | face id |\n"
            "|---|---|---|---|---|---|\n"
        )
    row = (
        f"| {rec['filename']} | `{rec['sha256'][:12]}…` | "
        f"{rec['width_px']}×{rec['height_px']} | {rec['mtime_utc']} | "
        f"{rec['name_parses']} | {rec['face_id'] or ''} |\n"
    )
    md_text = md.read_text()
    if rec["sha256"][:12] not in md_text:
        with md.open("a") as f:
            f.write(row)


def run_ingest(path: Path, crop_box: list[int] | None) -> int:
    if not path.exists():
        print(f"no photo yet: {path}", file=sys.stderr)
        return 2
    files = _iter_images(path)
    if not files:
        print(f"no photo yet: {path}", file=sys.stderr)
        return 2
    for photo in files:
        ingest_one(photo, crop_box)
    return 0


# ---------------------------------------------------------------------------
# synthetic self-test (no brick photos, no invented measurements)
# ---------------------------------------------------------------------------

def _blob_texture(rng: np.random.Generator, n: int = 192) -> np.ndarray:
    """Structured noise with corners — not a brick."""
    yy, xx = np.mgrid[0:n, 0:n]
    img = rng.normal(0.45, 0.08, size=(n, n))
    for _ in range(28):
        cx = rng.uniform(16, n - 16)
        cy = rng.uniform(16, n - 16)
        sx = rng.uniform(3.0, 9.0)
        sy = rng.uniform(3.0, 9.0)
        amp = rng.uniform(0.25, 0.7) * rng.choice([-1.0, 1.0])
        ang = rng.uniform(0, np.pi)
        ca, sa = np.cos(ang), np.sin(ang)
        xr = (xx - cx) * ca + (yy - cy) * sa
        yr = -(xx - cx) * sa + (yy - cy) * ca
        img += amp * np.exp(-(xr * xr) / (2 * sx * sx) - (yr * yr) / (2 * sy * sy))
    # a few sharp rectangles so Harris has something to eat
    for _ in range(8):
        r0 = int(rng.integers(10, n - 40))
        c0 = int(rng.integers(10, n - 40))
        rh = int(rng.integers(8, 22))
        cw = int(rng.integers(8, 22))
        img[r0 : r0 + rh, c0 : c0 + cw] += rng.uniform(0.4, 0.9)
    return _norm01(img)


def _warp(img: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    """Small homography warp via inverse bilinear sampling."""
    h, w = img.shape
    # dest corners -> slightly moved source corners
    src = np.array([[0, 0], [w - 1, 0], [w - 1, h - 1], [0, h - 1]], dtype=np.float64)
    jitter = rng.uniform(-12, 12, size=src.shape)
    # keep a real projective nudge, not a scramble
    jitter *= 0.7
    dst = src + jitter
    H = _homography_dlt(dst, src)  # dest pixel -> source pixel
    if H is None:
        return img.copy()
    yy, xx = np.mgrid[0:h, 0:w]
    pts = np.stack([xx.ravel(), yy.ravel()], axis=1).astype(np.float64)
    mapped = _apply_H(H, pts)
    xs, ys = mapped[:, 0], mapped[:, 1]
    x0 = np.floor(xs).astype(int)
    y0 = np.floor(ys).astype(int)
    x1 = x0 + 1
    y1 = y0 + 1
    wx = xs - x0
    wy = ys - y0
    x0 = np.clip(x0, 0, w - 1)
    x1 = np.clip(x1, 0, w - 1)
    y0 = np.clip(y0, 0, h - 1)
    y1 = np.clip(y1, 0, h - 1)
    out = (
        img[y0, x0] * (1 - wx) * (1 - wy)
        + img[y0, x1] * wx * (1 - wy)
        + img[y1, x0] * (1 - wx) * wy
        + img[y1, x1] * wx * wy
    )
    return _norm01(out.reshape(h, w))


def run_self_test(seed: int = 7) -> int:
    print("synthetic matcher check — not a brick, not bits, not Experiment 0")
    rng = np.random.default_rng(seed)
    textures = [_blob_texture(rng) for _ in range(4)]
    genuine = []
    impostor = []
    for t in textures:
        a = _warp(t, rng)
        b = _warp(t, rng)
        rec = match_score(a, b, rng=rng)
        genuine.append(rec["score"])
        print(f"synthetic same-texture warp  {rec}")
    for i in range(len(textures)):
        for j in range(i + 1, len(textures)):
            rec = match_score(textures[i], textures[j], rng=rng)
            impostor.append(rec["score"])
            print(f"synthetic unrelated texture {rec}")
    g = np.asarray(genuine)
    i = np.asarray(impostor)
    print()
    print(summarize(g, i, report_eer=False))
    separated = bool(g.size and i.size and float(g.min()) > float(i.max()))
    if not separated:
        print(
            "SELF-TEST FAIL: synthetic matcher check; warped copies did not sit "
            f"above unrelated textures (min same={g.min():.3f} max unrelated={i.max():.3f}). "
            "Not a brick.",
            file=sys.stderr,
        )
        return 1
    print()
    print(
        "SELF-TEST PASS: synthetic matcher check; warped copies sit above "
        "unrelated textures. Not a brick. Not bits."
    )
    return 0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--self-test",
        action="store_true",
        help="synthetic matcher check (no photos, no Experiment 0 EER)",
    )
    p.add_argument(
        "--ingest",
        type=Path,
        help="one image or folder; write hash receipt; no EER",
    )
    p.add_argument(
        "--photos",
        type=Path,
        help="folder (or one crop) named {id}_r1.jpg {id}_r2.jpg; EER only if pairs exist",
    )
    p.add_argument(
        "--crop-box",
        default=None,
        help="optional pixel crop x,y,w,h recorded on ingest; not invented",
    )
    p.add_argument("--seed", type=int, default=7)
    args = p.parse_args(argv)
    if args.self_test:
        return run_self_test(seed=args.seed)
    if args.ingest is not None:
        try:
            box = _parse_crop_box(args.crop_box)
        except ValueError as exc:
            print(exc, file=sys.stderr)
            return 2
        return run_ingest(args.ingest, box)
    if args.photos is not None:
        if not args.photos.exists():
            print(f"no photo yet: {args.photos}", file=sys.stderr)
            print(_ingest_message())
            return 2
        return score_photos(args.photos)
    print(__doc__.strip())
    print("\nNeed --self-test, --ingest PATH, or --photos PATH")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
