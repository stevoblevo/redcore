# Fabric-as-write is dead in this RVE

Three finished Tower 1060 tables, same 12-grain class, stock mumax 3.12, SetSolver 5. Dest 3070 not used.

| Run | Deck | Δmz 0→10 MPa (or 5) | Read |
|---|---|---:|---|
| RT B1/B2 compression | `strain_sweep_1060.mx3` | ~2e-4 | [issue](https://github.com/stevoblevo/redcore/issues/1#issuecomment-5500324436) |
| K1 off, 0.95 Tc, compress | `firing_lock_compress_1060.mx3` | 1.06e-3 | [issue](https://github.com/stevoblevo/redcore/issues/1#issuecomment-5500800357) |
| **Job A Ku proxy** | `strain_sweep_ku.mx3` | **9.1e-5** at 5 MPa | [JOB_A.md](JOB_A.md) |

mz stays ~10⁻³. Not a write. Unwired Fabric is not a masonry-stress memory in this representative volume.

Issue #6 (real load-frame) is confirmation, not a rescue hatch. Do not buy COMSOL for this claim.

What Fabric can still be, if anything: a damage-scale re-scan after cracking, measured on a brick, not simulated here.
