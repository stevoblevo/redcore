# Job A — Tower GTX 1060, 1 September 2026 16:05–16:13 MDT

Source: [issue #1 comment](https://github.com/stevoblevo/redcore/issues/1#issuecomment-5501182118)

```
job: A
gpu: GTX 1060 6GB
mumax: 3.12 CUDA-12.6  driver 580.159.03  cc=6.1
wall_s: ~504
vet: ok
mx3_sha256: 11ab5d7cbb9d54ba3e5569ebd4815eaeb44534a656671166f72a63fd402d80e0
peak: 297 MiB / 77 C
```

| stress_Pa | mx | mz | E_total (J) |
|---:|---:|---:|---:|
| 0 | 0.001077 | 0.000850 | 2.658e-16 |
| 5e5 | 0.000223 | 0.000760 | 2.347e-16 |
| 2e6 | 0.000315 | 0.000868 | 2.287e-16 |
| 5e6 | 0.000135 | 0.000759 | 2.254e-16 |
| 1e7 | -0.000033 | 0.000683 | 2.215e-16 |

Δmz (0 → 5 MPa) = **9.1e-5**. Noise.

Not TRM. Not B1/B2. Not Job B. Dest 3070 parked.
ovf on tower `/boot/saelion/mumax/strain_sweep_ku.out/`.
