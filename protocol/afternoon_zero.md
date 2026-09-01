# Redcore Afternoon Zero — easy-button protocol

The first physical try is **not** a fireplace and **not** a written plate.
It is twenty bricks, a $20 TMR breakout, a cradle with pins, and four measurements.
Everything below is what the sims say you should see. If reality disagrees, reality wins.

## Kit (~$150–400, one afternoon)

- 20 common red bricks, two lots if possible (home center + a second brand/pit)
- NVE ALT023 or ALT024 TMR breakout (~$20–25) or MDT TMR2102 (~$14)
- ADS1115 or similar 16-bit ADC + any USB MCU
- 3D-printed or plywood brick cradle with two alignment pins
- feeler gauges or 0.2 / 1 / 5 mm plastic shims
- a printed fridge-magnet sheet (forgery control)
- phone magnetometer only as a sanity check — it will see Earth, not the map

## Do not buy yet

- ceramic nanolayer write cell
- fireplace cassette hardware
- load frame

## Sequence

### Step 1. Bulk assay (~20 min)
One reading per brick, same pose, TMR at 5 mm. Earth subtracted.
- Pass: two lots separate more than they overlap.
- Fail does not kill unit assay. Batch and unit are different products.

### Step 2. Spectrum / standoff (~60 min)
One face. Scan a 3 mm grid at 1 mm and 5 mm standoff.
- Pass: spatial power drops like exp(−2πkh). Independent-cell count is tens-to-low-hundreds, not thousands.
- Fail: no structure, or spectrum too red. Unit assay stops.

### Step 3. Forgery control (~20 min)
Fridge-magnet sheet on a dummy face. Repeat 1 mm / 5 mm.
- Pass: film ratio B(1)/B(5) >> bulk (~4.8 vs ~1.06).
- Fail: cannot tell film from brick. Do not say PUF.

### Step 4. Remount BER (~40 min)
Ten remounts, two operators if you have them. Sign-quantise cells at 3 mm.
- Pass: BER under 8%. Model ~65 bits/face at SNR 10.
- Fail: BER > 15%. Fix the cradle before adding bricks.

## Already retired by simulation

Firebox as a computer (Curie 585 °C). Brick-body ReRAM at 3 V. Bed-face optical archive in a laid wall.

## Cannot retire in software

Hearthplate fire test (~800 MPa film stress through 1000 K). Real σ_B/n. Real batch separation.

The easy button is the cradle and the sequence. Not the wall.
