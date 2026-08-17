+++
title = "Using the Field Portable Gas Analyzer (FPGA)"
date = 2026-03-29T10:30:00-05:00
draft = true
+++

{{< alert2 Warning >}}
**Do not let water reach the sensors.** If you see water in the trap, condensation in the lines, or a sudden vacuum drop that suggests a kinked or flooded intake, stop the pump immediately. Do not keep sampling a flooded well.
{{< /alert2 >}}

{{< alert2 Warning >}}
**Do not run the pump against a sealed loop.** In the one-port workflow, valve 6 can close both outlet paths. Once valve 6 is moved into that sealed position, the pump must already be off.
{{< /alert2 >}}

{{< alert2 Note >}}
**This guide is for the current Kirk lab FPGA build.** The overall design comes from [Brecheisen et al. 2019](https://doi.org/10.1371/journal.pone.0220176), but the workflows here reflect the present lab units and protocol, including one-port sampling, direct injection through valve 2, and a dedicated backflush mode.
{{< /alert2 >}}


## Introduction {#introduction}

The Field Portable Gas Analyzer (FPGA) is a compact field rig for drawing soil gas to the surface, measuring O<sub>2</sub> and CO<sub>2</sub>, and collecting samples when needed for later lab analysis. It was developed as a lighter and less expensive alternative to commercial dual-gas field analyzers, while still being robust enough for repeated work at depth and in remote field sites.

This guide covers operation rather than construction. The goal is simple: bring the instrument to ambient baseline, choose the correct flow path for your sample, move gas through the system without introducing water or pressure problems, and write things down in a way that will still make sense when you are looking at the data three weeks later.


## What the FPGA Measures {#what-the-fpga-measures}

The FPGA measures:

-   **O<sub>2</sub>** directly on the Apogee meter, in percent.
-   **CO<sub>2</sub>** as an analog voltage on the multimeter, which must be converted according to the scaling of the Vaisala probe on your unit.
-   **Temperature** separately, using the thermocouple stored in the case.

Paired O<sub>2</sub> and CO<sub>2</sub> measurements are especially useful in soil systems because they let you see more than CO<sub>2</sub> buildup alone. In many cases, soil CO<sub>2</sub> increases while soil O<sub>2</sub> declines. The ratio of those changes — the Apparent Respiratory Quotient (ARQ) — encodes information about respiration substrate, gas diffusivity, and the degree of anaerobiosis belowground.

Interpreting ARQ is not straightforward. Even under purely aerobic conditions, measured ARQ in soil rarely sits at the theoretical 1.0. CO<sub>2</sub> and O<sub>2</sub> diffuse at slightly different rates in partially water-saturated pores, which introduces a physical transport signature on top of the biological one. Fermentation or CO<sub>2</sub> release from carbonates drives ARQ above 1.0; methane oxidation or oxidation of reduced compounds drives it below. Expect field ARQ values roughly in the range of 0.7 to 1.2 under aerobic conditions, and treat values outside that range as a prompt to investigate rather than a result to report without comment.

If you intend to calculate ARQ, two things matter above all else. First, both ΔCO<sub>2</sub> and ΔO<sub>2</sub> must be calculated from the ambient air baseline you measured _at that site, that day_ — not from textbook atmospheric values. Second, ARQ becomes unreliable when either delta is small relative to instrument precision. Given the stated sensor precision of ~0.1% absolute, treat ARQ as unreliable when either ΔCO<sub>2</sub> or ΔO<sub>2</sub> is below about 0.1% (1000 ppm for CO<sub>2</sub>, 0.1 percentage points for O<sub>2</sub>). Below that threshold, you are not measuring respiration; you are dividing measurement noise by measurement noise.


## Prerequisites {#prerequisites}

**What to bring:**

-   A charged 12V battery for the FPGA
-   A working Apogee O<sub>2</sub> meter
-   The correct CO<sub>2</sub> voltage-to-concentration conversion for your specific unit (stored with the case documentation)
-   Syringes, sample bags, labels, and notebook
-   Evacuated vials if samples will not reach the lab within 3 days

**What to know before you leave:**

-   Which CO<sub>2</sub> voltage scaling your unit uses — do not assume it matches another unit
-   Which workflow you are using before you open the case. This sounds obvious. It becomes less obvious at 7 AM in a field site when someone hands you the instrument and asks which valve to turn first.

If you are sampling newly installed gas wells, remember that they may need several days to equilibrate with the surrounding soil air. The original paper notes that equilibration can be sped up by pumping several liters out of the well after installation, without recirculating that gas back into the chamber.


## Hardware Overview {#hardware-overview}

The FPGA is easiest to use once you think of it as a gas path rather than a pile of parts. Gas travels in one direction through the internal system: black intake → water trap → pressure gauge → pump → CO<sub>2</sub> sensor → O<sub>2</sub> sensor → outlet. This linear path is the same in every workflow. What changes between workflows is only what you connect to the intake and where you route the outlet. The valve map below is a set of routing decisions layered on top of that fixed path.

The key parts are:

-   **Black intake line:** the main inlet from a gas well, tube, or other sample source
-   **Water trap:** catches liquid water before it can reach the sensors
-   **Pressure gauge:** warns you about kinks, clogs, and flooded wells — a hard negative drop is a signal to stop, not to keep pumping
-   **Pump:** moves gas through the system
-   **CO<sub>2</sub> sensor and voltmeter:** the Vaisala probe uses non-dispersive infrared (NDIR) absorption and outputs a linearized voltage calibrated to a specific range at the factory; the multimeter reads that voltage
-   **O<sub>2</sub> sensor:** reports O<sub>2</sub> directly as percent
-   **Valve 4 luer port:** used for collecting a bag or syringe sample from gas already inside the system
-   **Valve 2 luer port:** used for drawing a discrete syringe or gas-bag sample directly into the analyzer
-   **White external port:** used as the return line for two-port well sampling
-   **Check valve:** prevents reverse bulk flow of outside air into the outlet path when the pump is off

{{< alert2 Caution >}}
**Protect the external white port when transporting the case.** It protrudes from the side of the Pelican case and can be damaged if the case is dropped or packed carelessly. When closing the case, check that no tubing or valve handles are being pinched.
{{< /alert2 >}}


## Valve Map and Flow Paths {#valve-map-and-flow-paths}

The numbered valves define the grammar of the instrument. Change them deliberately — most problems with this instrument trace back to someone turning a valve to see what it did, rather than knowing what it would do before touching it. The map below exists for this reason. Use it.

| Valve | Normal job                                                           | Special use                                                                                                 |
|-------|----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| 1     | Connects the water trap to the main intake path                      | Opens the reverse-flow path used for backflushing                                                           |
| 2     | Connects the pressure gauge to the pump inflow                       | Opens the luer intake for syringe or gas-bag injection; also serves as the free-air intake during backflush |
| 3     | Sends pump outflow toward the sensors                                | Reroutes pump outflow into the backflush line                                                               |
| 4     | Sends gas from the pump toward the CO<sub>2</sub> sensor             | Opens the sample-collection port for filling a bag or syringe from gas already in the system                |
| 5     | Connects the O<sub>2</sub> sensor to the check valve and outlet path | Usually left in the normal position during routine sampling                                                 |
| 6     | Chooses where gas exits after the sensors                            | Sends gas to free air, to the white return port, or into a sealed loop for one-port mode                    |

The most useful mental model is this:

```text
Normal through-flow:
Black intake -> water trap -> pressure gauge -> pump -> CO2 sensor ->
O2 sensor -> check valve -> valve 6 -> free-air outlet

Two-port recirculation:
Gas well line A -> FPGA -> white return port -> gas well line B

Direct injection:
Syringe or gas bag -> valve 2 luer port -> pump -> sensors -> exhaust

Sample collection from an already-filled loop:
Gas inside FPGA -> valve 4 luer port -> sample bag or syringe

Backflush:
Free air -> valve 2 -> pump -> evacuation line -> water trap (reverse) ->
black intake line
```

**Workflow selection at a glance:**

```text
Does your well have two ports (separate intake and return lines)?
  +-- Yes --> Workflow 1: Two-Port Wells
  +-- No, one port only --> Workflow 2: One-Port Wells

No buried well -- discrete sample (syringe, gas bag, headspace jar)?
  +-- --> Workflow 3: Syringe or Gas-Bag Injection

Water or condensation in the lines?
  +-- --> Workflow 4: Backflush (recovery procedure, not a sampling mode)
```

Unless a workflow below says otherwise, return the valves to the normal through-flow path before starting.


## Safety Notes {#safety-notes}

-   **Water is the main enemy of this instrument.** The CO<sub>2</sub> probe in particular will give unreliable readings for a long time after a water intrusion event, and sensor repair or replacement is expensive and slow. If water appears anywhere upstream of the sensors, stop and clear it before doing anything else.
-   **Change valves deliberately, not to see what happens.** Most operator mistakes come from changing a valve before understanding which path is about to open or close.
-   **Do not seal the loop with the pump running.** This matters most in one-port mode, but it is a good rule generally.
-   **Protect the plumbing when closing and carrying the case.** The white external port, luer fittings, and internal tubing are easy to crush if the lid is closed carelessly.
-   **Use common sense with syringes and needles.** If you are filling bags or vials, recap sharps safely and do not leave needles loose in the case.


## Reading the Measurements {#reading-the-measurements}


### O<sub>2</sub> {#o}

Record the percent value displayed on the Apogee meter directly.

If the O<sub>2</sub> reading does not return to approximately 20.95–21% during the ambient check, do not proceed to sampling. Check the battery, allow more warmup time, and confirm you are not working in a poorly ventilated space. If your work depends on very low O<sub>2</sub> values, verify the meter against certified standards rather than assuming the low end is calibrated correctly.


### CO<sub>2</sub> {#co}

The CO<sub>2</sub> side requires conversion from voltage to concentration. On the current lab units, the practical field assumption is 1 V = 1% CO<sub>2</sub>. Under that configuration:

| Voltage | CO<sub>2</sub> concentration |
|---------|------------------------------|
| 1 mV    | 10 ppm                       |
| 10 mV   | 0.01% (100 ppm)              |
| 100 mV  | 0.10% (1,000 ppm)            |
| 1000 mV | 1.00% (10,000 ppm)           |

An ambient reading of around 43 mV corresponds to roughly 430 ppm CO<sub>2</sub>. If your unit uses a different Vaisala scaling, use that instead.

{{< alert2 Note >}}
**The CO<sub>2</sub> voltage is build-specific.** The Vaisala probe's analog output is calibrated at the factory to a specific range. Do not assume that every FPGA converts voltage the same way. Confirm the scaling on your unit before converting millivolts to CO<sub>2</sub> concentration — the documentation is stored with the case.
{{< /alert2 >}}

**Temperature and the CO<sub>2</sub> reading:** NDIR sensors are temperature-sensitive. The Vaisala probe's output assumes operation near its calibration temperature. In cold field conditions (below ~10°C) or hot conditions (above ~35°C), check whether your unit's documentation specifies a temperature correction, and apply it if so. The thermocouple reading serves double duty: it is both a data point and a diagnostic for whether your CO<sub>2</sub> readings may be thermally offset.


### Calculating ARQ {#calculating-arq}

```text
ARQ = Delta-CO2 / Delta-O2
```

where ΔCO<sub>2</sub> is the increase in CO<sub>2</sub> above ambient (in percent) and ΔO<sub>2</sub> is the decrease in O<sub>2</sub> below ambient in the same units. Both deltas must be computed from the ambient baseline measured at that site that day — write it down during the startup check.

For aerobic respiration of carbohydrates, the theoretical ARQ is 1.0. In soil systems, ARQ commonly ranges from roughly 0.7 to 1.2 under aerobic conditions. Values above 1.0 can indicate fermentation or CO<sub>2</sub> release from carbonates; values below 1.0 can reflect methane oxidation, oxidation of reduced compounds, or the physical effect of differential diffusivity of CO<sub>2</sub> and O<sub>2</sub> in partially water-saturated pores.

{{< alert2 Note >}}
**If the Brecheisen et al. protocol for your specific unit specifies a correction factor,** apply it after computing the basic ratio and document what the factor is and where it comes from. The standard biogeochemical definition of ARQ carries no scalar multiplier.
{{< /alert2 >}}

ARQ becomes unreliable when either delta is small. As a rough sense of scale: at ΔCO<sub>2</sub> = 1.0% and ΔO<sub>2</sub> = 1.0%, a ±0.1% absolute error in each propagates to roughly ±14% relative error in ARQ. At ΔCO<sub>2</sub> = 0.2% and ΔO<sub>2</sub> = 0.2%, the same absolute error propagates to roughly ±70% relative error. Samples close to ambient are not good candidates for ARQ analysis from a single measurement.


## Startup and Ambient Check {#startup-and-ambient-check}

Do this before every sampling run, regardless of which mode you plan to use.

1.  Return the valves to the normal through-flow path:
    -   Valve 1: water trap to pressure gauge
    -   Valve 2: pressure gauge to pump inflow
    -   Valve 3: pump outflow to valve 4
    -   Valve 4: valve 3 to the CO<sub>2</sub> sensor
    -   Valve 5: O<sub>2</sub> sensor to the check valve
    -   Valve 6: check valve to the free-air outlet, not the white return port
2.  Power on the CO<sub>2</sub> sensor, the Apogee O<sub>2</sub> meter, and the pump with nothing attached to the intake or return ports.
3.  Let the system run in ambient air for about 1 minute.
4.  Confirm that the O<sub>2</sub> meter reads very close to ambient air, usually around 20.95–21%.
5.  Check the CO<sub>2</sub> baseline on the multimeter. On the current lab units, ambient outdoor air is usually around 40–45 mV if the unit is configured at 1 V = 1% CO<sub>2</sub>. Indoor air may read higher. **Record this ambient value in your notebook — you will need it for delta calculations.**
6.  Check the water trap and pressure gauge before attaching anything. If the gauge suggests strong blockage or the trap already contains water, stop and fix the problem first.


## Field Workflows {#field-workflows}


### Workflow 1: Two-Port Buried Gas Wells {#workflow-1-two-port-buried-gas-wells}

This is the default field workflow when a reservoir has separate intake and return lines.

1.  Complete the startup and ambient check.
2.  Connect one gas-well line to the black intake line and the other to the white return port.
3.  Confirm that the water trap is dry and that the pressure gauge is not indicating a kinked or flooded line.
4.  Flush the FPGA with approximately 1 L of soil gas before recording anything. At typical pump flow rates on the current lab units, this takes about 30–45 seconds — but treat that as a starting estimate, not a universal rule. The goal is to fill the internal path with soil gas rather than ambient air from the tubing. If your tubing run is longer than normal, extend the flush accordingly. When in doubt, flush longer rather than shorter; a premature reading is a more common source of error than over-flushing.
5.  Turn valve 6 so the outlet is routed to the white return port. This closes the loop through the well and fills the full pathway with soil gas.
6.  Shut off the pump and record the maximum CO<sub>2</sub> and O<sub>2</sub> values you observe within about 1 minute.

The CO<sub>2</sub> reading will rise to a peak and then drift slightly lower. This is the probe equilibrating, not the soil gas changing. Record the peak. If you record the lower number because it looked more stable, your data will be systematically off in a way that is annoying to discover later.

{{< alert2 Note >}}
**NDIR sensors are also sensitive to pressure fluctuations.** If the pump creates a noticeable pressure transient when turned off, wait for the pressure gauge to stabilize before recording the peak value.
{{< /alert2 >}}

If you are sampling a sequence of wells with different concentrations, go from lower CO<sub>2</sub> samples to higher CO<sub>2</sub> samples when possible. In many soil profiles that means shallower wells before deeper ones, which helps reduce carryover between samples.

{{< alert2 Note >}}
**Keep recirculation as short as you can.** The original paper reports that continuous circulatory analysis can dilute CO<sub>2</sub> by about 0.1–0.2%. The current lab workflow uses the return path to close the loop, but avoid leaving gas circulating any longer than needed.
{{< /alert2 >}}


#### Collecting a sample for later lab analysis {#collecting-a-sample-for-later-lab-analysis}

If you need a bag or syringe sample from a two-port well, do it after the loop has been filled with soil gas.

1.  Attach the sample bag or syringe to the luer port on valve 4.
2.  Turn valve 4 so it closes the path to the CO<sub>2</sub> sensor and opens the sample port.
3.  Turn the pump back on and fill the bag or syringe.
4.  Turn valve 4 back to the normal sensor path before disconnecting the sample container.

Label the sample immediately with the well ID, depth, date, and time. Sample bags remain stable for CO<sub>2</sub> for up to about 3 days. For longer storage, or for O<sub>2</sub> measurements where bag permeability is a concern, transfer the gas to an evacuated glass vial.


### Workflow 2: One-Port Wells or Tubes {#workflow-2-one-port-wells-or-tubes}

This mode is for wells or tubes with only one opening. It is more timing-sensitive than the two-port workflow — there is no return path, so the pressure math matters more than it did before. It is genuinely easier once you understand the system. It is genuinely harder the first time.

1.  Complete the startup and ambient check.
2.  Connect the well or tube only to the black intake line.
3.  Estimate the tubing volume and pump time before starting.

    To estimate well or tube volume from tubing geometry:
    ```text
    Volume (L) = pi * (inner radius in m)^2 * length (m) * 1000

    For standard 1/4" ID tubing (inner radius ~0.003 m):
    Volume (L) ~= 0.028 * tube length (m)

    Examples:
      5 m tube  -> ~0.14 L
      10 m tube -> ~0.28 L
    ```
    To estimate pump time, first verify your unit's actual flow rate. The nominal value from the original paper is 17.2 L/min, but cross-check it against observed behavior: on the current lab units, moving about 1 L takes roughly 30–45 seconds, which implies a working rate closer to 1.5–2 L/min. Use the rate that matches what your unit actually does.
    ```text
    Time (seconds) ~= (sample volume in L / pump rate in L/min) * 60
    ```

4.  Run the pump just long enough to pull the sample from depth into the FPGA. If you keep pumping past that point, you begin sampling a larger and less well-defined surrounding soil volume.
5.  Once the sample is in the FPGA loop, turn off the pump **before** moving valve 6 into the sealed position that closes both outlet paths.
6.  Record the maximum CO<sub>2</sub> and O<sub>2</sub> values within about 1 minute.

{{< alert2 Warning >}}
**Do not let the pump continue after sealing valve 6.** In one-port mode, that sealed position traps gas in the loop. If the pump keeps running, the system will overpressurize.
{{< /alert2 >}}

This workflow only works well if the tubing or well volume is large enough to fill the analyzer path. If the installed volume is too small, you will end up mixing the intended sample with ambient gas before the instrument fully fills.


### Workflow 3: Syringe or Gas-Bag Injection {#workflow-3-syringe-or-gas-bag-injection}

Use this mode for discrete samples, standards, incubation headspaces, or gas bags that are not connected as a buried well.

1.  Complete the startup and ambient check.
2.  Turn valve 2 so its luer port is open.
3.  Attach the syringe or luer-lock gas bag to valve 2.
4.  Let the pump draw in the sample. If using a syringe, depress the plunger fully. If using a gas bag, let the bag empty completely.
5.  Return valve 2 to the normal through-flow position before disconnecting the syringe or bag.
6.  Record the maximum CO<sub>2</sub> and O<sub>2</sub> values within about 1 minute.

For samples that are close to ambient air, the CO<sub>2</sub> peak may be subtle. In that case, inject a known standard first and time how long the system takes to reach its maximum reading, then use the same timing for your near-ambient samples.

For incubation jars or other small headspaces, keep flush times short. You only need to replace the internal volume of the FPGA with the headspace gas; prolonged pumping will dilute or exhaust a small sample.


### Workflow 4: Backflushing Moisture from the Lines {#workflow-4-backflushing-moisture-from-the-lines}

Use this only when water or condensation has entered the plumbing. It is a recovery procedure, not a normal sampling mode.

1.  Turn the pump off first.
2.  Reconfigure the valves:
    -   Turn valve 3 toward the sensor side so the pump is routed into the evacuation line
    -   Turn valve 1 toward the pressure gauge
    -   Turn valve 2 toward the pressure gauge so the free-air intake is open
3.  Point the black intake tube away from yourself, other people, and the instrument case.
4.  Run the pump briefly so it pulls free air in through valve 2 and pushes that air backward through the water trap and out the black intake tube.
5.  Stop once the trap and lines are clear, then return valves 1, 2, and 3 to their normal positions before taking another sample.

{{< alert2 Warning >}}
**Water can spray out of the black intake line during backflush.** Keep it pointed away from your face, the electronics, your notebook, and the open case. This is the most theatrical thing the instrument does, and it is completely preventable. If you suspect water has reached either sensor housing, stop using the instrument until it has been inspected.
{{< /alert2 >}}


## Performance and Limits {#performance-and-limits}

The original FPGA paper is strongest on CO<sub>2</sub> validation. It reports 1639 paired field and laboratory measurements, with FPGA CO<sub>2</sub> compared against gas chromatography at a slope of 1.017, an intercept of −0.033, and an R<sup>2</sup> of 0.956 over the observed field range. The same paper reports at least 0.1% precision for both CO<sub>2</sub> and O<sub>2</sub> — this is an absolute figure (0.1 percentage points), not a relative one.

Those numbers are useful context. They are not permission to skip the ambient check, leave water in the lines, or explain away an ARQ of 1.8 by citing measurement uncertainty. Real-world performance depends on dry lines, correct valve positions, enough flush volume, and not convincing yourself that a near-ambient sample is valid when it isn't.

Note that 0.1% absolute precision means different things at different concentrations. At 5% CO<sub>2</sub>, that is ±2% relative error — acceptable for most applications. At 0.2% CO<sub>2</sub>, it is ±50% relative. This matters most for ARQ analysis: a sample where one or both gases are close to ambient will carry a large relative uncertainty through the ratio calculation regardless of how carefully you ran the protocol. Plan your sampling design accordingly.

Historical numbers from the 2019 paper such as cost (~$2,000) and weight (&lt;10 kg including battery) are best treated as context rather than current specifications.


## Troubleshooting &amp; Maintenance {#troubleshooting-and-maintenance}

**Water in the trap or condensation in the lines:**
Stop the pump immediately. Backflush the lines before sampling again. Do not continue sampling a flooded well.

**Pressure gauge drops hard negative:**
The original paper uses a threshold of about −20 kPa as a sign of a clogged, kinked, or flooded intake. Treat any sudden drop from your normal operating pressure as a warning sign, even if it has not hit −20 kPa. Shut the pump off and inspect the line.

**O<sub>2</sub> does not return to ambient during startup:**
Check the O<sub>2</sub> meter battery, allow more time in free air, and confirm you are not testing in a poorly ventilated space. If the meter still will not settle near ambient, do not trust low-O<sub>2</sub> samples until the instrument has been checked. If your work depends on very low O<sub>2</sub> values, verify the meter against certified standards rather than assuming the low end is correct.

**CO<sub>2</sub> baseline never settles:**
Give the sensor more warmup time, verify the battery and wiring, and confirm you are using the correct voltage scaling. Indoor lab air can legitimately read higher than outdoor ambient.

**Samples look flat or diluted:**
Suspect insufficient flush, too much recirculation, a leak, or carryover from a previous high-CO<sub>2</sub> sample. Work from lower CO<sub>2</sub> samples to higher ones and keep circulation brief. A useful sanity check: if CO<sub>2</sub> and O<sub>2</sub> sum to approximately 21%, the sample is likely contaminated with ambient air. In a genuine soil gas sample, aerobic respiration consumes O<sub>2</sub> and adds CO<sub>2</sub> in ratios that do not fully replace the removed O<sub>2</sub>, so the sum should be measurably less than 21%.

**One-port sampling is inconsistent:**
Your timing may be off, or the installed tubing volume may be too small relative to the analyzer path. Recalculate the evacuation time using your unit's actual observed flow rate. Confirm that you are not inadvertently drawing in gas from outside the intended sampling volume.

**Long gap between sites:**
If the next measurement is more than about 10 minutes away, turn off the CO<sub>2</sub> sensor between sites to conserve battery, then warm it up again before the next run.

**Quick failure-mode reference:**

| What you observe                                                  | Likely cause                              | First check                                           |
|-------------------------------------------------------------------|-------------------------------------------|-------------------------------------------------------|
| Pressure pegged hard negative at startup                          | Blocked or kinked intake                  | Inspect black intake line before running pump         |
| CO<sub>2</sub> and O<sub>2</sub> both at ambient despite sampling | Insufficient flush or air leak            | Extend flush time; inspect all connections            |
| CO<sub>2</sub> + O<sub>2</sub> sum ≈ 21%                          | Sample is mostly ambient air              | Flush longer; check for leaks at all fittings         |
| O<sub>2</sub> stable at ambient, CO<sub>2</sub> elevated          | Possible O<sub>2</sub> sensor issue       | Check O<sub>2</sub> meter connections and battery     |
| CO<sub>2</sub> spikes on pump shutoff then immediately decays     | NDIR pressure transient                   | Wait for pressure gauge to stabilize before recording |
| Readings inconsistent between successive samples                  | Carryover from high-CO<sub>2</sub> sample | Flush longer with ambient air between samples         |


## After Each Session {#after-each-session}

Before closing the case:

1.  Turn off the pump, then the CO<sub>2</sub> sensor, then the O<sub>2</sub> meter.
2.  With the intake open to free air, run the pump for about 30 seconds. This clears residual soil gas from the lines and reduces condensation during storage.
3.  Return all valves to the normal through-flow position.
4.  Inspect the water trap. If there is any moisture, do a brief backflush before closing.
5.  Close all luer port caps and confirm the white external port is protected.
6.  Close and latch the Pelican case. Check that no tubing or valve handles are being pinched by the lid.


## Appendix: Quick Reference {#appendix-quick-reference}


### Before Leaving the Lab {#before-leaving-the-lab}

-   Charge the 12V battery
-   Confirm the O<sub>2</sub> meter powers on
-   Confirm the CO<sub>2</sub> voltage conversion for your unit (stored with the case)
-   Pack syringes, bags, labels, and notebook
-   Decide which workflow you are using


### At the Field Site (before first sample) {#at-the-field-site--before-first-sample}

-   Open the case and inspect the water trap
-   Run the system in ambient air for about 1 minute
-   Confirm O<sub>2</sub> reads ~20.95–21% (if not, stop and investigate)
-   Record the ambient CO<sub>2</sub> voltage baseline in your notebook
-   Check the pressure gauge reads normal


### At Each Sampling Point {#at-each-sampling-point}

-   Return valves to the normal through-flow path
-   Attach the sample source
-   Flush before recording
-   Record raw mV and converted concentration; note which workflow was used


### Data Recording {#data-recording}

For each sample, record at minimum:

| Field                             | Example                                     |
|-----------------------------------|---------------------------------------------|
| Date and time                     | 2026-03-28 09:14                            |
| Site and well ID                  | Site A, Well 3                              |
| Depth (m)                         | 0.5                                         |
| Workflow used                     | Two-port                                    |
| Ambient O<sub>2</sub> (%)         | 20.97                                       |
| Ambient CO<sub>2</sub> (mV / ppm) | 43 mV / 430 ppm                             |
| Sample O<sub>2</sub> (%)          | 18.4                                        |
| Sample CO<sub>2</sub> (mV / ppm)  | 312 mV / 3120 ppm                           |
| Notes                             | Brief backflush required before this sample |

Recording both raw mV and converted concentration matters. If the voltage scaling is ever in question, you can recompute from the raw value. You cannot go the other direction.


### Ambient Benchmarks for the Current Build {#ambient-benchmarks-for-the-current-build}

| Metric                                | Expected value           | Worth investigating if...                                    |
|---------------------------------------|--------------------------|--------------------------------------------------------------|
| O<sub>2</sub> in ambient air          | ~20.95–21%               | Below 20.7% or above 21.1% during startup                    |
| CO<sub>2</sub> in ambient outdoor air | ~40–45 mV (~420–450 ppm) | Above 60 mV outdoors suggests contamination or warm-up issue |
| Typical two-port flush                | ~30–45 seconds for ~1 L  | Adjust if tubing run is longer than standard                 |
| Pump rate (verify on your unit)       | ~1.5–2 L/min observed    | Cross-check: does moving 1 L take 30–45 seconds?             |


### Current Build Reference {#current-build-reference}

This documentation applies to the Kirk lab FPGA units as of March 2026. Sensor model numbers and factory scaling are stored with each case. If the unit has been modified or a sensor replaced, verify that the ambient benchmarks above still apply before trusting any conversion factors or flush time estimates.


## Conclusion {#conclusion}

The FPGA is a straightforward instrument once the flow paths stop feeling arbitrary — which takes about one field session, assuming you read this first. Gas comes in, passes the sensors, and goes somewhere depending on your valve configuration. Most good data come from the same four habits: warm up in ambient air, choose your mode before touching anything, keep water out of the sensors, and don't rush the transitions where pressure and flow direction change. None of those are hard. They are just easier to do when you already know them.

For construction details, performance validation, and the original design logic, read [Brecheisen et al. 2019](https://doi.org/10.1371/journal.pone.0220176). For the exact sensor manuals and accessories packed with the current lab units, check the documentation stored with the case.

---

_Written in March 2026._

_Created by Morgan Salisbury_
