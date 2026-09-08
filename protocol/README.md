# Protocol

Do these in order.

0. [experiment0.md](experiment0.md) — photograph 20 clay faces twice. **$0.** Send the zip on [issue #11](https://github.com/stevoblevo/redcore/issues/11).
1. [shopping.md](shopping.md) — what to buy this week (~$70–110)
2. [afternoon_zero.md](afternoon_zero.md) — kitchen-table TMR
3. [experiment0_optical.md](experiment0_optical.md) / [experiment0_ingest.md](experiment0_ingest.md) — optical unit-identity matcher; one labeled crop can land (`--ingest`). Complementary to TMR, not a replacement.
4. [do_not_buy_yet.md](do_not_buy_yet.md) — $200 to $400k, and when each is allowed

You do not need git for step 0. Land one crop later: `python protocol/optical_unit_identity.py --ingest path/to/A-01_r1.jpg`. Matcher check only: `--self-test`. Paired scoring: `--photos path/to/crops`.
