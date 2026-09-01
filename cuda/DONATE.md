# Donate one GPU-hour

Job A is **done** on the tower 1060 (Δmz 9.1e-5). See [results/JOB_A.md](results/JOB_A.md).

## Pick a job

| Job | Who | File |
|---|---|---|
| A done | — | `strain_sweep_ku.mx3` |
| **B-1060** | GTX 1060 6 GB / any 4–6 GB | `cuda/mumax/brickmark_pack_1060.mx3` |
| B official | 8 GB+ **with fans** | `cuda/mumax/brickmark_pack.mx3` — Relax, cooked dest |
| C | mumax3-me | `cuda/mumax/strain_sweep.mx3` |

Bot trigger for the local 1060: [results/JOB_B_1060.md](results/JOB_B_1060.md)

```bash
bash /boot/saelion/mumax/redcore/cuda/bot/run_job_b_1060.sh
```

Do not point the bot at `brickmark_pack.mx3`.
