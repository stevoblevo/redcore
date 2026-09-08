# Experiment 0 ingest — one labeled face

Floor is **one** labeled crop. EER waits for pairs. This is not a measurement until two captures of a face and a second face exist.

Checklist: [experiment0_optical.md](experiment0_optical.md). Complementary to [afternoon_zero.md](afternoon_zero.md) (TMR bulk/map), not a replacement.

## Not the spectrum gate

This is **not** issue #3 / SKEIN-199. A photo is not a B-map and is not `exp(−2πkh)`. Do not quote v4 87/63 as measured. Those numbers are a model.

## Filename

`{lot}-{nn}_r{rep}.jpg` — example `A-01_r1.jpg`. Also accepted: `A-01_1.jpg`, `A-01_r2.jpg`.

Pencil ID on the **end**, not the scan face.

## Crop

Crop about **5 × 5 cm** of the same region. Fill the frame with clay texture, not room. The ingest script records pixels and a hash. It **cannot** verify physical centimeters. Do not invent a crop box; pass `--crop-box x,y,w,h` only if you measured one.

## Run

```
python protocol/optical_unit_identity.py --ingest path/to/A-01_r1.jpg
```

Writes `A-01_r1.ingest.json` next to the file (filename, sha256 of bytes, W×H, mtime, whether the name parses). Appends `protocol/experiment0_ingest/MANIFEST.md` and `MANIFEST.tsv`. No EER. No genuine/impostor.

Missing path → exit 2, `no photo yet`. The script will not fabricate an image.

Two captures per face later (`_r1` / `_r2`). Then:

```
python protocol/optical_unit_identity.py --photos path/to/crops
```

`--photos` refuses EER until two named faces and at least one genuine pair exist.

## Landing zone

Drop a real crop here or anywhere and point `--ingest` at it. `_fixture/not_a_brick.png` is a synthetic file for the matcher check. It is not a brick.
