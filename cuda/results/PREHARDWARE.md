# Pre-hardware campaign — 1 September 2026

CPU suite. No NVIDIA in the authoring sandbox. Tower GTX 1060 already proved stock mumax runs.
This is the prove/disprove ledger software is allowed to write.

Script: `sim/prehardware_suite.py` (local artifacts). Numbers below from that run, seed 20260901.

## Dead in software (do not reopen)

- Bed-face optical archive in a laid wall — access geometry
- 3 V brick-body ReRAM — no switching oxide stack
- Petabyte facade — economics + substrate
- Firebox memory — Curie 585 °C
- Stock mumax Relax locks TRM with Ku_me at 2 MPa — energy budget + Tower 1060 net m~0
- PUF-as-crypto — entropy model + no extractor

## Energy budget (why the 1060 did not lock)

- Earth Zeeman density: **24.0 J/m³**
- Sphere demag: **48254.9 J/m³**
- Plate demag: **144764.6 J/m³**
- Magnetocrystalline K1: **13500 J/m³** (562× Earth)

| MPa | Ku_me J/m³ | vs Earth | vs sphere demag |
|---:|---:|---:|---:|
| 0.5 | 17.25 | 0.72 | 0.00036 |
| 2.0 | 69.0 | 2.88 | 0.00143 |
| 5.0 | 172.5 | 7.19 | 0.00357 |
| 10.0 | 345.0 | 14.38 | 0.00715 |
| 50.0 | 1725.0 | 71.88 | 0.03575 |

Ku_me at 2 MPa is 69 J/m³. Isolated-grain Relax cannot lock lab TRM. Real TRM is blocking-temperature physics, not this Ku.

## Fabric (order-of-magnitude)

| MPa | ΔB nT | vs 4 nT remount | ≥3× |
|---:|---:|---:|:---:|
| 0.5 | 2.09 | 0.52 | no |
| 1.0 | 4.19 | 1.05 | no |
| 2.0 | 8.38 | 2.09 | no |
| 5.0 | 20.94 | 5.24 | yes |
| 10.0 | 41.89 | 10.47 | yes |

Service masonry 0.5–2 MPa does not clear 3× in this model. Damage-scale 5–10 MPa does. Issue #6 still required.

## Film vs bulk (day-one discriminator)

- Bulk B(1 mm)/B(5 mm) = **1.061**
- Film B(1 mm)/B(5 mm) = **4.81**
- Separation **4.53×**

## Continuation redness (synthetic)

| ξ mm | std(1 mm)/std(5 mm) |
|---:|---:|
| 0 | 5.128 |
| 1 | 3.437 |
| 5 | 1.848 |
| 20 | 1.356 |
| 50 | 1.235 |

Grain-scale redness does not collapse the ratio. Forming-scale ξ does. Real face is still issue #3.

## Hearthplate

Model biaxial film stress **800 MPa**, quench **1120 MPa**. Unfalsifiable in software.

## Next GPU on the idle 1060

```
mumax3 cuda/mumax/strain_sweep.mx3
```

Do not rerun brickmark_firing expecting TRM lock. That claim is closed.
