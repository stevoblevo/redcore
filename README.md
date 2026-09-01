# Redcore

Fired clay already holds a magnetic map. That map is provenance — not memory, not a hard drive, not a wall that thinks. The archive that belongs next to a house is a small ceramic plate a stranger in 2180 can read without our company, our format, or our drive.

**Brief:** [briefs/v3.md](briefs/v3.md) · **Bits:** [briefs/v4.md](briefs/v4.md) · **First afternoon:** [protocol/afternoon_zero.md](protocol/afternoon_zero.md)  
**CUDA / MuMax3:** [cuda/README.md](cuda/README.md) · **Need a GPU:** [issue #1](https://github.com/stevoblevo/redcore/issues/1)  
**Status:** [docs/STATUS.md](docs/STATUS.md) · **Site:** https://redcore-skein1.vercel.app  
**Drive:** https://drive.google.com/drive/folders/1snDbXGs7QKUMdul5sAnW6aWV_TePbfX2

## Objects

| Object | What it is | What it is not |
|---|---|---|
| Brickmark | Magnetic provenance assay. Batch first. Course-level identity later. | A cryptographic PUF |
| Hearthplate | Self-describing ceramic plate for the 2180 reader | Cerabyte densities on a brick face |
| Fabric | Unwired magnetostriction re-scan | ReRAM, a mortar bus, memory |

## Run without a GPU

```
python sim/redcore_registration.py
python sim/redcore_physics_suite.py
```

## Run with a GPU

```
mumax3 cuda/mumax/brickmark_pack.mx3
mumax3 cuda/mumax/strain_sweep.mx3
python cuda/python/postprocess.py path/to/B_demag.ovf
```

## Do not reopen

Bed-face optical archive in a laid wall. 3 V brick-body ReRAM. Petabyte-per-façade economics. PUF-as-crypto. Place-binding-by-hash treated as physics. Firebox storage. A Pump.fun ticker as the project.

v1 lives only as the document that was attacked.
