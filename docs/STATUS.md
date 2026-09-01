# Status — 31 August 2026 22:11 MDT

Public repo: https://github.com/stevoblevo/redcore
Site: https://redcore-skein1.vercel.app
Drive (owner must click Share for public access): https://drive.google.com/drive/folders/1snDbXGs7QKUMdul5sAnW6aWV_TePbfX2
GPU ask: https://github.com/stevoblevo/redcore/issues/1
Linear: https://linear.app/skeinshop/issue/SKEIN-199

## Living documents

- briefs/v3.md — current brief
- briefs/v4.md — registration-limited bits
- protocol/afternoon_zero.md — first physical afternoon
- cuda/README.md — MuMax3 pack + stock 3.12 glue (Mag caveat: Relax cannot lock TRM)
- cuda/CALL_FOR_GPU.md — one-hour volunteer ask

## Dest RTX 3070 (Night Shift) — honest, not a WP pass

- Smoke 64×32×4 @ 8 nm / 2 ns **ran** 20:31 MDT, stock mumax 3.12, ~86 s, energy dropped. That is CUDA prove, not TRM.
- Pack WP1 512×512×96 Relax **still in flight** as of **22:11 MDT** (~86 min wall). PID 17484. GPU 92 C, 100%, ~8 GB, SM ~1455 MHz. CPU time climbing (not hung). Out dir still empty (`log.txt`/`references.bib` only). Save waits until Relax finishes.
- GitHub `acb9d2e` README: grain demag ~0.20 T vs Earth 50 µT, so this Relax cannot lock lab TRM.
- Firebox no-run. No COMSOL. WP2 B1/B2 needs mumax3-me.
- Drive `04_cuda_collab`. Blevitude GrokShared + steven-exe inbox dropped. Mag `57374e5e` / Kiln `18a98307` match. Will not clobber CURRENT v3/v4/README/registration.py.

## Done (published, not a WP1 table)

- Stock 3.12 glue on `main` (`9290bd10`, README `acb9d2e`)
- Dest CUDA smoke executed (energy fell)
- v4 numpy assay run on box (87 indep / 63 extractable bits this run)
- Kiln coupling note on Blevitude (COMSOL did **not** run)

## Dead on arrival

Bed-face optical archive in a laid wall. 3 V brick-body ReRAM. Petabyte façade. PUF-as-crypto. Firebox storage. Dinner-plate-plays-Bach as a claim.

## Open

- Drive is not anyone-with-the-link from this connection.
- WP1/WP2 **pass table** still waits on a finished pack + postprocess.
- Afternoon Zero has not been run on real bricks.

## Token

A Pump.fun mint appeared after the intro tweet. It is not the project. No contract address belongs in this repo.
