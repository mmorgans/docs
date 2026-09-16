+++
title = "Using the Field Portable Gas Analyzer (FPGA)"
date = 2026-03-29T10:30:00+08:00
draft = false
+++

{{< alert2 Warning >}}
**Keep water away from the sensors.** Stop the pump if water enters the trap, condensation appears in the lines, or the vacuum gauge suddenly moves more negative. Check for a flooded intake or kink before continuing.
{{< /alert2 >}}


## Introduction {#introduction}

The Field Portable Gas Analyzer (FPGA) draws soil gas to the surface, measures its CO<sub>2</sub> and O<sub>2</sub> concentrations, and can collect a sample for later laboratory analysis. The design comes from [Brecheisen et al. (2019)](https://doi.org/10.1371/journal.pone.0220176), which describes a set of commercially available sensors and plumbing assembled into a battery-powered instrument small enough to carry between wells.

Inside the Pelican case are a Vaisala `GMP221` CO<sub>2</sub> probe and `GMM220` transmitter, an Apogee `MO220` O<sub>2</sub> meter, a diaphragm pump, a water trap, a vacuum gauge, and six three-way valves. The valves let you switch between measuring gas from a well, accepting a sample from a syringe or bag, or reversing the flow through the trap to clear water.

{{< alert2 Note >}}
**YMMV.** Moreso in this article than in others. You should confirm the specifics of your situation as they may differ from those described below. As usual, I'll do my best to help if you [send me an email](mailto:fpga@mor-gan.com).
{{< /alert2 >}}


## What the FPGA measures {#what-the-fpga-measures}

The Apogee meter displays O<sub>2</sub> concentration directly as a percentage. The Vaisala measures CO<sub>2</sub> by infrared absorption, but this build presents its output as a voltage on the multimeter. You'll need to convert that voltage to concentration.

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

Choose a procedure in the diagram to see the handle positions, gas routes, and pump state. The amber arm represents the OFF end of the handle: point it toward the named tube or component on your instrument.

{{< fpgavalves id="fpga-valves" >}}


## Startup and ambient check {#startup-and-ambient-check}

1.  Set valves 1–5 to their starting routes and valve 6 to **free air**.
2.  Power on the CO<sub>2</sub> sensor and Apogee meter. Set the multimeter to read the CO<sub>2</sub> voltage, then start the pump to draw ambient air through the instrument.
3.  Allow the sensors to warm up and the readings to stabilize. The lab protocol uses about one minute for the initial check. The Vaisala manual gives a 30-second warmup, but **15 minutes to meet its full specifications**; but I don't really think it can take that long.
4.  Check that O<sub>2</sub> is close to ambient, approximately 20.95% last time I checked.
5.  Record ambient CO<sub>2</sub> in mV and converted concentration, O<sub>2</sub> in percent, and temperature. Be sure to direct your breath away from the FPGA.


## Field workflows {#field-workflows}


### Two-port wells {#two-port-wells}

Use this procedure when the well has separate intake and return lines. First, soil gas displaces the air in the analyzer and exhausts to free air. Valve 6 then redirects the outlet back to the well.

1.  With the pump off, connect one well line to the black intake and the other to the white return port. Leave valves 1–5 on their starting routes and valve 6 open to free air.
2.  Flush the analyzer with well gas. The lab protocol uses approximately 1 L over 30–45 seconds as a starting point.
3.  Turn valve 6 from free air to the white return (OFF handle toward free air), briefly establishing circulation through the well.
4.  Turn the pump off. Leave valve 6 at the white return and observe both gas readings for about a minute. Record the CO<sub>2</sub> peak and the O<sub>2</sub> sample reading, following the measurement-window note below.

Brecheisen et al. note that CO<sub>2</sub> keeps climbing for a bit after the pump stops, because the probe's protective sleeve slows it down. The reading usually peaks and then drifts back. Record the peak.

{{< alert2 Note >}}
**Keep recirculation brief.** The paper saw CO<sub>2</sub> drop by up to 0.1–0.2 percentage points when gas circulated, and prefers the non-circulating method when there's enough sample. Write down which method you used.
{{< /alert2 >}}

Sample from low to high expected CO<sub>2</sub> where you can (usually shallow to deep), and flush between wells to limit carryover.

{{< alert2 Note >}}
**Which O<sub>2</sub> reading?** The paper says to record the maximum of both gases within a minute. That works for CO<sub>2</sub>, but in an oxygen-depleted sample the O<sub>2</sub> maximum is often just the ambient reading the meter started at. Take O<sub>2</sub> once the sample has arrived and the number has settled, and pair it with the CO<sub>2</sub> from the same gas. If it never settles, write down the range.
{{< /alert2 >}}


#### Taking a sample for the lab {#taking-a-sample-for-the-lab}

Flush the analyzer with soil gas first. Valve 4 diverts gas before it reaches the sensors, so you won't get readings while you fill.

1.  With the pump off, set valve 6 to free air and attach the container to the luer port on valve 4.
2.  Turn valve 4 to the collection port (OFF handle toward the CO<sub>2</sub> sensor).
3.  Run the pump until the container is full, then stop it.
4.  Return valve 4 to the sensor path, then seal and disconnect the container.

Label it with sample ID, well, depth, date, and time. The paper's bags held samples for up to three days; anything longer went into evacuated glass vials.


### One-port wells and tubes {#one-port-wells-and-tubes}

With only one connection, you pull a sample up into the analyzer, stop the pump, and close valve 6 to hold it while you read.

1.  With the pump off, connect the well to the black intake. Set valves 1–5 to their starting routes and valve 6 to free air.
2.  Work out how much gas to draw: the tubing, any reservoir, and the analyzer itself. Tubing volume is \\(\pi r^{2}l\\), using the **inside** radius.
3.  Divide that by your pump's flow rate to get a draw time. 100 mL at 500 mL/min is 12 seconds. Time your pump against a known volume once and write the rate on the case.
4.  Start the pump, watch the trap and gauge, and stop it when the time is up.
5.  Close valve 6 (OFF handle toward the check valve). Watch the readings for about a minute and record them the same way as above.

{{< alert2 Warning >}}
**Pump off first, then close valve 6.** Pumping against a closed valve 6 can overpressurize the system. Reopen it to free air before the next draw.
{{< /alert2 >}}

If you want the gas already sitting in the tube, don't overdraw: pulling much more than the tubing and analyzer volume pushes it out the other end. If you want gas from below the tube, draw enough to clear the tube first. The lab protocol calls for a sampling tube that holds at least the analyzer's internal volume.

Check your timing with a known gas before you trust short draws.


### Syringe or gas-bag injection {#syringe-or-gas-bag-injection}

Valve 2 takes discrete samples from a syringe or bag. It feeds the pump directly and skips the water trap, so keep the sample dry.

1.  Complete the ambient check and stop the pump. Leave valves 1 and 3–5 on their starting routes and valve 6 on free air.
2.  Attach the syringe or luer-lock bag to valve 2 and switch it to the luer (OFF handle toward the gauge).
3.  Start the pump and let it draw the sample in. Stop it as the syringe or bag empties.
4.  Switch valve 2 back to the gauge before disconnecting.
5.  Record the CO<sub>2</sub> peak and the settled O<sub>2</sub> reading.

Stopping the pump at the end keeps room air from following the sample in. Run a standard through the same steps once to learn how much sample you need and how long the readings take.

Near ambient, CO<sub>2</sub> may not show a clear peak, and small differences are hard to see. For small incubation headspaces, make sure you have enough gas before you start.


## Backflushing water out of the lines {#backflushing-water-out-of-the-lines}

If water gets into the trap or you see condensation ahead of the sensors, stop and clear it. Disconnect the well and point the black intake into a waste container, away from the open case.

Backflushing sends room air in through valve 2, through the pump, across from valve 3 to valve 1, and down through the trap, pushing the water out the black intake. The pump runs normally; the valves just reroute it around the sensors.

1.  Turn the pump off.
2.  Set valve 1 to connect the backflush line to the top of the trap (OFF handle toward the gauge).
3.  Set valve 2 to draw room air through its luer port (OFF handle toward the gauge).
4.  Set valve 3 to send the pump's output to the backflush line (OFF handle toward valve 4). Leave valves 4–6 alone.
5.  Check the black intake is pointed into the waste container, then run the pump briefly.
6.  Turn the pump off, return valves 1–3 to their starting routes, check the trap and lines, and redo the ambient check.

{{< alert2 Warning >}}
**If water may have reached a sensor, stop.** Backflushing only clears the intake plumbing. Don't pump more gas through a wet sensor; get the instrument looked at.
{{< /alert2 >}}


## Between samples and recording results {#between-samples-and-recording-results}

Stop the pump before disconnecting a well. Put the valves back to their starting routes with valve 6 on free air, and draw room air through the black intake until both readings return to your ambient baseline. Don't move on until they do, especially after a high-CO<sub>2</sub> sample or a one-port read.

For each measurement, record:

-   Sample ID, well or tube, depth, date, and time.
-   Instrument ID, CO<sub>2</sub> scaling, raw mV, converted CO<sub>2</sub>, and O<sub>2</sub> percent.
-   Ambient CO<sub>2</sub> and O<sub>2</sub>, temperature, and any compensation you applied.
-   Sampling method, draw or flush time, and when you took the reading.
-   Anything odd: water, unusual vacuum, unstable readings, repeats, or a collected sample's container ID.

If you use the same multimeter for temperature, record the CO<sub>2</sub> voltage first, then switch the leads over to the thermocouple. Switch them back before the next sample.


## After each session {#after-each-session}

1.  Do the between-sample flush. If there's any moisture, backflush before putting the instrument away.
2.  Turn off the pump, CO<sub>2</sub> sensor, and O<sub>2</sub> meter.
3.  Leave the valves in their starting positions, with valve 6 on free air. Cap the unused luer ports.
4.  Check the trap and lines are dry, protect the white return port, and close the case without pinching any tubing or valve handles.
5.  Charge the battery and file your notes.


## Troubleshooting {#troubleshooting}

Start with the symptom.


### Water in the trap, or condensation in the lines {#water-in-the-trap-or-condensation-in-the-lines}

Turn the pump off. Disconnect the well and backflush. Don't go back to a flooded well, and don't use the instrument if water may have reached the sensors.


### The vacuum gauge drops hard negative {#the-vacuum-gauge-drops-hard-negative}

Stop the pump and check the intake for a kink, blockage, or water. The paper treats readings below about −20 kPa as a blocked intake, but any sudden jump from your usual reading is worth stopping for. The gauge sits before the pump, so it won't warn you about a blocked outlet.


### O<sub>2</sub> won't come back to ambient at startup {#o-won-t-come-back-to-ambient-at-startup}

Check the meter's battery and the gas path, and give it more time in clean air. If it's still off, calibrate the meter per its manual and check it against a certified standard. If you're working at low O<sub>2</sub>, check a low standard too.


### The CO<sub>2</sub> baseline never settles {#the-co-baseline-never-settles}

Give it longer to warm up, check the battery and voltage connections, and confirm the scaling. Keep your breath away from the intake. If a known standard reads consistently off, recalibrate or apply the compensation from the manual.


### Samples come out looking flat or diluted {#samples-come-out-looking-flat-or-diluted}

Check that you flushed long enough, that valve 6 was where you thought it was, and that the connections aren't leaking. Run a known standard through the same route and compare it with earlier runs. If you were recirculating, check how long the loop ran.

{{< alert2 Caution >}}
**Don't use CO<sub>2</sub> + O<sub>2</sub> ≈ 21% as a leak test.** Good samples can land there too. Check the connections and run a standard instead.
{{< /alert2 >}}


### One-port results are inconsistent {#one-port-results-are-inconsistent}

Recheck the tube's inside diameter, the reservoir volume, your pump's flow rate, and the draw time. Keep the order the same every time: pump off, then valve 6.


### Readings depend on the previous sample {#everything-reads-plausibly-but-nothing-agrees-between-wells}

Check that readings return to ambient after a high sample, then rerun a known gas. If results change with the order you sampled in, the analyzer isn't being flushed well enough between samples.


## Appendix: ARQ {#appendix-arq}

Brecheisen et al. calculate the apparent respiratory quotient from the rise in soil CO<sub>2</sub> above ambient and the drop in O<sub>2</sub> below ambient, multiplied by 0.76 to account for the two gases' different diffusivities:

\\[\mathrm{ARQ} = 0.76\\,\frac{C\_{\mathrm{soil}}-C\_{\mathrm{ambient}}}{O\_{\mathrm{ambient}}-O\_{\mathrm{soil}}}\\]

\\(C\\) is CO<sub>2</sub> and \\(O\\) is O<sub>2</sub>, all in the same units; percent is easiest. The denominator is **ambient minus soil**, so it comes out positive.

For example, with ambient air at 0.04% CO<sub>2</sub> and 20.95% O<sub>2</sub>, and soil gas at 2.04% CO<sub>2</sub> and 18.95% O<sub>2</sub>, both changes are 2.00 percentage points and ARQ = 0.76. The plain ratio would be 1.00.

ARQ gets noisy fast when either change is small, especially when O<sub>2</sub> barely drops. If the O<sub>2</sub> change is within your measurement error, skip the ARQ for that sample. Round to the precision your measurements support.

The 0.76 factor is for soil gas moving by diffusion, as in the paper; leave it off for closed incubations. ARQ also picks up gas transport and other sources and sinks, so read it alongside your other data before drawing conclusions about substrate or anaerobic activity.


## Published performance {#performance-per-the-paper}

Brecheisen et al. compared 1,639 field CO<sub>2</sub> measurements against gas chromatography across roughly 0.25–7.75% CO<sub>2</sub>, with a slope of 1.017, an intercept of −0.033, and R<sup>2</sup> = 0.956. That's good agreement for enriched soil gas. Near ambient, check it yourself with standards.

The paper gives a precision of at least 0.1% for both gases, meaning 0.1 percentage points (1,000 ppm). For the uncertainty of a particular measurement, go by your sensor's specs and your standard checks.


## Further reading {#further-reading}

| Document                                                                                                                                                                       | Link                                                                                                      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Brecheisen, Cook, Heine, Ryang &amp; Richter (2019), _Development and deployment of a field-portable soil O<sub>2</sub> and CO<sub>2</sub> gas analyzer and sampler_, PLOS ONE | [doi:10.1371/journal.pone.0220176](https://doi.org/10.1371/journal.pone.0220176)                          |
| Vaisala `GMM220` module user guide, for the analog output and range configuration                                                                                              | [Vaisala](https://www.vaisala.com/sites/default/files/documents/GMM220%20User%20Guide%20in%20English.pdf) |

The valve numbering and workflows come from the Kirk lab's working protocol, _FieldPortableGasAnalyzerProtocols_edited.docx_. Its notes leave the voltage scaling and the pump-off readings open, so check those with the instrument's maintainers and a standard gas. Keep the configuration and calibration records in the case.

---

_Created in Doom Emacs with Org Mode._

_Written from March to September 2026._
