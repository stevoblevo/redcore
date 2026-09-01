# Redcore

Fired clay already holds a magnetic map. That map is provenance — not memory, not a hard drive, not a wall that thinks. The archive that belongs next to a house is a small ceramic plate a stranger in 2180 can read without our company, our format, or our drive.

**Current brief:** [briefs/v3.md](briefs/v3.md)  
**Addendum (registration bits):** [briefs/v4.md](briefs/v4.md)  
**CUDA collab (MuMax3 + COMSOL spec):** [cuda/README.md](cuda/README.md)  
**Shared Drive:** https://drive.google.com/drive/folders/1snDbXGs7QKUMdul5sAnW6aWV_TePbfX2

## Objects

| Object | What it is | What it is not |
|---|---|---|
| Brickmark | Magnetic provenance assay. Batch first. Course-level identity later. | A cryptographic PUF |
| Hearthplate | Self-describing ceramic plate for the 2180 reader | Cerabyte densities on a brick face |
| Fabric | Unwired magnetostriction re-scan | ReRAM, a mortar bus, memory |

## Do not reopen

Bed-face optical archive in a laid wall. 3 V brick-body ReRAM. Petabyte-per-façade economics. PUF-as-crypto. Place-binding-by-hash treated as physics.

## Month-one tests

1. Written nanolayer on alumina through an ASTM E119-class curve + hose-stream.
2. Spatial spectrum of one face at four standoffs vs `exp(-2πkh)`.
3. One brick in a load frame, 0.5–10 MPa.

## CUDA when a GPU exists

This repo cannot run MuMax3. A collaborator with NVIDIA CC ≥ 5.0 runs `cuda/mumax/brickmark_pack.mx3` then `cuda/python/postprocess.py`. Constants are magnetite textbook values (Ms 4.8e5, A 1.33e-11, Ku 1.4e4, λ100/λ111 −20/+78 ppm). The pack is 4 µm, not a brick. Scale B by oxide fill before comparing to a TMR.

v1 lives only as the document that was attacked.
