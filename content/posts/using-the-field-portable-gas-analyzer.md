+++
title = "Using the Field Portable Gas Analyzer (FPGA)"
date = 2026-03-29T10:30:00+08:00
draft = false
+++

{{< alert2 Warning >}}
**Keep water away from the sensors.** Stop the pump if water enters the trap, condensation appears in the lines, or the vacuum gauge suddenly moves more negative. Check for a flooded intake or kink before continuing. Do not keep sampling a flooded well.
{{< /alert2 >}}

{{< alert2 Warning >}}
**Pump off before closing valve 6.** In the one-port procedure, valve 6 closes both outlets. Turn the pump off before moving the valve to this position; pumping against the closed outlet can overpressurize the system.
{{< /alert2 >}}


## Introduction {#introduction}

The Field Portable Gas Analyzer (FPGA) draws soil gas to the surface, measures its CO<sub>2</sub> and O<sub>2</sub> concentrations, and can collect a sample for later laboratory analysis. The design comes from [Brecheisen et al. (2019)](https://doi.org/10.1371/journal.pone.0220176): a set of commercially available sensors and plumbing assembled into a battery-powered instrument small enough to carry between wells.

Inside the Pelican case are a Vaisala `GMP221` CO<sub>2</sub> probe and `GMM220` transmitter, an Apogee `MO220` O<sub>2</sub> meter, a diaphragm pump, a water trap, a vacuum gauge, and six three-way valves. The valves let the same instrument measure gas from a well, accept a syringe or bag sample, or reverse the flow through the trap to clear water.

This guide is based on the lab's working protocol. Start with the valve map and ambient check, then choose the procedure for your sample. The final sections cover troubleshooting and interpreting the paired gas measurements.

{{< alert2 Note >}}
**YMMV.** More so in this article than in others, you should confirm the specifics of your situation as they may differ from those described below.
{{< /alert2 >}}


## What the FPGA measures {#what-the-fpga-measures}

The Apogee meter displays O<sub>2</sub> concentration directly as a percentage. The Vaisala measures CO<sub>2</sub> by infrared absorption, but this build presents its output as a voltage on the multimeter. You'll need to convert that voltage to concentration. The thermocouple in the case provides a separate temperature measurement.

Respiration consumes O<sub>2</sub> and produces CO<sub>2</sub>, so soil gas commonly contains less O<sub>2</sub> and more CO<sub>2</sub> than the air above it. Measuring both helps distinguish changes in respiration from the effects of gas transport and other sources or sinks. The [apparent respiratory quotient (ARQ)](#appendix-arq) relates the two measurements, with a correction for their different diffusivities.


### Converting the CO<sub>2</sub> voltage {#converting-the-co-voltage}

The [GMM220 manual](https://www.vaisala.com/sites/default/files/documents/GMM220%20User%20Guide%20in%20English.pdf) specifies a default 0–1 V output, with other output ranges available. The CO<sub>2</sub> range is configured separately. For an output that starts at zero, concentration is the fraction of full-scale voltage multiplied by the full-scale concentration:

\\[C = \frac{V}{V\_{\mathrm{full\ scale}}}\\,C\_{\mathrm{full\ scale}}\\]

Use the same voltage units in the numerator and denominator. The lab protocol uses the scaling **1 V = 1% CO<sub>2</sub>**, which gives:

| Voltage  | CO<sub>2</sub>     |
|----------|--------------------|
| 10 mV    | 0.01% (100 ppm)    |
| 43 mV    | 0.043% (430 ppm)   |
| 100 mV   | 0.10% (1,000 ppm)  |
| 1,000 mV | 1.00% (10,000 ppm) |

That scaling is worth confirming against the unit's configuration. The manual's high-concentration ranges (the `GMM221` variant) start at 0–2% CO<sub>2</sub>, so 1 V = 1% implies a 0–2 V output on a 0–2% range rather than the default 0–1 V output. A unit set to 0–1 V over 0–2% would read half the true concentration from this table.

It's prudent to record the raw millivolts alongside the converted concentration and the scaling used. That leaves enough information to correct a conversion error later without having to repeat the fieldwork.

Temperature and pressure also affect the Vaisala response. For Maximum Prudency, you should record the measurement conditions and use the compensation procedure documented for your unit, especially if you're working at a different elevation or temperature from the conditions it was calibrated in.


## The valve map {#the-valve-map}

In the starting configuration, gas enters through the black intake, passes through the water trap, gauge, pump, and sensors, then leaves through the free-air outlet inside the case. The valves are numbered in that order. The white external port provides a return path to a two-port well.

| Valve | Starting route                     | Alternative route                                       |
|-------|------------------------------------|---------------------------------------------------------|
| 1     | Top of water trap → gauge          | Valve 3 → top of trap, for backflushing                 |
| 2     | Gauge → pump inlet                 | Luer port → pump inlet, for injection or backflushing   |
| 3     | Pump outlet → valve 4              | Pump outlet → valve 1, for backflushing                 |
| 4     | Valve 3 → CO<sub>2</sub> sensor    | Valve 3 → collection luer port                          |
| 5     | O<sub>2</sub> sensor → check valve | Leave in this position during these procedures          |
| 6     | Check valve → free-air outlet      | Check valve → white return port, or both outlets closed |

The check valve sits between valves 5 and 6 and prevents reverse flow from the outlet. Valve 6 selects one of two outlets. On the lab's stopcocks, the OFF handle points toward the blocked port.

Choose a procedure in the diagram to see the handle positions, gas routes, and pump state. The amber arm represents the OFF end of the handle: point it toward the named tube or component on your instrument. The plumbing is rearranged for readability, so use those component names rather than copying screen directions.

{{< fpgavalves id="fpga-valves" >}}


## Before first use {#four-numbers-to-measure-once-and-write-on-the-case}

Alongside the valve labels and CO<sub>2</sub> scaling, keep four measurements with the instrument:

-   **Internal gas volume.** Include the trap, tubing, pump, and sensor housings in the selected route. This is the volume a sample must displace before it can be measured.
-   **Flow rate through the assembled system.** Measure a known volume over time with representative tubing attached, or use a suitable flowmeter. A pump's unrestricted rating does not describe its flow through a long sampling line.
-   **Normal gauge reading.** Record it with the intake open and during an unobstructed sample draw, so a change is recognizable.
-   **Warmup and sample-response time.** Observe both during a check with a known gas. Warming a cold instrument and replacing gas in a warm sensor are different processes.

Check certified standards that cover the concentrations you expect to measure, particularly for low-O<sub>2</sub> work. An ambient check tests one point; it does not verify the full measurement range. Record the standard, expected value, observed value, and date.

{{< alert2 Caution >}}
**Protect the white return port.** It protrudes from the case even with its nut removed. Support the case during transport and check that tubing and valve handles clear the lid before latching it.
{{< /alert2 >}}


## Startup and ambient check {#startup-and-ambient-check}

Start each session with the intake and return disconnected. Check the battery, tubing, dry water trap, and multimeter connections before switching on.

1.  Set valves 1–5 to their starting routes and valve 6 to **free air**.
2.  Power on the CO<sub>2</sub> sensor and Apogee meter. Set the multimeter to read the CO<sub>2</sub> voltage, then start the pump to draw ambient air through the instrument.
3.  Allow the sensors to warm up and the readings to stabilize. The lab protocol uses about one minute for the initial check. The Vaisala manual gives a 30-second warmup, but **15 minutes to meet its full specifications**; allow that when planning quantitative measurements.
4.  Check that O<sub>2</sub> is close to ambient, approximately 20.95%. Investigate an unexpected value before sampling; use the meter's own procedure if calibration is required.
5.  Record ambient CO<sub>2</sub> in mV and converted concentration, O<sub>2</sub> in percent, and temperature. For soil-gas comparisons, measure outdoor air at the site, away from your breath and other local sources. Indoor air can have appreciably higher CO<sub>2</sub>.
6.  Check the trap and gauge again, then stop the pump before connecting the sample lines.

Keep the ambient pair with the sample records. It is the reference for the differences used in ARQ, as well as a useful check that the instrument returns to its baseline between samples.


## Field workflows {#field-workflows}

Use the procedure that matches the sample connection. Each starts with a warm instrument and a completed ambient check.


### Two-port wells {#two-port-wells}

Use this procedure when the well has separate intake and return lines. First, soil gas displaces the air in the analyzer and exhausts to free air. Valve 6 then redirects the outlet back to the well; the pump is stopped for the reading.

1.  With the pump off, connect one well line to the black intake and the other to the white return port. Leave valves 1–5 on their starting routes and valve 6 open to free air.
2.  Start the pump while watching the water trap and gauge. Stop immediately if water enters or the gauge moves sharply more negative.
3.  Flush the analyzer with well gas. The lab protocol uses approximately 1 L over 30–45 seconds as a starting point. Adjust this to the measured flow, line volume, and reservoir; it is not a universal timer setting.
4.  Turn valve 6 from free air to the white return (OFF handle toward free air), briefly establishing circulation through the well.
5.  Turn the pump off. Leave valve 6 at the white return and observe both gas readings for about a minute. Record the CO<sub>2</sub> peak and the O<sub>2</sub> sample reading, following the measurement-window note below.

Brecheisen et al. describe a delayed rise in CO<sub>2</sub> after stopping the pump, associated with equilibration through the probe's protective sleeve. When moving from lower to higher CO<sub>2</sub>, the reading may peak and then decline. This is why the protocol records the peak within a defined window rather than waiting indefinitely for a flat display.

{{< alert2 Note >}}
**Keep recirculation brief.** The paper reports CO<sub>2</sub> decreases of up to 0.1–0.2 percentage points with circulation and prefers a non-circulating measurement when sufficient sample volume is available. The sequence here follows the local lab protocol; record the mode so results from different procedures remain distinguishable.
{{< /alert2 >}}

When practical, sample from lower to higher expected CO<sub>2</sub>, often shallow to deep, and flush between wells. This reduces the amount of high-concentration gas carried into a lower-concentration sample.

{{< alert2 Note >}}
**Which O<sub>2</sub> reading?** The paper says to record the maximum of both gases within a minute, but its delayed-peak explanation is about the CO<sub>2</sub> probe's sleeve. In an oxygen-depleted sample, the O<sub>2</sub> maximum can just be the ambient reading the meter started from. Take O<sub>2</sub> from a reading window you've established with a known gas, after the sample has arrived and pressure has settled. If the reading never settles, note that along with its range and timing rather than picking an extreme. Either way, the CO<sub>2</sub> and O<sub>2</sub> values you pair should come from the same gas.
{{< /alert2 >}}


#### Taking a sample for the lab {#taking-a-sample-for-the-lab}

Collect after the analyzer has been flushed with soil gas. Valve 4 diverts gas before it reaches the sensors, so they are not measuring the gas being collected during this step.

1.  With the pump off, set valve 6 to free air and attach the sample container to the luer port on valve 4 using the appropriate fitting or needle.
2.  Turn valve 4 to close the path to the CO<sub>2</sub> sensor and open the collection port (OFF handle toward the CO<sub>2</sub> sensor).
3.  Run the pump while filling the container. Stop before it is overfilled or presents a closed outlet.
4.  With the pump off, return valve 4 to the sensor path, then seal and disconnect the container.

Label the container with sample ID, well, depth, date, and time. Use the storage method and holding time validated for the gases you intend to analyze. The paper reports stability for up to three days in the bags it tested and uses evacuated glass vials for longer storage; that result does not establish a holding time for every bag or sample.


### One-port wells and tubes {#one-port-wells-and-tubes}

With only one connection, there is no separate return path to the well. Draw the intended sample into the analyzer, stop the pump, and close the outlet at valve 6 for measurement. The intake remains connected to the well; closing valve 6 does not isolate the gas on both sides of the instrument.

1.  With the pump off, connect the well to the black intake only. Set valves 1–5 to their starting routes and valve 6 to free air.
2.  Determine the volume you intend to withdraw before starting. Include the tubing, any reservoir, and the instrument volume in your sampling plan. For tubing of internal radius \\(r\\) and length \\(l\\), volume is \\(\pi r^{2}l\\); use the **inside** diameter, not the outside diameter.
3.  Use the measured flow rate to estimate the draw time. Start the pump and watch the trap and gauge throughout the draw.
4.  Once the intended sample has reached and displaced the gas in the analyzer, **turn the pump off**.
5.  Close both outlets at valve 6 (OFF handle toward the check valve). Observe the readings for about a minute and record them using the same measurement-window convention as above.

{{< alert2 Warning >}}
**The order matters: pump off, then close valve 6.** Before the next draw, reopen valve 6 to free air. The sealed position is only for holding a sample with the pump stopped.
{{< /alert2 >}}

For an initial timing estimate, divide the planned withdrawal volume by the measured flow rate. For example, 100 mL at 500 mL/min takes 0.2 minutes, or 12 seconds. This is a volume calculation, not proof that the sensors contain an unmixed sample: confirm displacement and response with a known gas before relying on a short draw.

Decide whether the target is gas already in the tube or gas arriving from the reservoir or soil below it. If you want the resident tube gas, withdrawing the tubing volume _plus_ the instrument volume can push that sample through and out of the analyzer. If you want gas from below the tube, the resident gas must first be displaced. Soil can replenish an open well throughout the draw, so the withdrawn volume does not define a neatly bounded volume of surrounding soil.

The local protocol requires the sampling tube to hold at least the instrument's internal volume. That is a useful volume check for capturing resident gas, but it does not by itself demonstrate complete replacement or adequate sensor response.


### Syringe or gas-bag injection {#syringe-or-gas-bag-injection}

Use valve 2 for discrete samples from a syringe or gas bag. This inlet feeds the pump directly, bypassing the water trap and gauge, so the sample and connection must be dry.

1.  Complete the ambient check and stop the pump. Leave valves 1 and 3–5 on their starting routes, with valve 6 open to free air.
2.  Attach the syringe or luer-lock bag to valve 2, then open the luer-to-pump route, closing the gauge side (OFF handle toward the gauge).
3.  Start the pump and admit the sample. Watch the syringe or bag as well as the readings; do not leave the pump drawing against an empty, closed container.
4.  Stop the pump at the end of the draw. Return valve 2 to the gauge-to-pump route before disconnecting the sample container.
5.  Record the sample response and timing. For an enriched-CO<sub>2</sub> sample, use the peak within the established reading window; apply the O<sub>2</sub> measurement-window guidance above.

This sequence stops the pump at the end of injection so ambient air is not immediately drawn through after the sample. Verify the required volume and response time with standards using that same sequence. A sample must displace the gas already in this route, and one nominal internal volume does not guarantee complete replacement where gas mixes in the plumbing.

Near ambient CO<sub>2</sub>, there may be no distinct peak. Use a reading window established with standards and report the measurement's uncertainty; timing alone cannot make a small concentration difference resolvable. For small incubation headspaces, check that the available gas volume is sufficient before connecting the sample.


## Backflushing water out of the lines {#backflushing-water-out-of-the-lines}

If water enters the trap or condensation appears upstream of the sensors, stop sampling and clear it before continuing. Disconnect the well and direct the black intake into a suitable waste container, away from the open case.

In backflush mode, room air enters through valve 2, passes through the pump, then travels from valve 3 to valve 1 and down through the water trap. Water leaves through the black intake. The pump still runs in its usual direction; the valves redirect its outlet around the sensors.

1.  Confirm the pump is off.
2.  Set valve 1 to connect the backflush line to the top of the trap, blocking the gauge side (OFF handle toward the gauge).
3.  Set valve 2 to admit free air through its luer port, blocking the gauge side (OFF handle toward the gauge).
4.  Set valve 3 to send pump output to the backflush line, blocking the path to valve 4 (OFF handle toward valve 4). Leave valves 4–6 in their starting positions.
5.  Check that the black intake is directed safely into the waste container, then run the pump briefly to expel the water.
6.  Turn the pump off. Return valves 1–3 to their starting routes, inspect the trap and lines, and repeat the ambient check before sampling.

{{< alert2 Warning >}}
**Backflushing clears the intake plumbing, not a wet sensor.** If water may have reached a sensor housing, stop using the instrument and arrange inspection. Do not try to clear it by pumping more gas through the sensors.
{{< /alert2 >}}


## Between samples and recording results {#between-samples-and-recording-results}

Stop the pump before disconnecting a well. Return valves 1–5 to their starting routes and valve 6 to free air, then draw clean ambient air through the black intake until both readings return to the session baseline. If they do not recover, resolve that before moving to the next sample. This reset is especially important after a high-CO<sub>2</sub> sample or any procedure that closed valve 6.

For each measurement, record:

-   Sample ID, well or tube, depth, date, and time.
-   Instrument ID, CO<sub>2</sub> scaling, raw mV, converted CO<sub>2</sub>, and O<sub>2</sub> percent.
-   Ambient CO<sub>2</sub> and O<sub>2</sub>, temperature, and any applied compensation.
-   Sampling mode, draw or flush duration, and the reading window used.
-   Water, unusual vacuum, unstable readings, repeats, or a collected sample's container ID.

If you use the same multimeter for temperature, finish recording the CO<sub>2</sub> voltage first, then change the leads and setting as documented for the thermocouple. Restore the voltage connections before the next gas measurement.


## After each session {#after-each-session}

1.  Complete the between-sample flush. If moisture is present, stop the pump and backflush before putting the instrument away.
2.  Turn off the pump, CO<sub>2</sub> sensor, and O<sub>2</sub> meter.
3.  Leave the valves in their starting positions, including valve 6 open to free air. Cap unused luer ports.
4.  Check that the trap and lines are dry, protect the white return port, and close the case without trapping tubing or valve handles.
5.  Charge the battery using the charger and instructions supplied with the unit, and file the session's measurements and notes.


## Troubleshooting {#troubleshooting}

Start with the symptom and check the gas path before adjusting a sensor.


### Water in the trap, or condensation in the lines {#water-in-the-trap-or-condensation-in-the-lines}

Turn the pump off immediately. Disconnect the well and use the backflush procedure. Do not resume sampling a flooded well, or use the instrument if water may have reached the sensors.


### The vacuum gauge drops hard negative {#the-vacuum-gauge-drops-hard-negative}

Stop the pump and inspect the intake for a kink, blockage, or flooding. Brecheisen et al. associate readings below approximately −20 kPa with an obstructed intake, but a sudden change from your unit's normal reading is reason to stop earlier. The gauge is upstream of the pump and does not verify that the pump's outlet is open.


### O<sub>2</sub> won't come back to ambient at startup {#o-won-t-come-back-to-ambient-at-startup}

Check the meter's battery and the route through the sensors, then allow more time in clean ambient air. If the reading remains unexpected, follow the meter's calibration procedure and check a certified standard before using the results. Agreement at ambient alone does not establish accuracy at low O<sub>2</sub>.


### The CO<sub>2</sub> baseline never settles {#the-co-baseline-never-settles}

Allow the full warmup, check the battery and voltage connections, and confirm the output scaling. Keep breath away from the intake and consider whether the air itself is changing. A repeatable offset on a known standard calls for a calibration or compensation check; it should not be corrected by guessing a new multiplier.


### Samples come out looking flat or diluted {#samples-come-out-looking-flat-or-diluted}

Check whether the intended gas displaced the previous sample, whether valve 6 was routed correctly, and whether the connections leak. Repeat a known standard through the same route and compare the response with earlier checks. For recirculating measurements, also review how long the loop ran.

{{< alert2 Caution >}}
**CO<sub>2</sub> + O<sub>2</sub> near 21% is not a leak test.** The sum depends on the changes in both gases and can occur in valid samples or in mixtures with ambient air. Check connections, standards, and repeatability instead of accepting or rejecting a sample on that sum alone.
{{< /alert2 >}}


### One-port results are inconsistent {#one-port-results-are-inconsistent}

Recheck the internal tube diameter, reservoir volume, actual flow rate, and draw timing. Confirm that enough of the intended gas reaches the sensors, and that successive draws are not sampling different amounts of surrounding soil. Keep the pump-off and valve-closing sequence consistent.


### Readings depend on the previous sample {#everything-reads-plausibly-but-nothing-agrees-between-wells}

Test for carryover by checking whether the instrument returns to ambient after an enriched sample. Then repeat a known gas after the full reset. Differences between wells can be real; it is dependence on sample order, or failure to recover a baseline, that points to a problem with replacement of gas in the instrument.


## Appendix: ARQ {#appendix-arq}

Brecheisen et al. calculate the apparent respiratory quotient from the increase in soil CO<sub>2</sub> above ambient and the decrease in O<sub>2</sub> below ambient, multiplied by 0.76 to account for their different diffusivities:

\\[\mathrm{ARQ} = 0.76\\,\frac{C\_{\mathrm{soil}}-C\_{\mathrm{ambient}}}{O\_{\mathrm{ambient}}-O\_{\mathrm{soil}}}\\]

Here \\(C\\) is CO<sub>2</sub> concentration and \\(O\\) is O<sub>2</sub> concentration. Use the same units for all four terms; percentages are convenient. The denominator is **ambient minus soil** O<sub>2</sub>, so oxygen depletion gives a positive number.

For example, take ambient readings of 0.04% CO<sub>2</sub> and 20.95% O<sub>2</sub>, and soil readings of 2.04% CO<sub>2</sub> and 18.95% O<sub>2</sub>. The CO<sub>2</sub> increase and O<sub>2</sub> decrease are both 2.00 percentage points, giving ARQ = 0.76. The uncorrected concentration ratio is 1.00; it is not the same quantity as the paper's ARQ.

Because ARQ divides two measured differences, it becomes sensitive to uncertainty when either gas is close to ambient, especially when O<sub>2</sub> depletion is small. If the denominator is indistinguishable from zero, a numerical ratio is not a defensible result. Carry the uncertainty of the ambient and sample measurements into the calculation rather than reporting all the digits a calculator provides.

The factor 0.76 belongs to the soil-gas diffusion interpretation used in the paper. Do not automatically apply it to a closed incubation's production-to-consumption ratio. ARQ also reflects transport and other gas sources or sinks, so it cannot by itself identify a respiratory substrate or prove anaerobic metabolism.


## Published performance {#performance-per-the-paper}

Brecheisen et al. compared 1,639 field CO<sub>2</sub> measurements with gas chromatography over approximately 0.25–7.75% CO<sub>2</sub>. They report a regression slope of 1.017, an intercept of −0.033, and R<sup>2</sup> = 0.956. This supports the platform's use for enriched soil gas within the tested range; it does not establish equivalent performance for small differences around ambient.

The paper reports measurement precision of at least 0.1% for both gases, expressed as an absolute concentration difference: 0.1 percentage point is 1,000 ppm. That statement is not a universal ±0.1% accuracy specification. Use the installed sensor's specifications and your own standard checks to assess uncertainty for a particular measurement.


## Further reading {#further-reading}

| Document                                                                                                                                                                       | Link                                                                                                      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Brecheisen, Cook, Heine, Ryang &amp; Richter (2019), _Development and deployment of a field-portable soil O<sub>2</sub> and CO<sub>2</sub> gas analyzer and sampler_, PLOS ONE | [doi:10.1371/journal.pone.0220176](https://doi.org/10.1371/journal.pone.0220176)                          |
| Vaisala `GMM220` module user guide, for the analog output and range configuration                                                                                              | [Vaisala](https://www.vaisala.com/sites/default/files/documents/GMM220%20User%20Guide%20in%20English.pdf) |

The local source for the valve numbering and workflows is _FieldPortableGasAnalyzerProtocols_edited.docx_, the Kirk lab's working protocol. Its comments leave questions about voltage scaling and pump-off measurements unresolved. Confirm those details with the instrument's maintainers and standard-gas checks before adopting the procedure for a dataset. Keep the resulting configuration and calibration records with the case.

---

_Created in Doom Emacs with Org Mode._

_Written from March to September 2026._
