# Afternoon Zero — kitchen-table protocol

The first physical try is **not** a fireplace and **not** a written plate. It is twenty bricks, a $20 TMR breakout, a cradle with pins, and four measurements.

- Shopping: [shopping.md](shopping.md) — every Buy cell is a purchase link
- Do not buy yet: [do_not_buy_yet.md](do_not_buy_yet.md)

If reality disagrees with the model, reality wins.

## Safety

Bricks are 2–3 kg. No glass table. Electronics are 3.3–5 V. Nothing goes in a fireplace.

## Label first

Pencil on the *end*, not the scan face:

```
A-01  HD RED0126  2026-09-01
B-01  HD used     2026-09-01
```

Lot A = one stack / one store. Lot B = the other. Mixed lots make the experiment garbage.

## Build the cradle (20 min)

A parking space so the brick sits in the same place every time.

1. Plywood ~12 × 6 inches.
2. Three rails. Brick slides in and stops. No wobble.
3. Two ¼″ dowel pins 4 inches apart.
4. Tape the TMR board so the chip faces *down* at the brick.
5. Standoff: **5 mm** first, **1 mm** later. Feeler gauges as spacers.

If the board rocks, the measurement is noise. The jig is the product.

## Wire it (15 min)

NVE ALT023-10E-EVB01: supply +, supply −, two bridge outputs.

1. Power from MCU 3.3 V or 5 V.
2. Bridge outputs to ADS1115 **A0 and A1 as a differential pair**.
3. ADS1115 I²C to the MCU. USB to the laptop.

Flash an ADS1115 example. Done when a fridge magnet waved six inches away jumps the number and empty hands do not. A phone compass is not the instrument.

## Zero the room (5 min)

No brick. Average 30 seconds. Call it **Z**. Later readings are **raw − Z**. No steel filing cabinet.

## Step 1 — Bulk assay (~20 min)

5 mm standoff. Two readings per brick, same pose. A-01…A-10 then B-01…B-10.

- **Pass:** A pile and B pile separate.
- **Fail:** overlap. Batch identity dead for *these lots*. Try another pit. Unit assay is a different product.

## Step 2 — One face, two heights (~60 min)

Strongest brick. 3 × 6 grid. 18 points at 5 mm, same 18 at 1 mm.

- **Pass:** 1 mm bumpier; bumps line up.
- **Fail:** TV snow, or 1 mm is a photocopy of 5 mm. Stop saying bits-per-brick.

You are asking whether a map exists, not computing 60 bits tonight.

## Step 3 — Fridge magnet (~20 min)

Sheet on cardboard, same two heights.

- **Pass:** sheet 1/5 mm ratio obviously bigger than the brick (model ~4.8 vs ~1.06).
- **Fail:** cannot tell film from clay. Do not say PUF.

## Step 4 — Remount (~40 min)

Same brick, 1 mm, center. Ten reseats. Second operator if present.

- **Pass:** numbers agree within a few percent.
- **Fail:** tighten the cradle before buying more bricks.

## What the number should look like

Face fields 1–10 µT on Earth ~50 µT. TMR at 5 V and 200 mV/V/mT ≈ 1 mV per µT. You want millivolts after subtracting Z. If a fridge magnet from two feet to two inches does nothing, the wiring is wrong, not the brick.

Publish the four plots, including a fail. The easy button is the cradle. Not the wall.
