# CUDA collab — Brickmark magnetoelastic pack

This folder is for a GPU seat. The sandbox that wrote Redcore has **no NVIDIA device** and **no COMSOL license**. Do not wait on that sandbox to “run MuMax3.” Run it here.

Physics in these scripts is textbook magnetite / hematite, not a density table.

## Stock mumax 3.12 glue (Windows dest, 2026-08-31)

`sphere()` / `Save(mz)` / `[]float64{…}` fail on stock mumax **3.12**. These decks now use:

- `Superball(2*r, 1)` for a sphere of radius `r` (p=1). Geometry unchanged.
- `Save(m.Comp(2))` and `m.Comp(0).Average()` / `m.Comp(2).Average()`
- WP2 stresses unrolled (no composite literals)

Constants (Ms, A, Ku, λ / B1 / B2) are unchanged. `SetSolver(9)` is the Vanderveken ME fork — it fatals on stock 3.12. RK45 is `SetSolver(5)`. The live firing deck `57374e5e` is already solver 5. Do not rewrite it with 9.

WP2 `B1`/`B2`/`exx` are Vanderveken ME. **Vet first:** `mumax3 -vet -http= cuda/mumax/strain_sweep.mx3`. If `B1` is undefined, skip WP2. Do not invent B1. Do **not** swap in `Ku1=(3/2)λσ` and call it the same energy: Ku is uniaxial along AnisU; B1/B2 is cubic magnetostriction on the full strain tensor. The dest CUDA prove used Ku, not B1.

WP2 comment says compression along Z; `sig>0` and `ezz=sig/E` is tension. Flip `sig` for masonry compression. `E=230 GPa`, `nu=0.26` are Fe3O4 grain stiffness, not clay.

## Honest limits of this WP1 Relax()

`Relax()` exists on stock 3.12. Grain demag is ~μ₀ Ms/3 ≈ 0.20 T vs Earth 50 µT, so Relax **cannot lock TRM**. When `brickmark_pack.out` lands, interpret `demag_relaxing` vs anis-uniform candidate, never lab TRM.

## Dest seat (not a WP pass)

Night Shift dest RTX 3070, stock mumax 3.12:

- Smoke 64×32×4 @ 8 nm / 2 ns **ran** 2026-08-31 20:31 MDT, ~86 s, energy dropped. That is not the pack.
- Pack WP1 512×512×96 Relax **in flight** as of 21:01 MDT (thermal throttle ~92–93 C). Save waits until Relax finishes. Do not treat comments as a table.
- Firebox is a no-run (T > Curie). No COMSOL.
- Drive collab folder `04_cuda_collab`: https://drive.google.com/drive/folders/1SZI1jV4Xwwp9IS8huDekkeqmjx6YxQjq

## What is known to work

| Fact | Number | Why we trust it |
|---|---|---|
| Magnetite Curie | 580–585 °C | Dunlop & Özdemir |
| Hematite Néel | ~675 °C | same |
| Magnetite Ms (RT) | 4.8×10⁵ A/m | Smit & Wijn / Tauxe 2002 |
| Magnetite A | 1.33×10⁻¹¹ J/m | Heider & Williams 1988 |
| Magnetite K1 | −1.25 to −1.36×10⁴ J/m³ | Fletcher / Joffe |
| Exchange length | ℓ_ex = √(2A/μ₀Ms²) ≈ 8–10 nm | cell size must be ≤ this |
| Magnetite λ100, λ111 | ≈ −20×10⁻⁶, +78×10⁻⁶ | standard cubic constants |
| Earth field at lock-in | ~50 µT | TRM writing field |
| Brick Fe-oxide fraction | 2–8 wt% typical reds | composition, not a guess |
| Upward continuation | B̃(k,h) ∝ B̃(k,0) e^{-2πkh} | potential theory, exact in free space |

## What MuMax3 can actually compute

A **representative grain pack**, not a brick.

A 215×102 mm face at 8 nm cells is ~10¹⁴ cells. Impossible.
This pack is 4 µm × 4 µm × 0.8 µm of magnetite grains in a non-magnetic matrix — the smallest volume that still has a spatial spectrum. After the run, **scale the stray field by the brick’s oxide filling fraction** (~0.03–0.06 by volume) before comparing to a TMR 1 mm away.

Hematite Ms is ~200× smaller than magnetite. If the brick’s remanence is magnetite/maghemite-dominated (common after firing in reducing pockets), magnetite is the right first material. Hematite is WP3, not WP1.

## Work packages

1. `mumax/brickmark_pack.mx3` — relax a random grain pack in 50 µT, snapshot M, save B at z = 0.
2. `mumax/strain_sweep.mx3` — same pack, uniaxial strain 0.5–10 MPa via B1/B2, report Δm and ΔB. Needs mumax3-me for B1/B2.
3. `python/postprocess.py` — upward-continue the saved Bz to 1 mm and 5 mm, compare to `e^{-2πkh}`, then scale.
4. `comsol/hearthplate_spec.md` — the fire-coupon FEA. Separate code, separate machine.

## Pass / fail

WP1 pass: spatial power in Bz falls with standoff at least as fast as continuation. If it is *much* redder, the unit-assay pitch in Afternoon Zero stays ≥ 3 mm.
WP2 pass: ΔB at 5 MPa ≥ 3× the pack’s remount-equivalent noise (use 4 nT × scale factor as the floor until the lab measures remount).
WP2 fail: service-load 0.5–3 MPa is invisible. Then the fabric is research, not a product. That is an allowed outcome.

Dest WP1 in flight is **not** a pass until `postprocess.py` prints the continuation table. A finished Relax() is still not lab TRM.

## Will not prove

- That a wall is memory.
- That a dinner plate holds Bach.
- Absolute bits per brick. Scaling a 4 µm pack to 220 cm² is an estimate, not a measurement. Afternoon Zero still owns that number.
- That WP1 Relax() wrote TRM. Grain demag (~0.20 T) dominates Earth field (50 µT).

## Hardware

- NVIDIA GPU, compute capability ≥ 5.0
- MuMax3 3.10+ matching the driver. Stock 3.12: use the glue above. ME fork for WP2 B1/B2.
- 8 GB VRAM is enough for this pack (dest 3070 fills ~8 GB). 24 GB if you grow grains to 2 µm.

```
mumax3 -vet -http= mumax/brickmark_pack.mx3
mumax3 mumax/brickmark_pack.mx3
python python/postprocess.py path/to/B_demag.ovf
```
