# Tower GTX 1060 CUDA prove — 1 September 2026

Source: Drive `04_cuda_collab` (TOWER_1060_CUDA_PROVE.md, brickmark_firing_1060_table.txt, log). Not WP1. Not TRM. Not a PUF.

## Host

Unraid Tower, GTX 1060 6 GB, driver 580.159.03, mumax 3.12 CUDA-12.6, cc=6.1, commit 6e5c98bb.
Timestamp in log: 2026-09-01 14:26:52. Wall **248 s**. Peak VRAM **297 MiB**. Exit 0.

Deck `brickmark_firing_1060.mx3` sha256 `91139626ed6c79c08e2ab925e543c0ed97326263b785ef33e8a07abc4bc7eb92`.
12 Superball grains, 256×128×16 @ 8 nm. SetSolver(5), FixDt 1e-13, run(5e-10). Ku_me = 1.5 λs σ at 2 MPa ≈ 69 J/m³. B_ext = 50 µT.

## Table (from Drive)

| t (ns) | mx | my | mz | E_total (J) |
|---:|---:|---:|---:|---:|
| 0.0 | 0.0005 | −0.0004 | −0.0009 | 8.273e-15 |
| 0.1 | 0.0026 | −0.0130 | −0.0070 | 4.589e-17 |
| 0.5 | 0.0038 | −0.0131 | −0.0074 | 3.179e-17 |

Net m at 0.5 ns ≈ (0.0038, −0.0131, −0.0074). **Not locked to Earth.** Energy drop is demag relaxing, same story as the dest 3070 86 s smoke.

## ovf hashes (binaries not in Drive)

```
8587d85e3920766a622878fee2cb655a3de90b5474e9710b8a92fa57e72cdf7a  m000000.ovf
6cfde5b228a4cc9b43ca199eda720c38cc6d7b7b5212715cf1e9bd5676b1f8d7  B_demag000000.ovf
808f0b49437d967147fe2b521acfa4e496b8564e1e08703eaf180ea9b1323901  m_z000000.ovf
```

Live on tower: `/boot/saelion/mumax/brickmark_firing_1060.out/`

## What this proves

Stock mumax 3.12 + SetSolver(5) runs on Pascal 6 GB. Grain demag still beats the 2 MPa magnetoelastic placeholder. You cannot lock lab TRM with this Ku.

## What this does not prove

Unit identity. Batch assay. Fabric ΔB at 5 MPa. Upward continuation on a real face. The GitHub charity pack (`brickmark_pack.mx3` + `strain_sweep.mx3`) still has no public table.
