# Donate one GPU-hour

The authoring sandbox has no NVIDIA. Dest RTX 3070 is parked (thermal kill). Tower GTX 1060 already proved stock mumax 3.12 runs.

You run a deck. You give back a table. Fail is useful.

## Pick a job

| Job | Who | Wall | File |
|---|---|---|---|
| **A** (do this) | Any NVIDIA ≥ 4 GB, stock mumax 3.10–3.12 | 5–15 min | `cuda/mumax/strain_sweep_ku.mx3` |
| **B** | 8 GB+, watch temperature | ≤ 1 h | `cuda/mumax/brickmark_pack.mx3` |
| **C** | mumax3-me only (B1/B2 exist) | ≤ 1 h | `cuda/mumax/strain_sweep.mx3` |

Do **not** run another firing-smoke looking for net-m lock. That claim is closed: Ku at 2 MPa is 69 J/m³ vs sphere demag 4.8×10⁴. See [results/PREHARDWARE.md](results/PREHARDWARE.md).

6 GB Pascal (GTX 1060 class): **Job A only.** Job B filled an 8 GB 3070 and then cooked it.

## Commands

```bash
git clone https://github.com/stevoblevo/redcore.git
cd redcore
mumax3 -vet -http= cuda/mumax/strain_sweep_ku.mx3
mumax3 -http= cuda/mumax/strain_sweep_ku.mx3
```

`-http=` stops mumax opening a browser. If `-vet` fatals, paste the first error on issue #1 and stop.

Job B / C the same way on their files. Job C: if `B1` is undefined you do not have the ME fork. Run A instead. Do not invent B1.

## Give back (any one channel)

1. Comment on https://github.com/stevoblevo/redcore/issues/1
   or open a PR adding `cuda/results/donated/<yourname>/`
2. Optional Drive drop:
   https://drive.google.com/drive/folders/1SZI1jV4Xwwp9IS8huDekkeqmjx6YxQjq

### Minimum paste

```
job: A
gpu: <model>  vram: <GB>
mumax: <version>  driver:
wall_s:
vet: ok | fail <one line>
stress_Pa lines from stdout:
sha256 of the .mx3 you ran:
```

Copy [RECEIPT.md](RECEIPT.md). Attach `table.txt` if small. ovf only if < 25 MB or sha256 + a link.

### Do not send

- Rewritten Ms / A / λ / Ku “to make it prettier”
- A token screenshot
- A claim that net m locked to Earth

## How we will read it

- Job A: Δmz between 0 and 5 MPa. If it is noise, Fabric stays a damage-scale hypothesis.
- Job B: `python cuda/python/postprocess.py path/to/B_demag.ovf`. Continuation vs exp(-2πkh). Still not lab TRM.
- Job C: same Δm table, cubic magnetostriction, only if B1 existed.

Physical bricks remain issue #2. This page does not replace them.
