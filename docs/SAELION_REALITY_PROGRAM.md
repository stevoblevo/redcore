# Redcore Reality Program — Saelion review and hardening

**Status:** proposed evidence program, 1 September 2026  
**Scope:** current Redcore only. v3 + v4 + current Night Shift evidence.  
**Rule:** reality outranks prose, simulation, branding, and hope.

Redcore is now interesting because it has become smaller.

The surviving program is not “a wall that thinks.” It is three experimentally separable objects:

1. **Brickmark** — a magnetic provenance assay for fired clay. Batch provenance first; spatial/unit or course identity only if repeatability survives measurement.
2. **Hearthplate** — a removable, self-describing ceramic archive whose first customer is a future reader who does not have our software, company, or storage drive.
3. **Fabric** — an unwired magnetostriction re-scan hypothesis that is allowed to die in one afternoon if stress-induced magnetic change does not clear noise and remount error.

The struck v1 claims stay dead: no bed-face archive in a laid wall, no 3 V brick-body ReRAM, no petabyte-façade value proposition, no PUF-as-crypto, no firebox computer.

---

## 1. What the evidence already supports

### 1.1 Fired brick really does carry magnetic information

Fired archaeological brick is a standard archaeomagnetic material. Published work reports thermoremanent/natural remanent magnetization and magnetic susceptibility in red and grey bricks, with spatial differences caused by firing history, mineral transformations, and uneven heating. This establishes a real signal family worth measuring. It does **not** establish a commercial provenance assay or a unique brick identifier.

Reference:
- Frontiers in Earth Science, *Magnetic characteristics of Chinese archaeological bricks and their implications for archaeomagnetism* (2023): https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2023.1272317/full

### 1.2 Brick provenance is a real problem with existing baselines

Portable XRF has already been used to classify or source bricks by production site/manufacturer. Redcore therefore must beat or complement easier baselines, not pretend it owns the category.

References:
- Dillian & High, *Using pXRF spectrometry for brick characterization and sourcing at Boone Hall Plantation* (2022): https://www.sciencedirect.com/science/article/pii/S2352409X22001079
- Multi-state historic brick grouping by pXRF (718 readings): https://www.sciencedirect.com/science/article/pii/S2352409X22004801
- Bonizzoni et al., XRF/TXRF/pXRF provenance classification of archaeological bricks (2013): https://analyticalsciencejournals.onlinelibrary.wiley.com/doi/10.1002/xrs.2465

### 1.3 A self-describing physical archive has strong precedent

The Long Now / Rosetta Disk approach is the correct conceptual comparison for Hearthplate: visible-scale cues lead the reader toward magnification; physical page images avoid dependence on a specific digital platform; the artifact teaches the reader that more information exists at smaller scale.

References:
- Rosetta Project technology: https://rosettaproject.org/disk/technology/
- Rosetta interactive / visible-to-microscopic primer concept: https://rosettaproject.org/disk/interactive/
- Long Now discussion of self-decoding archives: https://longnow.org/ideas/decoding-long-term-data-storage/

### 1.4 Ceramic nanolayer laser writing is real, but our stack is not proven

Cerabyte publicly describes a thin ceramic nanolayer on glass written by ultrashort laser pulses and read optically with microscope optics and image sensors. This supports the media family and read/write method. It does **not** prove that a Redcore coating on alumina survives our target heat, quench, abrasion, soot, alkalinity, or century-scale environment.

Reference:
- Cerabyte Ceramic Nano Memory white paper: https://www.cerabyte.com/wp-content/uploads/2024/04/Cerabyte-OCP-White-Paper-Ceramic-Nano-Memory.pdf

---

## 2. Corrections that harden the current design

### 2.1 Do not call the cheap TMR screen “bulk susceptibility”

The current kitchen-table protocol is valuable, but terminology must remain honest.

A fixed TMR bridge above a brick measures a geometry-dependent component of the local stray field. It is **not** an AC susceptibility measurement and it is not the full NRM vector or magnitude. Published brick work measures susceptibility with dedicated AC instruments and remanence with magnetometers.

Therefore:

- call the first $20-board measurement a **cheap remanent-field screen** or **near-field assay**;
- reserve **susceptibility χ** for an actual susceptibility instrument;
- reserve **NRM** for a properly characterized remanent-magnetization measurement.

This distinction matters because a provenance product cannot be built on a mislabeled observable.

### 2.2 The identity unit may be a course, not a brick

The v4 registration model corrected the earlier independence-count error. The current modeled result is roughly:

- ~87 independent cells in the executed v4 run;
- ~63 extractable bits/face in the favorable modeled case;
- roughly 252–504 bits for a 4–8 brick course if aggregation is valid.

Those are **model outputs, not measured entropy**. The course-level proposal survives only if real scans show the assumed spatial spectrum and remount/aging BER stays acceptable.

### 2.3 Measurement must precede larger simulation

The current MuMax3 CUDA smoke proves the code path and GPU, not Brickmark physics. The observed relaxation was demagnetization relaxation, not a validated thermoremanent brick model.

The correct loop is:

**brick → measurement → material characterization → small representative magnetic model → predicted sensor field → measured comparison → larger model**

not:

**larger model → confident story → brick**.

A 220 cm² face at exchange-length resolution is also the wrong first computational abstraction. Use small representative volumes informed by measured phase/grain/material data, then propagate their fields to sensor standoff with magnetostatics/upward continuation.

### 2.4 Brickmark needs a hostile baseline

For every magnetic classifier, run at least these competing features on the same labeled samples:

- RGB / calibrated photography;
- dimensions, mass, density;
- inexpensive surface texture metrics;
- pXRF where available;
- true susceptibility / NRM on a subset if a laboratory partner is available.

If photography or pXRF trivially outperforms Brickmark, that is not failure of the research program. It tells us whether magnetics should be the product, an additional feature, or abandoned.

---

## 3. The falsification staircase

No expensive stage starts until the cheaper stage earns it.

### WP0 — preserve the evidence lineage

**Question:** Are current claims mechanically tied to current evidence rather than struck v1 artifacts?

Do:
- keep v1 and struck JSON explicitly marked historical;
- preserve raw data, scripts, versions, command lines, hardware, calibration notes, and failure outputs;
- never replace a failed result with a prettier summary without retaining the raw failure.

**Pass:** a stranger can reproduce what was run and distinguish measured, simulated, inferred, and proposed claims.

---

### WP1 — Afternoon Zero: prove that ordinary bricks are measurable

**Cost:** ~$70–110 + 20 common fired-clay bricks.

Do:
- 10 bricks from lot/pit A, 10 from genuinely different lot/pit B;
- fixed cradle; no steel bench; ambient zero; blind labels;
- cheap TMR near-field screen at controlled pose and height;
- one face at multiple points and at 5 mm / 1 mm height;
- remount ten times; second operator if possible;
- magnetic-sheet control to test whether a surface film can mimic the height behavior.

Hardening additions:
- randomize A/B measurement order after the initial instrumentation sanity check;
- record temperature and nearest large steel objects;
- repeat empty-jig zero periodically to measure room drift;
- save raw ADC counts as well as converted units;
- photograph every brick and fixture position.

**Pass:** repeatable signal and a spatial map that changes with standoff in a physically coherent way.

**Fail:** sensor output is dominated by room drift, jig motion, wiring, or unrepeatable placement. Fix the instrument before making any brick claim.

---

### WP2 — Spectrum Gate: attack the load-bearing v4 assumption

**Question:** Does the real spatial field have enough high-spatial-frequency structure to support the v4 bit-count model?

This is the highest-value cheap experiment for unit/course identity.

Do:
- choose one strong, representative face;
- scan a defined patch at 0.25–0.5 mm pitch;
- repeat at 0.5 / 1 / 2 / 5 mm standoff;
- estimate spatial PSD and 2-D autocorrelation;
- compare height evolution with the expected upward-continuation attenuation `exp(-2π k h)`;
- estimate independent modes/cells from measured autocorrelation, not raw sample count.

Controls:
- empty-jig scan;
- magnetic-film control;
- repeated scan without remount;
- repeated scan after remount.

**Pass:** measured spectrum and height attenuation support a nontrivial number of stable independent modes.

**Fail:** the source spectrum is much redder/smoother than assumed, or remount/environmental error dominates. Then the single-brick unit product is abandoned or downgraded; batch provenance may still survive.

Do not quote “bits per brick” before this experiment.

---

### WP3 — True provenance study: batch first, blind and comparative

**Question:** Can the assay classify manufacturing provenance on samples it did not train on?

Minimum useful design:
- 100+ bricks if practical;
- at least two known production lots, preferably multiple plants/pits/firings;
- provenance metadata recorded before measurement but hidden from the classifier/operator during analysis;
- train/test split by lot, not by individual scan;
- repeat measurements on a subset to estimate within-unit instrument variance.

Measure:
- cheap magnetic near-field features;
- dimensions / mass / photographs;
- pXRF where available;
- true AC susceptibility and/or NRM on a lab subset.

Report:
- confusion matrix;
- held-out accuracy;
- calibration / uncertainty;
- effect of operator and standoff;
- whether magnetics adds information beyond pXRF/optical/physical baselines.

**Pass:** out-of-sample provenance separation that survives repeated operators and an honest baseline comparison.

**Fail:** distributions overlap or performance is explainable by trivial color/geometry only. Do not rescue the claim with unit-map rhetoric.

---

### WP4 — Identity / course stability: prove repeatability before security language

**Question:** Can a spatial map be re-established months/years later under changed conditions?

Do:
- two operators;
- ≥10 remounts/operator;
- controlled lateral/standoff error sweeps;
- thermal cycling in known ambient field;
- steel-object/environment perturbation trials;
- 1-, 4-, and 8-brick aggregates;
- report BER distributions, not one favorable example.

Current modeled jig target to test rather than assume:
- lateral repeatability ≤ 0.25 mm;
- standoff repeatability ≤ 0.2 mm;
- adequate spatial SNR;
- BER stable enough that helper-data overhead is reasonable.

**Pass:** stable, reproducible maps under realistic remount and thermal/environment variation.

**Fail:** single-brick identity is abandoned. Course-level aggregation is allowed only if measured course BER earns it.

Still not a cryptographic PUF.

---

### WP5 — Fabric kill test: one afternoon in a load frame

**Question:** Does realistic compressive stress create a magnetic delta large enough to survive remount/environment noise?

Do:
- one brick or representative coupon;
- fixed sensor geometry;
- 0.5 / 1 / 2 / 5 / 10 MPa load points;
- unload/reload hysteresis cycle;
- stationary-sensor noise baseline;
- remount-equivalent noise benchmark;
- repeat to separate reversible stress response from damage.

**Pass criterion:** ΔB at 5 MPa ≥ 3× measured remount-equivalent noise, with reproducible sign/trend.

**Fail:** <3×. Fabric dies. No “maybe with better AI.”

---

### WP6 — Hearthplate 0.1: prove self-decoding before proving density

**Question:** Can a person who has never seen the format recover a page without us?

Build a low-density coupon first.

Outer layer:
- visible human-readable title / date / purpose;
- decreasing-scale visual spiral or ladder that implies “magnify”; 
- simple diagrams defining orientation and scale;
- no compression;
- no encryption;
- no proprietary decoder requirement.

Inner machine region:
- simple published raster/geometry;
- repeated headers;
- explicit checksums / ECC description in human-readable form;
- multiple redundant copies;
- payload can be tiny for the first test.

Naive-reader test:
- give the object to a technically literate person who has not read the spec;
- allow ordinary camera/microscope tools;
- time whether they can discover, orient, magnify, and recover one page.

**Pass:** reader recovers a page without project-specific coaching.

**Fail:** the archive is not self-describing yet, regardless of media longevity.

---

### WP7 — Hearthplate survival: coupon abuse before wall-scale fire testing

Progressive tests:
1. repeated moderate thermal cycles;
2. high-temperature furnace excursion appropriate to the chosen substrate/coating;
3. water quench / hose-stream-like thermal shock;
4. humidity / wet-dry cycling;
5. alkaline exposure representative of masonry environments;
6. abrasion / soot contamination / cleaning;
7. optical readability and raw BER after each stage.

Only after coupons survive should the project pay for a formal wall-assembly fire test.

**Pass:** primer remains visually interpretable and machine region stays within a published ECC budget.

**Fail:** coating crazes, delaminates, or loses readability. Change stack/substrate or stop.

---

## 4. External laboratory path — UTEP is unusually well matched

The project is physically near a university with facilities that cover most high-value characterization without buying capital equipment.

### Magnetic characterization

UTEP NanoLand lists:
- vibrating-sample magnetometer, ±3 T;
- temperature range 50–1000 K;
- vacuum tube furnace to 1200 °C.

Source: https://www.utep.edu/science/physics/research/facultyresearchareas/nanoland.html

Use for:
- representative material hysteresis / magnetic response;
- temperature dependence;
- testing whether textbook magnetite parameters are even the right inputs for MuMax.

### Mechanical testing

UTEP Keck Center lists tensile, compression, impact, flexural, and cyclic testing in controlled-temperature environments.

Source: https://www.utep.edu/keck/facilities/mechanical-testing.html

UTEP Smart Materials Processing also lists Instron and dynamic load-frame equipment plus furnaces and surface profilometry.

Source: https://www.utep.edu/engineering/smp/facilities/equipment.html

Use for:
- WP5 Fabric compression;
- controlled remount/load fixtures;
- specimen characterization.

### Thin films / microscopy / profilometry / thermal processing

UTEP PREM facilities list RF/DC sputtering, a 1200 °C rapid thermal processor, SEM, XRD, Raman, and a Dektak surface profilometer.

Source: https://www.utep.edu/science/nsf-prem/facilities/facilities.html

Use for:
- Hearthplate thin-film coupons;
- coating thickness/roughness;
- phase/morphology checks before and after abuse.

### Femtosecond micromachining

UTEP houses a six-axis femtosecond laser micromachining system described as capable of machining ceramics, glass, and crystals with micron/submicron features.

Source: https://www.utep.edu/newsfeed/campus/utep-houses-exclusive-femtosecond-laser-machine-as-part-of-multiple-doe-grants-through-honeywell-fmt.html

Use for:
- early Hearthplate visible→microscopic primer experiments;
- direct comparison of substrate/coating writeability.

**Recommendation:** collaborate/rent facility time. Do not buy a VSM, sputter/ALD tool, femtosecond writer, or formal fire-test apparatus for this phase.

---

## 5. Simulation policy

Simulation is useful only when it narrows an experiment or explains a measured result.

### Keep

- v4 registration/upward-continuation model as a falsifiable prediction of the spectrum gate;
- small MuMax representative-volume models once material parameters are tied to measurements;
- thermal/fire models for test design, not product certification.

### Do not claim

- a CUDA run proves TRM;
- an idealized RVE proves a brick face;
- simulated “bits” are measured entropy;
- a thermal model replaces E119 or coupon testing;
- a model parameter copied from magnetite literature is the measured value for a commercial brick.

Every simulation artifact should carry:
- model version/commit;
- exact constants and source for each;
- geometry and length scale;
- hardware/software version;
- raw outputs;
- what real measurement could falsify it.

---

## 6. Skepticism register

These are deliberately unresolved.

### Brickmark

- Is the useful magnetic variance actually production-correlated or mostly local firing/position noise?
- Does the spatial spectrum contain enough independent structure at achievable standoff?
- Can a low-cost fixture reproduce lateral position well enough on rough installed masonry?
- How fast does VRM / thermal history degrade the map?
- Does course aggregation increase forgery cost, or merely require printing more magnetic maps?
- Does magnetics add information beyond pXRF, photography, density, and ordinary supply-chain metadata?
- Can the product remain useful if its strongest outcome is only batch/pallet verification?

### Hearthplate

- Which substrate/coating pair survives thermal shock and masonry chemistry?
- How much analog/human-readable structure is enough for a 2180 reader?
- What is the simplest inner encoding whose decoding procedure can itself be printed on the object?
- How should copies be distributed so “situated archive” does not become single-site fragility?
- Can a removable cassette remain accessible without compromising fire rating, waterproofing, or aesthetics?

### Fabric

- Is service-level stress response simply below practical sensor/remount noise?
- Are any observed deltas reversible magnetostriction, irreversible cracking/damage, ambient field change, or fixture motion?
- If only damage-scale events are detectable, is that useful enough to justify a separate product rather than ordinary structural sensors?

### Program-level

- Does Redcore solve a problem people will pay for, or merely demonstrate beautiful physics?
- Which claim is the true wedge: construction-material provenance, long-life civic archive, conservation science, or something else?
- Can the system remain inspectable and boring enough that masons, archivists, conservators, and future readers trust it?

---

## 7. Design principles

1. **Evidence first.** Measure before naming a product.
2. **Cheap falsifier first.** A $20 sensor gets to kill a $20k idea.
3. **Controls are part of the invention.** Empty jig, magnetic film, pXRF, photography, second operator, blind labels.
4. **No category inflation.** Near-field screen ≠ susceptibility. Provenance assay ≠ PUF. Simulation ≠ measurement.
5. **Human-readable outer contract.** Future readers should not need our binary, company, or cloud.
6. **Removable beats entombed.** Accessible cassette, never bed face, never firebox.
7. **Failure is publishable.** A clean kill is useful research.
8. **Models must point to their falsifier.** If no experiment can prove the model wrong, it is not doing engineering work.
9. **Compete against the easy method.** If a camera or pXRF wins, learn from it.
10. **Do not buy the lab.** Use facilities until the evidence justifies capital.

---

## 8. Immediate order of operations

1. Run **Afternoon Zero** on real bricks.
2. Build the smallest repeatable XY/Z scanner needed for the **Spectrum Gate**.
3. Perform the spectrum/standoff experiment before quoting any unit-bit number.
4. Design the 100+ brick blind provenance study and include pXRF/optical baselines.
5. Contact UTEP with a one-page request covering magnetic characterization, one load-frame Brickmark/Fabric test, and one laser-written Hearthplate coupon.
6. Keep MuMax work subordinate to measured material parameters and measured field maps.
7. Build Hearthplate 0.1 as a self-decoding object **before** optimizing density.
8. Publish negative results with the same prominence as passes.

---

## 9. What success would mean — and what it would not

A successful Brickmark result would mean ordinary fired clay carries a repeatable magnetic signature useful for a defined provenance task under measured operating conditions. It would not make the brick a cryptographic primitive.

A successful Hearthplate result would mean a removable ceramic artifact can survive a defined environmental envelope and teach an unfamiliar reader how to recover its contents. It would not make a house a petabyte drive.

A successful Fabric result would mean stress/damage creates a repeatable magnetic delta above real-world noise. It would not make the wall a nervous system.

The strongest possible Redcore is not the one with the largest claims.

It is the one whose surviving claims have nowhere left to hide from measurement.
