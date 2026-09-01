#!/usr/bin/env python3
"""Upward-continue a MuMax3 Bz overlay to 1 mm and 5 mm.

The pack is micrometres on a side. Continuation over millimetres is
valid in free space; the amplitude must then be scaled by the brick's
oxide volume fraction before comparing to a TMR.

Usage:
    python postprocess.py path/to/B_demag000000.ovf
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

FILL = 0.04
H_MM = (1.0, 5.0)


def read_ovf_scalar_z(path: Path):
    header = {}
    with path.open("rb") as f:
        while True:
            line = f.readline()
            if not line:
                raise ValueError("no data block")
            text = line.decode("ascii", errors="ignore").strip()
            if text.startswith("#"):
                parts = text[1:].strip().split(":", 1)
                if len(parts) == 2:
                    header[parts[0].strip().lower()] = parts[1].strip()
            if "Begin: Data" in text or "begin: data" in text.lower():
                break
        nx = int(header["xnodes"])
        ny = int(header["ynodes"])
        nz = int(header["znodes"])
        dx = float(header.get("xstepsize", 8e-9))
        valuedim = int(header.get("valuedim", 1))
        count = nx * ny * nz * valuedim
        raw = np.fromfile(f, dtype="<f4", count=count)
    raw = raw.reshape(nz, ny, nx, valuedim)
    mid = raw[nz // 2, :, :, -1]
    return mid, dx


def continue_plane(bz, dx, h):
    ky = np.fft.fftfreq(bz.shape[0], d=dx)
    kx = np.fft.fftfreq(bz.shape[1], d=dx)
    KX, KY = np.meshgrid(kx, ky)
    K = np.hypot(KX, KY)
    filt = np.exp(-2 * np.pi * K * h)
    filt[0, 0] = 0.0
    return np.real(np.fft.ifft2(np.fft.fft2(bz) * filt))


def independent_cells(field):
    F = np.fft.fft2(field - field.mean())
    ac = np.real(np.fft.ifft2(F * np.conj(F))) / field.size
    ac /= ac[0, 0] + 1e-30
    return field.size / max(float(np.sum(np.clip(ac, 0, None))), 1.0)


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("B_demag000000.ovf")
    bz, dx = read_ovf_scalar_z(path)
    out = {"source": str(path), "dx_m": dx, "fill": FILL, "standoffs": []}
    for h_mm in H_MM:
        h = h_mm / 1000.0
        cont = continue_plane(bz, dx, h)
        rms_pack = float(cont.std())
        rms_brick = rms_pack * FILL
        out["standoffs"].append(
            {
                "h_mm": h_mm,
                "rms_pack_T": rms_pack,
                "rms_brick_scaled_T": rms_brick,
                "rms_brick_scaled_nT": rms_brick * 1e9,
                "independent_cells_pack": independent_cells(cont),
            }
        )
    Path("brickmark_continuation.json").write_text(json.dumps(out, indent=2))
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
