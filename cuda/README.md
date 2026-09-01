# CUDA collab — Brickmark magnetoelastic pack

This folder is for a GPU seat. The sandbox that wrote Redcore has **no NVIDIA device** and **no COMSOL license**. Do not wait on that sandbox to “run MuMax3.” Run it here.

Physics in these scripts is textbook magnetite / hematite, not a density table.

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
2. `mumax/strain_sweep.mx3` — same pack, uniaxial strain 0.5–10 MPa via B1/B2, report Δm and ΔB.
3. `python/postprocess.py` — upward-continue the saved Bz to 1 mm and 5 mm, compare to `e^{-2πkh}`, then scale.
4. `comsol/hearthplate_spec.md` — the fire-coupon FEA. Separate code, separate machine.

## Pass / fail

WP1 pass: spatial power in Bz falls with standoff at least as fast as continuation. If it is *much* redder, the unit-assay pitch in Afternoon Zero stays ≥ 3 mm.
WP2 pass: ΔB at 5 MPa ≥ 3× the pack’s remount-equivalent noise (use 4 nT × scale factor as the floor until the lab measures remount).
WP2 fail: service-load 0.5–3 MPa is invisible. Then the fabric is research, not a product. That is an allowed outcome.

## Will not prove

- That a wall is memory.
- That a dinner plate holds Bach.
- Absolute bits per brick. Scaling a 4 µm pack to 220 cm² is an estimate, not a measurement. Afternoon Zero still owns that number.

## Hardware

- NVIDIA GPU, compute capability ≥ 5.0
- MuMax3 3.10+ matching the driver
- 8 GB VRAM is enough for this pack. 24 GB if you grow grains to 2 µm.

```
mumax3 mumax/brickmark_pack.mx3
python python/postprocess.py path/to/B_demag.ovf
```
