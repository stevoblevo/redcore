# Redcore

Fired clay already holds a magnetic map. That map is **provenance**, not memory.
The archive that belongs next to a house is a small ceramic plate a stranger in 2180 can read without our company, our format, or our drive.

This is not a wall that thinks. This is not a token.

## Start here

1. Buy the kit — [protocol/shopping.md](protocol/shopping.md) · **~$70–110**
2. Run the afternoon — [protocol/afternoon_zero.md](protocol/afternoon_zero.md)
3. Do not buy the furnace yet — [protocol/do_not_buy_yet.md](protocol/do_not_buy_yet.md)

Twenty common bricks. A $20 TMR board. A plywood cradle. Four measurements. Publish the fail if it fails.

## Reality program

[docs/SAELION_REALITY_PROGRAM.md](docs/SAELION_REALITY_PROGRAM.md) turns the surviving Redcore claims into a falsification staircase: cheap physical gates first, hostile baselines, explicit kill criteria, measurement before larger simulation, a naive-reader Hearthplate test, and an external-lab path that rents characterization instead of buying a laboratory.

## Three objects

| Object | What it is | What it is not |
|---|---|---|
| **Brickmark** | Magnetic provenance assay. Batch first. Course later. | A cryptographic PUF |
| **Hearthplate** | Self-describing ceramic plate for the 2180 reader | A petabyte façade |
| **Fabric** | Unwired magnetostriction re-scan | ReRAM / a mortar bus |

## Paper

- [briefs/v3.md](briefs/v3.md) — living brief
- [briefs/v4.md](briefs/v4.md) — registration-limited bits (~60/face at 1 mm, not 10⁴)
- [docs/STATUS.md](docs/STATUS.md)

## If you have a GPU

[Issue #1](https://github.com/stevoblevo/redcore/issues/1) · [cuda/README.md](cuda/README.md) · [cuda/CALL_FOR_GPU.md](cuda/CALL_FOR_GPU.md)

```
mumax3 cuda/mumax/brickmark_pack.mx3
mumax3 cuda/mumax/strain_sweep.mx3
python cuda/python/postprocess.py path/to/B_demag.ovf
```

Textbook magnetite constants. Fail is a published result.

## Dead on arrival — do not reopen

Bed-face optical archive in a laid wall. 3 V brick-body ReRAM. Petabyte-per-façade economics. PUF-as-crypto. Firebox storage (Curie 585 °C). A Pump.fun ticker as the project.

Site: https://redcore-skein1.vercel.app
