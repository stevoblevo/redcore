# Call for one GPU

Redcore needs one person to run two MuMax3 scripts. That is the whole ask.

Repo is public: https://github.com/stevoblevo/redcore
Issue: https://github.com/stevoblevo/redcore/issues/1

## You need

- NVIDIA GPU, compute capability ≥ 5.0, 8 GB VRAM is enough
- MuMax3 3.10+ built for your driver
- Python 3 + numpy
- About one hour

## You do

```
git clone https://github.com/stevoblevo/redcore.git
cd redcore
mumax3 cuda/mumax/brickmark_pack.mx3
mumax3 cuda/mumax/strain_sweep.mx3
python cuda/python/postprocess.py path/to/B_demag.ovf
```

Constants are magnetite textbook values. Do not edit them to make a prettier plot.

## You return

Comment on issue #1 or open a PR with `brickmark_continuation.json`, the strain printout, GPU model, MuMax3 version, wall time.

Fail is a result. If 0.5–3 MPa is invisible after fill-scaling, say so.

This is not a token, not a wall-computer, not a dinner plate that plays Bach.
