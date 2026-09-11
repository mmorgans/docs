+++
title = "Using the Field Portable Gas Analyzer (FPGA)"
date = 2026-03-29T10:30:00+08:00
draft = true
+++

{{< alert2 Warning >}}
**Keep water away from the sensors.** Water in the trap, condensation in the lines, or a sudden vacuum drop that suggests a flooded intake all mean the same thing: stop the pump. The CO<sub>2</sub> probe reads badly for a long time after it gets wet, and replacing it is neither fast nor cheap.
{{< /alert2 >}}

{{< alert2 Warning >}}
**Don't run the pump against a sealed loop.** Valve 6 can close both outlet paths. The pump must already be off before you put it there.
{{< /alert2 >}}


## Introduction {#introduction}

The Field Portable Gas Analyzer is a home-built field rig for pulling soil gas up out of a well, measuring O<sub>2</sub> and CO<sub>2</sub>, and collecting a sample if you want one for the lab later. It came out of [Brecheisen et al. 2019](https://doi.org/10.1371/journal.pone.0220176), which describes the design and validates it against gas chromatography. That paper is worth reading if you want to know why the thing is built the way it is; this guide is about operating it.

The parts that matter: a Vaisala `GMP221` CO<sub>2</sub> probe on a `GMM220` transmitter module, an Apogee `MO220` O<sub>2</sub> meter, a diaphragm pump, a water trap, a vacuum gauge, and six numbered three-way valves that decide where the gas goes. All of it lives in a Pelican case and runs off a 12 V battery. The paper puts the build at roughly $2,000 and under 10 kg including the battery, which is the entire point of it existing.

{{< alert2 Note >}}
**Builds differ.** The paper describes one instrument; the unit in your hands may not match it in every detail, and two units in the same case rack may not match each other. Valve numbering, sensor ranges, and the voltage-to-concentration conversion are all things to confirm against the documentation packed with your specific case rather than assume from this page.
{{< /alert2 >}}


## What the FPGA measures {#what-the-fpga-measures}

O<sub>2</sub> comes off the Apogee meter directly, in percent. CO<sub>2</sub> does not: the Vaisala module puts out an analog voltage, and you read that voltage on the multimeter and convert it yourself. Temperature is separate, on the thermocouple in the case.

Measuring both gases at once is the reason to bother with this instrument rather than a CO<sub>2</sub>-only analyzer. Soil CO<sub>2</sub> usually climbs while O<sub>2</sub> falls, and the ratio of those two changes carries information that CO<sub>2</sub> alone doesn't — about what's being respired, how well the pores are connected, and how anaerobic things have gotten down there. That ratio is the Apparent Respiratory Quotient. See [the ARQ appendix](#appendix-arq) if you plan to calculate it, because there are a few ways to get it wrong.


### Converting the CO<sub>2</sub> voltage {#converting-the-co-voltage}

The `GMM220` module's analog output is 0–1 V by default, spanning whatever concentration range the probe was configured for at the factory. So the voltage means nothing until you know that range.

Once you do, it's a straight proportion. For a unit configured 0–1 V across 0–1% CO<sub>2</sub>:

| Voltage  | CO<sub>2</sub>                  |
|----------|---------------------------------|
| 10 mV    | 0.01% (100 ppm)                 |
| 43 mV    | 0.043% (430 ppm), about ambient |
| 100 mV   | 0.10% (1,000 ppm)               |
| 1,000 mV | 1.00% (10,000 ppm)              |

{{< alert2 Caution >}}
**That table is an example, not a specification.** It only holds if your probe is configured 0–1 V over 0–1%. A `GMP221` is the higher-concentration probe in the family and is commonly configured for wider ranges, in which case every number above is wrong by whatever factor. Get the range from your unit's paperwork before you convert anything.
{{< /alert2 >}}

Record the raw millivolts alongside the converted number, every time. If the scaling ever turns out to be wrong you can recompute from millivolts. You cannot go the other way.

NDIR sensors also drift with temperature, which is the other reason the thermocouple is in the case. If you're working somewhere cold or hot enough to be uncomfortable, the probe is uncomfortable too — check whether your unit's documentation gives a correction.


## The valve map {#the-valve-map}

Six numbered three-way valves route the gas. Everything else about operating this instrument is a consequence of where they're pointed.

| Valve | Normal position                                    | Other position                                                                     |
|-------|----------------------------------------------------|------------------------------------------------------------------------------------|
| 1     | Water trap to the intake path                      | Opens the reverse path for backflushing                                            |
| 2     | Pressure gauge to pump inflow                      | Opens the luer port for syringe or bag injection; free-air intake during backflush |
| 3     | Pump outflow toward the sensors                    | Reroutes pump outflow into the backflush line                                      |
| 4     | Pump toward the CO<sub>2</sub> sensor              | Opens the collection port for filling a bag or syringe                             |
| 5     | O<sub>2</sub> sensor to the check valve and outlet | Left alone during routine sampling                                                 |
| 6     | Where gas exits after the sensors                  | Free air, the white return port, or sealed for one-port mode                       |

Gas otherwise travels one direction: black intake, water trap, pressure gauge, pump, CO<sub>2</sub> sensor, O<sub>2</sub> sensor, check valve, out. The check valve stops room air backing into the outlet when the pump is off.

{{< alert2 Caution >}}
**Confirm this map against your unit before trusting it.** The paper describes numbered three-way valves but doesn't publish a complete numbering scheme, and builds vary. Trace the plumbing once with the case open and the pump off — it takes ten minutes and it is worth considerably more than ten minutes.
{{< /alert2 >}}

Two other things you'll be connecting to: the white external port on the side of the case, which is the return line for two-port wells, and the luer ports on valves 2 and 4.

The diagram below translates each workflow into valve states. It names the gas path rather than the direction a physical handle points, because that part can differ between builds.

{{&lt; fpgavalves &gt;}}


### Four numbers to measure once and write on the case {#four-numbers-to-measure-once-and-write-on-the-case}

None of these are in the paper, and they're different for every build, but almost every procedure below quietly depends on one of them.

-   **The instrument's internal volume.** How much gas it takes to fill the path from intake to outlet. Every "flush until it's actually your sample" instruction is really a statement about this number.
-   **The pump's real flow rate.** Time it moving a known volume. This is the only way to turn "run the pump long enough" into a number of seconds.
-   **The normal vacuum gauge reading** during ordinary sampling. "Watch for a sudden drop" is useless without knowing what it's dropping from.
-   **How long the CO<sub>2</sub> probe takes to settle from cold.** You need this every time you power it up.

Write them inside the lid. Whoever opens this case in two years will not otherwise have them.

{{< alert2 Caution >}}
**The white port sticks out of the case.** It will snap off if the case is dropped on that side or packed carelessly. Check that nothing is pinched under the lid before you latch it.
{{< /alert2 >}}


## Startup and ambient check {#startup-and-ambient-check}

Do this every time, before the first sample, whatever mode you're planning to use.

1.  Put every valve in its normal position, per the map above.
2.  Power on the CO<sub>2</sub> sensor, the O<sub>2</sub> meter, and the pump, with nothing connected to the intake or the return port.
3.  Let it run on room air for about a minute.
4.  Confirm O<sub>2</sub> reads close to ambient — around 20.95%. If it doesn't, stop and sort that out before sampling.
5.  Read the CO<sub>2</sub> baseline on the multimeter and **write it down**. Outdoor air is the number you want; indoor air runs higher and varies with how many people are standing around.
6.  Look at the water trap and the vacuum gauge before you attach anything.

That ambient CO<sub>2</sub> and O<sub>2</sub> pair is not a formality — every delta you calculate later comes off it, measured at that site on that day. Textbook atmospheric values are not a substitute.


## Field workflows {#field-workflows}

Three ways to get gas into the instrument, depending on what you're sampling from. All of them start with the ambient check above.


### Two-port wells {#two-port-wells}

The default, when the well has separate intake and return lines.

1.  Complete the startup and ambient check.
2.  Connect one well line to the black intake and the other to the white return port.
3.  Check that the trap is dry and the gauge isn't showing a kink or a flood.
4.  Flush the analyzer with soil gas before you record anything. You are trying to replace the room air sitting in the instrument and the tubing with gas from the well, so a longer tubing run needs a longer flush. Err long; a premature reading is a much more common problem than an over-flushed one.
5.  Turn valve 6 to route the outlet to the white return port, closing the loop through the well.
6.  Shut the pump off and record the highest CO<sub>2</sub> and O<sub>2</sub> you see over the next minute or so.

CO<sub>2</sub> will rise to a peak and then sag slightly. That's the probe settling, not the soil gas changing — record the peak. Recording the lower, calmer-looking number biases your whole dataset in a direction you won't notice until much later.

{{< alert2 Note >}}
**Keep the loop circulating for as short a time as you can.** The paper reports an apparent dilution of 0.1–0.2% CO<sub>2</sub> from this recirculating method. Closing the loop is how the workflow works; leaving it closed longer than necessary is not.
{{< /alert2 >}}

If you're working a series of wells, go from low CO<sub>2</sub> to high where you can — usually shallow before deep. It cuts down on carryover.


#### Taking a sample for the lab {#taking-a-sample-for-the-lab}

Do this after the loop is already full of soil gas.

1.  Attach the bag or syringe to the luer port on valve 4.
2.  Turn valve 4 to close the path to the CO<sub>2</sub> sensor and open the collection port.
3.  Run the pump and fill the container.
4.  Return valve 4 to the sensor path before you disconnect anything.

Label it immediately — well, depth, date, time. Bags are a transport container, not a storage container; if the sample isn't getting analyzed promptly, or you care about the O<sub>2</sub> number, move it into an evacuated vial.


### One-port wells and tubes {#one-port-wells-and-tubes}

For a well or tube with only one opening. There's no return path, so instead of closing a loop you're pulling a slug of gas up and then trapping it.

1.  Complete the startup and ambient check.
2.  Connect the well to the black intake only.
3.  Work out roughly how much gas is sitting in the tubing before you start. For a tube of internal radius \\(r\\) and length \\(l\\) that's just \\(\pi r^{2} l\\). Measure the **inside** diameter rather than trusting the label — tubing is normally sold by outside diameter, and for the sizes used here that mistake will halve your answer.
4.  Run the pump just long enough to bring that gas up into the analyzer, plus enough to fill the instrument's own internal volume. Keep going past that and you start pulling from a larger and much less well-defined chunk of soil.
5.  **Turn the pump off**, then move valve 6 to the sealed position.
6.  Record the peak CO<sub>2</sub> and O<sub>2</sub> over the next minute.

{{< alert2 Warning >}}
**Pump off first, then valve 6.** Sealing the loop with the pump still running overpressurizes the system. This is the one ordering mistake in this workflow that damages something.
{{< /alert2 >}}

How long "long enough" is depends on your pump and your tubing, and the only way to know it is to time your own unit moving a known volume. Do that once and write it on the case.

This mode also needs the installed tubing volume to be large enough to fill the instrument's internal path. If the well holds less gas than the analyzer does, you'll be measuring a blend of soil gas and whatever was already inside.


### Syringe or gas-bag injection {#syringe-or-gas-bag-injection}

For discrete samples, standards, incubation headspace — anything not plumbed as a well.

1.  Complete the startup and ambient check.
2.  Turn valve 2 to open its luer port.
3.  Attach the syringe or luer-lock bag.
4.  Let the pump draw the sample in. Push the plunger fully, or let the bag empty.
5.  Return valve 2 to the through-flow position before disconnecting.
6.  Record the peak CO<sub>2</sub> and O<sub>2</sub>.

For samples near ambient the peak is subtle and easy to miss. Run a known standard first and watch how long your unit takes to reach maximum, then use that timing.

For small headspaces, keep it brief — you only need to displace the instrument's internal volume, and prolonged pumping will just dilute or exhaust what little sample you have.


## Backflushing water out of the lines {#backflushing-water-out-of-the-lines}

This is a recovery procedure, not a sampling mode. Use it when water or condensation has gotten into the plumbing.

The idea is simple enough: reverse the flow so the pump pulls room air in through valve 2 and pushes it backward through the water trap and out the black intake line, carrying the water with it. Valves 1, 2, and 3 all move off their normal positions to do that, and they all go back afterward.

1.  Turn the pump off first.
2.  Set valves 1, 2, and 3 to their backflush positions (see the note below).
3.  Point the black intake tube away from yourself, everyone else, and the open case.
4.  Run the pump briefly.
5.  Stop once the trap and lines are clear, then return valves 1, 2, and 3 to normal before sampling again.

{{< alert2 Warning >}}
**Work out the three backflush positions before you need them.** Which way each handle turns is build-specific, and the moment you discover you don't know is the moment there's already water in the lines. Trace the reverse path once with the case open and the pump off, then write the positions for valves 1, 2, and 3 inside the lid. This is the procedure that keeps water off the CO<sub>2</sub> probe, and it's worth ten minutes on a dry afternoon rather than ten minutes in a field.
{{< /alert2 >}}

{{< alert2 Warning >}}
**Water sprays out of the intake line during a backflush.** Away from your face, the electronics, your notebook, and the open case. If you think water actually reached a sensor housing, stop using the instrument until someone has looked at it.
{{< /alert2 >}}


## After each session {#after-each-session}

1.  Pump off, then the CO<sub>2</sub> sensor, then the O<sub>2</sub> meter.
2.  With the intake open to free air, run the pump about 30 seconds to clear soil gas out of the lines. It cuts down on condensation in storage.
3.  Return all valves to normal.
4.  Check the trap. Any moisture at all, do a short backflush before closing up.
5.  Cap the luer ports and check the white port is protected.
6.  Latch the case, making sure no tubing or valve handle is caught under the lid.


## Troubleshooting {#troubleshooting}

Symptoms first. Work down until one of them matches.


### Water in the trap, or condensation in the lines {#water-in-the-trap-or-condensation-in-the-lines}

Pump off, immediately. Backflush before sampling again, and don't go back to a well you suspect is flooded.


### The vacuum gauge drops hard negative {#the-vacuum-gauge-drops-hard-negative}

The paper puts the threshold at about −20 kPa for a clogged, kinked, or flooded intake. Don't wait for it to get there — any sudden drop from your normal operating pressure is worth stopping for. Shut the pump off and look at the line.


### O<sub>2</sub> won't come back to ambient at startup {#o-won-t-come-back-to-ambient-at-startup}

Check the meter's battery, give it longer in free air, and make sure you aren't running the ambient check somewhere poorly ventilated. If it still won't settle near 20.95%, don't trust low-O<sub>2</sub> readings from that session. If your work depends on the low end specifically, check the meter against a certified standard rather than assuming it's linear down there.


### The CO<sub>2</sub> baseline never settles {#the-co-baseline-never-settles}

More warmup time, then battery and wiring, then confirm you're using the right voltage scaling. Indoor air genuinely does read higher than outdoor air, so make sure you aren't chasing a real signal.


### Samples come out looking flat or diluted {#samples-come-out-looking-flat-or-diluted}

Insufficient flush, too much recirculation, a leak, or carryover from the last high-CO<sub>2</sub> well. Work through them in that order — the flush is both the most common cause and the cheapest to rule out.

{{< alert2 Caution >}}
**Don't use "CO<sub>2</sub> + O<sub>2</sub> ≈ 21%" as a contamination test.** An earlier version of this guide suggested it. It's wrong: that sum lands at 21% precisely when ARQ is 1.0, which is the textbook aerobic case, and exceeds 21% whenever ARQ is above 1. The test flags perfectly good samples as contaminated and tells you nothing useful about a leak. What the sum actually tracks is ARQ, which is the thing you were trying to measure in the first place.
{{< /alert2 >}}


### One-port results are inconsistent {#one-port-results-are-inconsistent}

Either your timing is off or the well simply doesn't hold enough gas to fill the analyzer. Re-time your pump against a known volume, and check you aren't pulling from well outside the intended sampling volume.


### Everything reads plausibly but nothing agrees between wells {#everything-reads-plausibly-but-nothing-agrees-between-wells}

Carryover is the usual culprit. Flush longer between samples, and work low concentration to high.


## Appendix: ARQ {#appendix-arq}

The Apparent Respiratory Quotient is the ratio of how much CO<sub>2</sub> appeared to how much O<sub>2</sub> disappeared:

\\[\mathrm{ARQ} = \frac{\Delta \mathrm{CO\_2}}{\Delta \mathrm{O\_2}}\\]

Both deltas are measured against the ambient baseline you recorded **at that site, that day**, and both must be in the same units.

The reason to be careful with it is that it's a ratio of two differences, and differences are where measurement error goes to compound. The paper gives the instrument at least 0.1% precision for both gases, absolute — 0.1 percentage points, not 0.1% of the reading. When your deltas are large, that's nothing. When your deltas are themselves near 0.1%, you are dividing one uncertain small number by another, and the result is noise wearing a lab coat.

So a sample that barely differs from ambient is not an ARQ sample, however carefully you ran the protocol. That's a sampling-design problem to solve before you go to the field, not an analysis problem to solve afterward.

Interpreting the number once you have a good one — what pushes it above or below 1, and how much of that is biology versus the different diffusion rates of CO<sub>2</sub> and O<sub>2</sub> through wet pores — is a real literature and out of scope here.


## Performance, per the paper {#performance-per-the-paper}

Worth knowing what the instrument was actually shown to do, as opposed to what it feels like it's doing in a field.

Brecheisen et al. validated CO<sub>2</sub> against gas chromatography across 1,639 paired measurements: slope 1.017, intercept −0.033, R<sup>2</sup> 0.956. Precision is given as at least 0.1% for both gases, and again that figure is absolute. At 5% CO<sub>2</sub> that's a couple percent of the reading. At 0.2% CO<sub>2</sub> it's half of it.

None of which is permission to skip the ambient check or leave water in the lines.


## Further reading {#further-reading}

| Document                                                                                                                                                                       | Link                                                                                                      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Brecheisen, Cook, Heine, Ryang &amp; Richter (2019), _Development and deployment of a field-portable soil O<sub>2</sub> and CO<sub>2</sub> gas analyzer and sampler_, PLOS ONE | [doi:10.1371/journal.pone.0220176](https://doi.org/10.1371/journal.pone.0220176)                          |
| Vaisala `GMM220` module user guide, for the analog output and range configuration                                                                                              | [Vaisala](https://www.vaisala.com/sites/default/files/documents/GMM220%20User%20Guide%20in%20English.pdf) |

Sensor manuals and the factory scaling for your particular unit should be in the case with it. If they aren't, that's the first thing to fix.

---

_Written in March 2026._
