# WP4 — Hearthplate coupon (COMSOL or equivalent)

Not MuMax3. Different machine, different license. Do not stall WP1 on this.

## Geometry

- Substrate: α-alumina, 50 × 50 × 0.5 mm (coupon, not a dinner plate)
- Film: 15 nm generic ceramic oxide, bonded, no voids
- Optional glaze interlayer 2 µm if you have a stack from a vendor

## Materials (starting point)

| | Alumina | Film (scan) |
|---|---|---|
| E | 300 GPa | 150 GPa |
| ν | 0.22 | 0.25 |
| α | 8.0×10⁻⁶ /K | 4.0 and 12.0×10⁻⁶ /K (two runs) |
| k | 30 W/m·K | 5 W/m·K |
| strength | — | 100 and 400 MPa (two fail lines) |

## Loads

1. ASTM E119 1-hour furnace curve to ~927 °C, hold, cool 2 h.
2. Repeat + hose-stream quench: surface ΔT ≈ 800 K in 10 s on one face.

## Outputs

- Film in-plane principal stress vs time
- Whether max stress crosses 100 MPa (likely craze) or 400 MPa (almost sure craze)
- Residual stress at 25 °C after quench

CPU suite already says ~800 MPa for a 4×10⁻⁶ /K mismatch through 1000 K. COMSOL is to add the transient gradient and the quench, not to invent a new number.

## Pass

Film stays below the chosen strength through both curves. Then, and only then, a written coupon goes to a fire lab.

## Fail

Crazing predicted. Hearth cassette stays off the product list. The plate can still live in a service chase that never sees 900 °C.
