# Experiment 0 — optical unit identity (cheap afternoon)

Drive v5 reversed the cheap unit-identity gate. It is **not** the magnetic jig. It is phone photos of fired-clay surface texture: feature matching + homography, genuine vs impostor, equal-error rate.

This file is complementary to [afternoon_zero.md](afternoon_zero.md). That afternoon is magnetic TMR (bulk / map). This afternoon is optical texture. Do not replace one with the other. Batch magnetics still live. The magnetic jig for *unit* identity is retired until this afternoon is run.

Shopping for TMR is unchanged: [shopping.md](shopping.md). This experiment needs twenty clay faces and a phone.

If reality disagrees with the model, reality wins.

## What this is not

- Not a bed-face archive in a laid wall (struck v1).
- Not a PUF. Not bits-per-brick. Do not publish an entropy number from this afternoon.
- Not a MuMax run. Not an ovf. Not a Brickmark lock.

## Safety

Bricks are 2–3 kg. No glass table. Nothing goes in a fireplace.

## Label first

Pencil on the *end*, not the scan face. Same IDs as Afternoon Zero if you have them:

```
A-01  HD RED0126  2026-09-01
B-01  HD used     2026-09-01
```

Lot A = one stack / one store. Lot B = the other if you can get it. Two lots make impostors honest. One lot still tests unit identity (same face vs other faces).

## Photograph (one hour, two sittings if possible)

Twenty fired-clay faces. Each face **twice**.

1. Crop later to about **5 × 5 cm** of the same region. Fill the frame enough that the crop is texture, not room.
2. Two captures per face. Different lighting and/or different day and/or different operator if you can. Same phone is fine.
3. Two lots if possible (A-01…A-10, B-01…B-10).
4. Save as `A-01_r1.jpg`, `A-01_r2.jpg`, … Same stem, `_r1` / `_r2` (or `_1` / `_2`).
5. No flash if it blows the clay white. Window light or shade. Do not rotate the crop 90° between reps unless you also record that.

Name the files so a script can pair them. The matcher is [optical_unit_identity.py](optical_unit_identity.py). One face can land before any pair exists — [experiment0_ingest.md](experiment0_ingest.md):

```
python protocol/optical_unit_identity.py --ingest path/to/A-01_r1.jpg
python protocol/optical_unit_identity.py --photos path/to/crops
```

`--ingest` writes a hash receipt. No EER. `--photos` scores only when two faces and a genuine pair exist. `--self-test` is a synthetic matcher check (warped noise). It does not measure a brick.

## Score

For every pair of crops: detect features (ORB, or SIFT if the OpenCV build has it), match, estimate a homography, score by inlier ratio (or the numpy fallback’s equivalent).

- **Genuine:** two photos of the same face.
- **Impostor:** two photos of different faces.

Report the two score distributions and the **equal-error rate**. Print a histogram. Do not convert EER into bits.

## Pass / fail

- **Pass:** genuine and impostor piles separate. A threshold exists where both error rates are small.
- **Fail:** overlap, or lighting / crop / operator collapse (genuines fall into the impostor pile). Unit identity by phone texture is dead for *these* faces and this lighting. Say so.

You are asking whether a cheap camera already does unit identity. If it does, the magnetic jig is not the first product for that job.

## Durability variant (same afternoon or a later one)

Repeat on a subset after abuse a mason would recognize:

- weathered / outdoor
- dusty
- painted
- mortar-smeared

Same pairing, same scores. **Pass:** still separated. **Fail:** paint or dust or mortar eats the texture. That is a result.

## Afterward

Publish the histograms, including a fail. Leave Afternoon Zero TMR on the calendar — batch magnetics was not tested here.

Magnetic unit-identity hardware stays on the shelf until this afternoon is done.
