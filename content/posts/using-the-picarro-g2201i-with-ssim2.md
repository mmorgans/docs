+++
title = "Using the Picarro G2201-i Analyzer with an A0314 SSIM2"
date = 2026-08-05
draft = false
+++

{{< alert2 Warning >}}
**Think carefully:** these are very, very expensive machines. No guide can replace thinking critically before you act. Don't be dumb. Have fun!
{{< /alert2 >}}

{{< alert2 Warning >}}
**Vacuum is required.** The analyzer vacuum pump must be connected and running whenever the analyzer is powered. Don't turn off the pump, unplug it, or pull the vacuum line while the analyzer is operating.
{{< /alert2 >}}


## Introduction {#introduction}

The Picarro G2201-i is a benchtop cavity ring-down spectrometer that measures CO<sub>2</sub>, CH<sub>4</sub>, δ<sup>13</sup>C-CO<sub>2</sub>, and δ<sup>13</sup>C-CH<sub>4</sub> in a stream of gas.

The instrument in this guide, a Picarro G2201-i named Luke, belongs to the [Billings Lab](https://billingslab.ku.edu). On its own, the analyzer needs a continuous supply of gas, which allows you to measure large gas samples from cylinders or otherwise. With the paired A0314 Small Sample Introduction Module (SSIM2), it allows the analyzer to hold and measure a discrete sample and give you an average over a defined measurement window.

The lab also owns a G2101-i named Leia, paired with an older model A0312 SSIM. The two machines are generally similar, and most of the guidance below will also apply to Leia, but she is still under repair and none of the below has been validated against her.

This guide covers the measurement principle, setup of the system, running a sample, and basic troubleshooting.


## How the measurement works {#how-the-measurement-works}


### Cavity ring-down spectroscopy {#cavity-ring-down-spectroscopy}

The analyzer fires a laser into a small cavity walled with extremely reflective mirrors. Once enough light has built up inside, the laser shuts off. The trapped light keeps bouncing around while a detector watches it decay exponentially, and the time constant of that decay is the ring-down time.

Gas molecules absorb specific wavelengths of infrared light. So do isotopologues — versions of a molecule distinguished by which isotopes they contain, like ¹²CO₂ and ¹³CO₂, or ¹²CH₄ and ¹³CH₄. (¹³CO₂ is ordinary CO₂ wearing a heavier carbon.) Each of them, water vapor included, eats into the ring-down time at its own wavelengths. The analyzer scans the wavelengths, measures how much each one gets absorbed, and converts that into mole fractions and isotope ratios.

Because the light crosses the cavity many thousands of times before it decays, the effective optical path is enormous even though the cavity itself is tiny, allowing this process to be done in a box that fits on a lab bench.

{{< alert2 Note >}}
It is worth keeping in mind that the analyzer measures _continuously_, forever, whatever gas happens to be in front of it. By itself, it has no concept of a "sample." The SSIM decides which gas arrives and when, and the bundled Coordinator software decides which slice of that record gets called a measurement and saved to a file.
{{< /alert2 >}}


### Concentration, isotopologues, and delta values {#concentration-isotopologues-and-delta-values}

Concentration comes out as a mole fraction. For gases, ppmv means parts per million by volume; the software and the rest of this guide shorten that to ppm.

δ<sup>13</sup>C — pronounced "delta C thirteen" — describes the ¹³C/¹²C ratio of your sample relative to a reference. Carbon isotope values are reported in per mil (‰) against VPDB, the [Vienna Pee Dee Belemnite scale](https://en.wikipedia.org/wiki/Reference_materials_for_stable_isotope_analysis#Carbon). A negative value means the sample has less ¹³C relative to ¹²C than the reference does. Because VPDB is a ¹³C-rich marine carbonate and photosynthesis discriminates against ¹³C, essentially everything biological reads negative:

| Source                     | Typical δ<sup>13</sup>C |
|----------------------------|-------------------------|
| Atmospheric CO<sub>2</sub> | −9 to −7‰               |
| C<sub>3</sub> plant carbon | −30 to −24‰             |
| C<sub>4</sub> plant carbon | −14 to −10‰             |

{{< alert2 Caution >}}
**Don't trust the `13CO2` field on its own.** Picarro calibrates `12CO2` (or `12CO2_dry`) and δ<sup>13</sup>C. Adding the displayed `12CO2` and `13CO2` together gets you a decent back-of-the-envelope total CO<sub>2</sub>, but keep in mind that the `13CO2` displayed is derived. It's prudent to derive your own ¹³CO₂ — see [the appendix](#appendix-deriving-co-yourself), which works through the arithmetic with an example.
{{< /alert2 >}}


### What the SSIM does {#what-the-ssim-does}

SSIM stands for Small Sample Introduction Module. Luke uses the A0314, which is the SSIM2.

The SSIM allows you to measure a discrete sample of gas instead of a continuous stream. It gets there by purging and evacuating a small internal chamber, admitting your sample, sealing it in, and then opening a path so the analyzer can draw that gas through the cavity.

Picarro documentation alludes to the ideal sample volume being 20ml, due to that being the size of the SSIM chamber. It's recommended to budget for more than 20mL to account for gas lost during transfer.

{{< alert2 Note >}}
**"alludes"** is an imprecise word. I say it, and generally hedge annoyingly throughout this article, because the many pieces of Picarro documentation I have unwillingly ingested in this process offer frequently conflicting information. The information and recommendations present in this article are based upon my experience and institutional knowledge. Your mileage may vary.
{{< /alert2 >}}


## Hardware {#hardware}


### Analyzer {#analyzer}

Luke is a spectrometer stacked on top of a Windows 7 desktop. The top half of the chassis contains the optical cavity and associated support hardware, and the bottom half is a meek and aging desktop computer. Accordingly, you'll need a monitor, keyboard, and mouse, and the usual computer troubleshooting instincts apply here.

Although Luke boots to a bootloader offering both Windows 7 and Windows XP, use of Windows 7 is required. Windows XP does not contain the correct version of the Picarro driver or Coordinator and will result in incorrect data.

On the front of Luke is one USB-A port for an accessory, and the power button. On the back left is the standard array of motherboard I/O and the power supply unit switch, and on the back right are the plumbing connections for the analyzer.


### SSIM2 {#ssim2}

The front panel has `CAL` and `SAMPLE` ports. The rear panel has `ZERO AIR`, a USB-B port, `VALVES`, `VACUUM`, and (depending on which labeling revision you got) `SAMPLE OUTLET` or `ANALYZER`.

The SSIM2 draws power over USB and talks to the analyzer over the same cable, using an internal Arduino board. The separate beige `VALVES` cable is what lets the analyzer actually throw the internal valves that route gas around inside the box.

{{< alert2 Note >}}
The green light on the front of the SSIM will stay on as long as the power switch on the back of the analyzer is on.
{{< /alert2 >}}


### What you need {#what-you-need}

For Luke plus the SSIM2:

-   G2201-i analyzer and its A2000 analyzer vacuum pump
-   A0314 SSIM2 and its own separate A2000 vacuum pump
-   Two clear vacuum hoses
-   Short C-shaped 1/8-inch stainless-steel tube that connects the SSIM2 to the analyzer
-   A cylinder of zero-air, a CGA 590 regulator, and 1/8-inch tubing
-   Beige valve cable
-   USB-A to USB-B cable (USB-B cables are often found near printers and are seldom used in the year of Our Lord 2026. Feel free to loot a cubical for one.)
-   Monitor, keyboard, mouse, and power cables
-   Four wall outlets: one for the analyzer, two for the pumps, one for the monitor.

{{< alert2 Note >}}
**Zero air:** Multiple pieces of Picarro documentation state that zero air is always required, and go as far as indicating that the analyzer will be damaged if not supplied with zero air at all times.

The opposite is true: zero air is only needed while the SSIM is actively running a sample, and **it is _bad_ for the analyzer to be fed zero air for extended periods**. The rest of the time — the whole warmup included — the analyzer should be breathing ordinary lab air.

The tidy way to manage this is to plumb everything as though zero air flowed constantly (cylinder, regulator, and the `ZERO AIR` line all connected and set), then park it in a resting state whenever you're not sampling: close the zero-air outlet valve at the regulator, and undo the stainless-steel tube at the **analyzer inlet** end only — leave it attached at the SSIM outlet — swinging it slightly aside so the inlet breathes room air. In that state the analyzer reads lab air, commonly 400–500 ppm CO<sub>2</sub>.

To run an SSIM sample, reverse exactly those two moves: reseat the tube at the analyzer inlet, and open the zero-air outlet valve. One fitting, one valve.
{{< /alert2 >}}


## Physical setup {#physical-setup}


### Bench and ventilation {#bench-and-ventilation}

You'll need some space, and it's wise to let this Beast breathe. Picarro specifies 10–35 °C for operation, and it generates a not-insignificant amount of heat.

Physically, the arrangement I've found easiest is to place the analyzer on the bench with both pumps on top of it; place the analyzer pump on the **right** and the SSIM pump (labeled "VAPORIZER") on the **left**. Place the SSIM itself on top of the two pumps; you might need to slightly spread them apart so that it fits in between their handles.

{{< alert2 Warning >}}
**Secure your cylinders.** Strap any compressed-gas cylinder near the analyzer to the bench, or put it in a proper stand.
{{< /alert2 >}}


### Vacuum connections {#vacuum-connections}

On Luke, one pump is labeled `Picarro Analyzer pump` and the other `FOR USE WITH PICARRO A0314 VAPORIZER` — referring to the SSIM. Connect the analyzer pump to the analyzer's `VACUUM` port and the SSIM pump to the SSIM2's `VACUUM` port using the two clear vacuum tubes. Use a wrench to tighten the connections slightly more than hand-tight.

{{< alert2 Note >}}
Use PTFE thread tape wherever tapered pipe threads form a seal, wrapping in the direction of the threads. Use only enough to wrap around the connection once or twice. Snug everything slightly past hand-tight with a wrench. Don't use thread tape on a Swagelok connection.
{{< /alert2 >}}


### Valve and USB connections {#valve-and-usb-connections}

Run the beige cable between the `VALVES` ports on the analyzer and the SSIM2, and tighten the locking screws on both ends. Then connect the SSIM2's USB-B port to a free USB-A port on the back of Luke.


### Monitor and accessories {#monitor-and-accessories}

Position your monitor near the analyzer, and use a UPS cable to connect it to power. Use a VGA cable to connect the monitor to VGA port on the back of the analyzer.

Connect a USB keyboard and mouse to 2 open USB ports on the back of the analyzer.

{{< alert2 Note >}}
You can also use the PS/2 ports (the purple and green pair) to connect a compatible keyboard and mouse if you have an old soul.
{{< /alert2 >}}


### Powering everything {#powering-everything}

Use UPS cables to connect the analyzer, the analyzer vaccum pump, and the SSIM vacuum pump to power. UPS cables are interchangeable!


### SSIM outlet to analyzer inlet {#ssim-outlet-to-analyzer-inlet}

Use the short C-shaped stainless-steel tube bundled with all the equipment. The 1/8-inch end goes to the SSIM2 sample outlet; the 1/4-inch adapter end goes to the analyzer inlet. You'll need to take a few moments to wrestle the tube into position around the beige `VALVES` cable.

This 1/4-inch inlet fitting is the one you break and remake every session: connect it and the analyzer draws from the SSIM; disconnect it and swing it aside and the analyzer breathes lab air. Leave the 1/8-inch SSIM-outlet end connected and cycle only this one — which also means this is the ferrule that slowly wears with use.

{{< alert2 Note >}}
**Swagelok** is a brand of compression fitting: a nut drives one or two ferrules onto the outside of clean tubing to make a gas-tight metal-to-metal seal. On this system they're used more or less interchangeably with threaded fittings, so most of the usual Swagelok gospel about ferrule seating and pull-up marks doesn't apply. Don't overthink it.
{{< /alert2 >}}

{{< alert2 Note >}}
In a moment of desperation, I became convinced that the piece of stainless-steel tubing was causing issues with the outputted data. I commissioned a replacement from Swagelok, which is the currently used part; the lab now has two pieces of identical tubing. Leia, the G2101-i, _also_ has an associated run of stainless-steel tubing for her SSIM, although it's a different length.

I don't believe that the new piece of tubing helped the issue. However, it is worth noting that each connection and disconnection of the tubing wears down the ferrule, so the old piece of tubing is likely somewhat degraded.
{{< /alert2 >}}


### Zero air {#zero-air}

The A0314 manual asks for dry, CO<sub>2</sub>- and CH<sub>4</sub>-free zero air: under 1 ppm CO<sub>2</sub>, under 5 ppb CH<sub>4</sub>, and under 10 ppm H<sub>2</sub>O. Ask a specialty-gas supplier (Airgas, Matheson) for dry ultra-zero air meeting those limits, and use a dual-stage regulator appropriate to the cylinder and gas.

Use appropriate fittings and tubing, ideally as short a length as possible, to connect the cylinder to the `ZERO AIR` connection on the back of the SSIM.

On the regulator, the high-pressure gauge shows cylinder pressure and the low-pressure gauge shows delivery pressure. The cylinder valve opens the tank, the regulator adjustment sets delivery pressure, and the outlet valve (if yours has one) isolates the downstream line. To bring it up:

1.  Back the regulator adjustment out until it feels slightly loose.
2.  Ensure the outlet valve is closed, if applicable.
3.  Open the tank cylinder valve slowly, standing off to the side, until the high-pressure gauge on the regulator shows pressure.
4.  Adjust the regulator adjustment until the low-pressure gauge displays your desired output pressure.
5.  Open the outlet valve, if applicable, and note that you'll likely need to adjust the regulator again to your desired pressure.
6.  Ideally, use a product like [Snoop](https://products.swagelok.com/en/all-products/leak-detectors-lubricants-sealants/leak-detectors/liquid-leak-detectors/c/902?clp=true) to check the connection(s) for leaks.

{{< alert2 Warning >}}
**Don't exceed 5 psig into the A0314.** Set delivery to **2–3 psig** and approach it from below, with the regulator backed out and the outlet closed before you open the cylinder. Over-pressurizing the SSIM inputs damages the module. This is not the same number as the 3–6 psi used for a cylinder connected straight to the analyzer inlet.
{{< /alert2 >}}

{{< alert2 Caution >}}
**Close the regulator and the cylinder when you're done.** Leaks are inevitable, and gas is expensive.
{{< /alert2 >}}


### Syringe connection {#syringe-connection}

Picarro's documented arrangement is a 50 or 60 mL Luer-lock syringe, a manual stopcock or integral twist valve, a 21-gauge or larger-bore side-port needle, and a septum adapter on the SSIM sample port. In reality, the current setup is a set of plastic tubing and luer-locks that are almost certainly the cause of sample leakage.

If you're using that system of plastic tubing, make sure that it's **screwed all the way** onto the sample port on the SSIM. Additionally, make sure when you are running a measurement that you are holding the apparatus in a way so that the tubes aren't needlessly kinked.

{{< alert2 Note >}}
Feel free to move the Field of Science Forward by fabricating a more elegant way of getting samples into the SSIM. There are septa in drawer L1-17 and L1-18 of the South Lab to get you started. The official septum adapter is three parts: a Swagelok `SS-400-R-2` 1/4-to-1/8-inch straight tube adapter, an `SS-200-NFSET` 1/8-inch nut/ferrule set, and Picarro `C0352` septa.
{{< /alert2 >}}

The important takeaway here is that the sample must be _isolatable_. If you can't close it off, the SSIM will pump it away during purge, and you'll get to watch. It's also important that the valve (i.e. a luer-lock stopcock or something) be as close to the sample as possible.

Put differently, you want the SSIM to evacuate as much of the tubing as possible up to the sample, so that no residual gas (either ambient air or a previous sample) contaminates your sample.

{{< alert2 Warning >}}
**Never inject liquid, visible condensation, aerosols, or particles.** I would hope this is obvious. It's also worth noting that I've used my own breath as a poor-mans-high-concentration-CO2-sample numerous times and the Picarro hasn't exploded yet, but do be particularly cautious with high humidity samples.
{{< /alert2 >}}


## Startup and warmup {#startup-and-warmup}

{{< alert2 Warning >}}
Turn the pumps on first and off last. Don't power the analyzer without vacuum.
{{< /alert2 >}}

1.  Confirm the analyzer vacuum hose is connected.
2.  Turn on the analyzer vacuum pump.
3.  Turn on the SSIM vacuum pump, if you're using the SSIM.
4.  Leave the SSIM tube disconnected at the analyzer inlet for now, so the analyzer warms up breathing lab air.
5.  Keep the zero-air outlet closed for now. You open it, and reconnect the tube, only when you're actually about to run a sample — not for the whole warmup.
6.  Turn on the analyzer's rear power switch.
7.  Press the front power button. It should light up green.

You'll get a bootloader, then Windows 7, then an automatic login, then the Picarro services starting on their own. The `CRDS Data Viewer` appears while the instrument warms.

The A0314 manual perscribes roughly 25 minutes to reach temperature setpoint and another 30 minutes for delta values to stop trending, so reserve about an hour from power-on. In practice, from POST to usable data it takes about 35 minutes.

Early on you'll likely see a red `System Alarm` and cavity pressure sitting near atmospheric. Hover over the alarm, and it'll probably say `Pressure unlocked`. This is normal during warmup. The status log should eventually report locked temperatures and pressure, then the `Measuring` state.

Once the cavity and warm-box temperatures are both locked at 45 °C, the data points being displayed should change to showing actual isotopic ratio and concentration values.

If you're using the SSIM, you'll need to double-click the "Read SSIM Pressure" icon on the Windows desktop in order to communicate and receive data from the SSIM. A command prompt window will open, and should find the SSIM on one of the COM ports. If it says "External sensor found on COMx", you can minimize the window or otherwise ignore it. **This window needs to be open if you're using the SSIM.**

With zero air flowing through the connected SSIM, CO<sub>2</sub> and CH<sub>4</sub> should head toward zero. With the analyzer inlet open to the room instead, you should see lab air — commonly 400–500 ppm CO<sub>2</sub>.

{{< alert2 Warning >}}
**Ensure the Windows clock is set correctly.** If not, you're data will be incorrectly timestamped. Additionally, the Picarro services use the clock to manage the internal lasers and cavity heaters. If the clock is changed while the Picarro software is running, it will fall out of temperature and will stop producing data. Account for daylight savings accordingly.
{{< /alert2 >}}


## Reading the Data Viewer {#reading-the-data-viewer}

`CRDS Data Viewer` is the live dashboard: alarms, numerical readouts, a status log, and four scrolling plots. The `Data Key` dropdowns near the bottom of the window pick what each plot picks shows.

Plots scroll and rescale on their own, which is the continuous-record idea showing up on screen: they keep going regardless of what the Coordinator is doing. `Reset Buffers` clears the visible graph history and does not erase your logged data. Drag a box over a graph to zoom into that interval; double-click to go back to auto-scaling. Note that the graphs occasionally get accidentally zoomed in, and will appear to be frozen. Double-clicking to go back to auto-scaling typically fixes this.

I typically have the following streams on screen, in order:

-   `Delta_Raw_iCO2`
-   `12CO2`
-   `13CO2`
-   `SSIMPressure`

Picarro uses the `i` in `iCO2` and `iCH4` to mark its isotopic-analysis outputs.

Note all the rolling averages available for isotopic-analysis outputs. Raw delta scatters far enough during a measurement to be annoying, but the rolling averages are indifferent to the actual measurement period during an SSIM run, and the SSIM Coordinator averages the delta value _correctly_ after each run, so the raw delta value is typically the most useful thing to have up.

{{< alert2 Note >}}
**Ignore delta during purge.** Anytime the analyzer is receiving zero air (which is really anytime the SSIM isn't actually taking a measurement, provided that zero air is connected),  the delta value flails around wildly because there is essentially no carbon in the cavity and it's computing a ratio out of nearly nothing. This is normal and means nothing.
{{< /alert2 >}}

If a field you need isn't in the dropdown, go to `Settings > Change GUI Mode > Service` and use the password `picarro`. Occasionally `SSIMPressure` won't show up unless you do this. Service mode exposes a lot of internal variables, and most of them diagnostic rather than analytical.

Also ensure that the `Read SSIM Pressure` window is open and that it shows "External Sensor found at COMx" if you are attempting to read data from the SSIM. If it's unable to find the sensor, you'll likely need to [install the Arduino drivers](#installing-the-arduino-drivers).


## Three programs and the sampling cycle {#three-programs-and-the-sampling-cycle}

-   The CRDS Data Viewer displays and logs the continuous analyzer measurements.
-   The Read SSIM Pressure window publishes the `SSIMPressure` data from the SSIM2's sensor over USB.
-   The SSIM Coordinator is used to run samples through the SSIM and test the system.

{{< alert2 Warning >}}
**Close the `Read SSIM Pressure` window to run a leak test.** `SSIM Leak Test` opens the Arduino serial port directly, so `Read SSIM Pressure` must be **closed** before you start it. Running both creates a COM-port conflict, and the old leak-test script doesn't report serial exceptions, so instead of an error it'll just brick the system. Fun!
{{< /alert2 >}}


### What happens during a run {#what-happens-during-a-run}

Every ordinary run follows the same physical cycle: purge the chamber with zero air, evacuate it with the SSIM pump, admit the sample and isolate it, connect the chamber to the analyzer, wait for the trace to settle, and average over the measurement interval.

During loading, the analyzer is still sitting on zero air while your sample fills the SSIM chamber. During transfer, the analyzer draws that stored gas through the SSIM outlet and its own inlet.

Each of those stages corresponds to a `ValveMask` value in the logs. You generally don't need to know them for routine work but they are useful for figuring out what exactly the SSIM is doing in there. See the [the valve mask appendix](#appendix-valve-masks), which has a decoder you can type a mask into.


## Configuring a measurement {#configuring-a-measurement}

Configuration happens in two layers. `Picarro Mode Switcher` configures the **analyzer** — which absorption features it scans. `SSIM Coordinator` configures the **sample** — how it's loaded, repeated, diluted, and summarized. You'll likely not need to adjust the analyzer mode frequently. This section describes how to configure a measurement; details on running measurements are provided in [your first measurement](#your-first-measurement).


### Selecting the analyzer mode {#selecting-the-analyzer-mode}

Double click on the "Picarro mode switcher" icon on the Windows desktop. Use the dropdown menu to select one of the following:

| Mode                          | Purpose                                                                                                 |
|-------------------------------|---------------------------------------------------------------------------------------------------------|
| `1: iCO2-iCH4 HP`             | Isotopic CO<sub>2</sub> with high-precision isotopic CH<sub>4</sub>, roughly 1.8–12 ppm CH<sub>4</sub>. |
| `2: iCO2-iCH4 HR`             | Isotopic CO<sub>2</sub> with high-range isotopic CH<sub>4</sub>, roughly 10–1,000 ppm CH<sub>4</sub>.   |
| `3: iCO2-iCH4 Auto Switching` | Both, with CH<sub>4</sub> switching HP→HR near 16 ppm and back near 14 ppm.                             |
| `4: iCH4-HP`                  | High-precision isotopic CH<sub>4</sub>, no isotopic CO<sub>2</sub>.                                     |
| `5: iCH4-HR`                  | High-range isotopic CH<sub>4</sub>, no isotopic CO<sub>2</sub>.                                         |
| `6: iCH4-Auto Switching`      | Isotopic CH<sub>4</sub> with automatic HP/HR switching.                                                 |
| `7: iCO2`                     | Isotopic CO<sub>2</sub> only, documented 380–2,000 ppm range.                                           |

HP (High Precision) uses a stronger methane absorption feature, which resolves low concentrations better. HR (High Range) uses a weaker feature that's still readable when there's a lot of methane. `Auto Switching` is the answer when you don't know what you're about to measure, or when the concentration might cross the overlap — note that mode 3 hands over at around 16 ppm, above mode 1's stated 12 ppm ceiling, so the switching thresholds and the mode ranges are not the same numbers. Mode 7 is the fastest and lowest-noise option if you only care about isotopic CO<sub>2</sub>.

You probably just want to use auto switching. After a mode change, wait for normal temperatures, pressure, and `Measuring` status again before doing anything.

{{< alert2 Note >}}
**The SSIM does not extend the analyzer's ranges.** A 2,500 ppm methane standard is outside the documented undiluted HR range of 1,000 ppm, and no amount of SSIM will change that. You need a validated dilution — see [the dilution appendix](#appendix-ssim-zero-air-dilution).
{{< /alert2 >}}


### Coordinator parameters {#coordinator-parameters}

Launch `SSIM Coordinator`, select `SSIM G2201-i`, and work through the reference-gas and parameter dialogs. The parameter window has 9 questions in it, each to be answered with a numerical value.

**1. Multi-port valve.** Whether a 16-port manifold is installed downstream. `1` says yes, `2` says no. Unless somebody has bolted a manifold onto Luke since I wrote this, it's `2`.

**2. Number of sample ports.** How many inlets the Coordinator should cycle through. With no manifold there is exactly one, the front `SAMPLE` port, so this is `1`. This only becomes interesting with the manifold, where it's how you tell the Coordinator how many of the sixteen positions are actually loaded.

**3. Repeats per sample.** How many separate measurements to take from each sample source. Every repeat consumes another aliquot, so `2` means you need roughly twice the gas. On Luke's build, `0` gives you a single measurement.

{{< alert2 Note >}}
**aliquot** (n.)
_ˈæl.ɪ.kwɒt_ (AL-ih-kwot)

1.  _Chemistry, Biology, Analytical Science._ A measured, representative portion of a total sample, taken with the intention of being analyzed, tested, or used separately, such that the properties of the portion reflect those of the whole (e.g., a 25 mL aliquot withdrawn from a 250 mL stock solution).
{{< /alert2 >}}

**4. Repeats of standard.** The same thing for the front `CAL` port. `0` means don't touch the CAL port at all this run. Anything higher schedules calibration injections, which is only useful if a certified cylinder is actually connected and open, which I'd bet $20 it's not.

**5. Standard mode.** Where in the sequence the standard injections land — `1` at the beginning only, `2` at the beginning and end. This is ignored entirely when parameter 4 is `0`, so you can leave it wherever it sits, but `2` is the sensible habit for when you do start running standards: bracketing a sequence tells you whether anything drifted while you were running it.

**6. Measurement mode.** `1` is `One Time`, which runs the requested sequence and stops. `2` is `Continuous Loop`, which returns to the configured samples and repeats until you close the Coordinator. Continuous mode does not refill anything, so it will keep dutifully measuring a syringe that emptied three cycles ago.

**7. Measurement speed.** `1` is `Standard`, roughly twelve minutes, using the longer averaging interval. `2` is `Fast`, roughly eight minutes. Fast is fine for most work.

**8. Sample loading.** How the Coordinator opens the sample path and, more importantly, where it pauses for you. `1` is `Manual`, `2` is `Automatic`, `3` is `Syringe`. See [sample source and loading mode](#sample-source-and-loading-mode) below.

**9. Sample dilution.** `1` is no deliberate dilution. Anything else inserts a brief zero-air admission after sample loading, which you only want if your sample is too concentrated for the analyzer's range. See [the dilution appendix](#appendix-ssim-zero-air-dilution).


### A reasonable starting point {#a-reasonable-starting-point}

For one fast, undiluted syringe measurement — no manifold, no calibration standard — Luke's current build wants:

```text
2 1 0 0 2 1 2 3 1
```

The reference-gas dialog shows up even on a sample-only run. Its entries describe gases stored in the Coordinator configuration for the front `CAL` port. When `Repeats of standard` is zero, leave the existing entry selected and click `OK`.


### Sample source and loading mode {#sample-source-and-loading-mode}

The loading setting decides how the Coordinator opens the sample path and **where it pauses for you**.

-   **`Manual` (1)** is for bags and vessels that equilibrate easily with the SSIM volume. You open the external valve when prompted and the vessel supplies the gas.
-   **`Automatic` (2)** is principally for the 16-port manifold and repeated automated sampling, and it skips some purge and evacuation steps between samples. Unless you are using the 16-port manifold, don't use this.
-   **`Syringe` (3)** is for an isolated syringe on the front `SAMPLE` port. It adds a pause during the injection state so you can push the plunger after the SSIM opens the sample path.

A gas bag or other collapsible vessel normally uses `Manual` and needs its own shutoff valve. You can also hook up a tank or standard and feed the front `SAMPLE` port through a suitable low-pressure regulator to test the complete sample path.


## Checking that it works {#checking-that-it-works}

Before you feed this thing a sample from Antartica I would run up the following ladder to ensure everything is working properly.

1.  **Dry zero air, directly into the analyzer.** CO<sub>2</sub>, CH<sub>4</sub>, and H<sub>2</sub>O should all head toward their expected low values.
2.  **A known-concentration gas, directly into the analyzer.** Does it read approximately what the certificate says?
3.  **Zero air through the SSIM**, on its ordinary path.
4.  **The known gas through the front `SAMPLE` port**: same container, same adapter, same loading mode, same Coordinator settings you plan to use for real samples.
5.  **A few expendable samples** to condition and clear the whole flow path.
6.  **The working standard, two or three times.** Look at the trace, the mean, the standard deviation, and the drift.


## Your first measurement {#your-first-measurement}

This walkthrough teaches the sequence with an expendable syringe of lab air. It assumes you've already checked the physical connections and that someone experienced has commissioned Luke.

{{< alert2 Warning >}}
The Coordinator pauses more than once, and only one of those pauses wants your stopcock open: the one that explicitly asks for the sample valve to be opened. Open it at an earlier pause and the SSIM pumps your sample into the vacuum line during purge and then promptly exhausts it into the room.
{{< /alert2 >}}

1.  Start with Luke off, and with the analyzer inlet open to lab air — SSIM tube off at the inlet, zero-air outlet closed. Confirm the analyzer vacuum hose is connected, then start the Picarro Analyzer pump and the SSIM pump. Turn on Luke's rear switch and press the front power button.
2.  Watch the monitor through bootloader → Windows 7 → automatic login → Picarro software.
3.  Wait until the analyzer is warmed up. Early cavity pressure near atmospheric and a red `Pressure unlocked` alarm are normal. Continue only when both temperatures lock at 45 °C and the Data Viewer is actually Viewing Data.
4.  Open `Read SSIM Pressure`. It should find the external sensor, often on `COM8`, and stay open. Minimize it to get it out of the way.
5.  In Data Viewer, put up `SSIMPressure`, `12CO2`, your delta field, and `SSIMPressure`. If `SSIMPressure` isn't available, switch Data Viewer to Service mode.
6.  Now that Luke is warm, bring the SSIM into the path: reseat the stainless-steel tube at the analyzer inlet and open the zero-air outlet valve at 2–3 psig. `12CO2` should fall from lab air toward zero as zero air flushes the line — that's your confirmation the connection is good and gas is flowing. Then fill a Luer-lock syringe with lab air and close its stopcock, and keep the unused `CAL` port on the SSIM capped.
7.  Open `SSIM Coordinator`, select `SSIM G2201-i`, hit `Launch`, and then enter `2 1 0 0 2 1 2 3 1`. Leave the existing reference-gas entry selected, and hit `OK`.
8.  Follow the prompts on the SSIM Coordinator window, using the menu bar to select `Control > Resume` as needed.
9.  Watch purge and evacuation. `SSIMPressure` should alternate between near-atmospheric during zero-air purge and about 20 Torr during evacuation.
10. Confirm `SSIMPressure` rises when the sample enters the chamber.
11. During transfer, pressure should fall while CO<sub>2</sub> climbs from zero toward lab air — commonly settling around 400–500 ppm, depending on the room and how many people are in it.
12. Let the highlighted measurement interval finish. Concentration and delta should approach a plateau.
13. When the SSIM Coordinator is done Coordinating the SSIM, the measurement period line should turn red in the Data Viewer window.

To abort a run, close the Coordinator with the red X and give it up to a minute to put the valves and analyzer back into a safe state. The window will likely say not responding; let it keep trying for while. If you hear the SSIM clicking somewhat alarmingly, feel free to disconnect the `VALVES` cable to avoid it hurting itself.


### What a good trace looks like {#what-a-good-trace-looks-like}

**During purge and evacuation (masks `8` and `5`):** target gases approach zero, and delta becomes extremely noisy because there's nearly nothing to compute a ratio from. `SSIMPressure` alternates between vacuum and near-ambient. A healthy SSIM pump gets the chamber down to about or below 20 Torr, reliably.

**During sample loading (mask `6`):** `SSIMPressure` rises, then stays flat while the Coordinator is paused after injection.

**During transfer (mask `4`):** pressure drops and then flattens as flow slows and the analyzer's outlet valve closes to hold gas in the cavity. Concentration rises and gradually approaches a plateau.

Two effects from the A0314 manual get confused with each other:

-   Residual zero air between the SSIM chamber and analyzer cavity can dilute a single injection by roughly 5 percent.
-   The concentration trace may drift by 5–10 percent across the highlighted interval as it approaches its plateau.

Also note that generally, the reported concentration value can be off by up to 20%. The isotopic ratio data should be more accurate.


## Where data are saved {#where-data-are-saved}

| File                       | Typical location                             | Contents                                                                                                        |
|----------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| SSIM Coordinator CSV       | `C:\Picarro\IsotopicData`, `C:\IsotopicData` | One summarized row per completed injection: time, sample position, means, standard deviations, standard fields. |
| SSIM Coordinator TXT log   | Same SSIM output directory                   | Coordinator states, prompts, valve masks, timing, warnings, termination.                                        |
| Continuous user data       | `C:\UserData\DataLog_User\YYYY\MM\DD`        | Time-resolved analyzer data: temperatures, pressure, gas measurements, alarms, configured SSIM fields.          |
| Internal logs and archives | `C:\Picarro\G2000\Log\` and subdirectories   | Detailed host, service, event, and diagnostic records.                                                          |

The Coordinator creates its CSV and TXT log when a run begins and writes results as it goes. The filename normally contains the analyzer serial number, `SSIM`, and the launch timestamp. If you're unsure which of the three candidate directories you're writing to, the Coordinator's filename field shows the active output path.

The analyzer has Notepad++ installed, along with some other basic tools. The USB port on the front of the analyzer is awfully useful for connecting a thumbdrive to and transferring data with.

{{< alert2 Note >}}
You also could hook the analyzer up to the internet through the ethernet port on the back and transfer files that way. See [the appendix on networking Luke](#appendix-notes-on-connecting-an-increasingly-out-of-date-operating-system-to-the-world-wide-web) before you do.
{{< /alert2 >}}


## Shutting down {#shutting-down}

Again, although the Picarro manuals will insist upon flowing a "clean, relatively dry gas through the analzyer for several minutes" ("relatively"? "several"?), you don't really need to do this. Once the analyzer has injested ambient air for more than 30 seconds it's safe to be shutdown.

1.  Close the SSIM Coordinator (if open) with the red X and give it up to a minute to terminate safely.
2.  In Data Viewer, click `Shutdown` and select "Shut down in current state"
3.  Wait for the analyzer software and computer to turn off, and for the front light and fans to stop.
4.  Close the zero-air outlet and the cylinder valve.
5.  Turn off the SSIM pump and analyzer pump.


## Diagnostics and leak testing {#diagnostics-and-leak-testing}

`SSIM Leak Test` tests all of the internal SSIM valves for leaks.

1.  Connect USB, valve cable, zero air, SSIM vacuum, and the normal SSIM-to-analyzer tube.
2.  Cap the front `SAMPLE` and `CAL` ports with proper metal caps.
3.  Close `Read SSIM Pressure` so the leak test gets exclusive access to the Arduino COM port.
4.  Launch `SSIM Coordinator` and select `SSIM Leak Test` from the dropdown menu.
5.  Follow the instructions provided, using the menu bar to select `Control > Resume` as needed.
6.  Reopen `Read SSIM Pressure`.

Luke's last full test, on July 24, 2026, connected on `COM8` and passed every internal valve state tested. Measured pressure slopes were 0.0016 Torr/s for the initial V1/V3 state, 0.0012 Torr/s for V5, −0.0002 Torr/s for V4, and 0.0007 Torr/s for V2 — all comfortably below the Coordinator's 0.04 Torr/s failure threshold.

{{< alert2 Note >}}
**Passing the leak test does not mean the system is leak-free.** The test covers internal valve states. There could still be leaks in the line between the SSIM outlet and the analyzer inlet, inside of the analyzer itself, or your "known" gas could turn out to be not-so-known after all.
{{< /alert2 >}}


## Troubleshooting by symptom {#troubleshooting-by-symptom}


### The analyzer doesn't boot {#the-analyzer-doesn-t-boot}

-   Check if the analyzer is connected to power. Try a different UPS cable.
-   Check if the rear power switch is flipped on.
-   Check the internal CMOS CR2032 button battery. Replace it if more than 5 years in the future from 2026. If you are reading this more than 5 years from 2026, [please email me](mailto:picarrotimecapsule@mor-gan.com) and say hi.
-   Reseat the RAM. Flip the chassis over, open the bottom (now top), and pop the RAM sticks out. Blow on each of them, and then push them back into place one side at a time. This was the cause of Luke not turning on.
-   Visit a place of worship of your choosing and pray.


### The analyzer is warm but pressure stays unlocked {#the-analyzer-is-warm-but-pressure-stays-unlocked}

Check the analyzer pump, the vacuum hose, and the status log. Unlocked pressure is expected early in warmup, and it may take several minutes (especially after a hiatus) for the analyzer to start attempting to control pressure.


### The warm box or cavity falls below setpoint and the instrument enters safe mode {#the-warm-box-or-cavity-falls-below-setpoint-and-the-instrument-enters-safe-mode}

Daylight savings flipped over or the clock was changed. Check the clock. Reboot the analyzer (rebooting from the Windows start menu is fine).


### SSIM: `Read SSIM Pressure` can't find the sensor, or closes immediately {#ssim-read-ssim-pressure-can-t-find-the-sensor-or-closes-immediately}

The helper opens a command window, searches the COM ports, and should report something like `External Sensor found at COM8`. If it closes on its own, or scrolls past without finding anything, Windows isn't talking to the SSIM2's internal Arduino.

Work through it in this order:

1.  **Check the physical link first.** The SSIM2 is USB-powered, so a dead cable looks identical to a dead board. Confirm the USB-B end is seated at the SSIM2 and the USB-A end is in the back of Luke, and that the green light on the SSIM2 front is lit with the analyzer powered on.
2.  **Check whether Windows sees anything at all.** Open Device Manager (`Win + R`, type `devmgmt.msc` and smash Enter). Expand `Ports (COM & LPT)`. If the SSIM2 is working, there's a COM port there that disappears when you unplug the USB cable.
3.  **If nothing appears under Ports,** look under `Other devices` for an entry with a yellow warning triangle, often named something like `Unknown device` or `USB Serial`. That's the Arduino with no driver bound to it.


#### Installing the Arduino drivers {#installing-the-arduino-drivers}

Windows 7 does not ship with a driver for the USB-serial chip on an Arduino board, and it will not find one on its own.

Which driver you need depends on which chip is on the board, so find that out before downloading anything:

1.  In Device Manager, right-click the unknown device and choose `Properties > Details`.
2.  In the dropdown, select `Hardware Ids`.
3.  Read the `VID` (vendor ID) out of the string. `VID_2341` is Arduino's own ID, which means an ATmega16U2-style USB interface and the driver that ships with the Arduino IDE. `VID_0403` is FTDI. `VID_1A86` is WCH's CH340. `VID_067B` is Prolific.

Then install accordingly:

-   **Arduino (`VID_2341`):** download the Arduino IDE, and point Windows at the `drivers` folder inside the install directory. Right-click the unknown device, `Update Driver Software > Browse my computer`, select that folder, and let it install the unsigned driver.
-   **FTDI (`VID_0403`):** use FTDI's VCP (Virtual COM Port) driver. These are the well-behaved ones and usually install without argument.
-   **CH340 (`VID_1A86`):** you need the CH341SER driver. Common on clone boards.
-   **Prolific (`VID_067B`):** be careful. Prolific's newer drivers deliberately refuse to work with counterfeit chips, and the failure mode is a device that enumerates and then reports a code 10 error. If you hit that, an older Prolific driver is the usual fix.

{{< alert2 Caution >}}
**When I say "download"** don't actually do that. The most prudent thing to do here is to sneakernet the files onto the analyzer with a USB stick or similar. See [the appendix on networking Luke](#appendix-notes-on-connecting-an-increasingly-out-of-date-operating-system-to-the-world-wide-web) for some notes on this dilemma.
{{< /alert2 >}}

Once the driver binds, the device moves from `Other devices` into `Ports (COM & LPT)` with a COM number. Close and reopen `Read SSIM Pressure`; it should now find the sensor.

Finally, remember that `Read SSIM Pressure` and `SSIM Leak Test` cannot both hold the port. If the helper works fine but the leak test hangs, that's the [ COM-port conflict below](#ssim-leak-test-sits-at-statereadarduino-forever), not a driver problem.


### Setting the clock {#setting-the-clock}

Every file the instrument writes is stamped with the Windows clock, so make sure it's set correctly.

To set it: click the clock in the system tray, choose `Change date and time settings...`, then `Change date and time`. You'll need an administrator account. Set the time zone on the same dialog while you're in there.

Two things worth knowing:

-   **Don't rely on internet time synchronization.** The `Internet Time` tab assumes a network connection that Luke shouldn't necessarily have. Set the clock by hand and check it periodically.
-   **If the clock won't hold across a power cycle, the problem is hardware.** A dead CR2032 motherboard battery lets the clock and the BIOS settings reset every time the machine loses power. Replacing the battery is the fix; see [the case study](#case-study). After replacing it, set both the BIOS clock and the Windows clock deliberately, in that order.

If you discover mid-session that the clock was wrong, don't correct it in the middle of a run. Open the Diagnostics folder on the Windows desktop, double click the 'Stop Instrument' icon, and then make your desired horological changes, and then double click the 'Start Instrument' icon.


### Timestamps jump, or the logs make no chronological sense {#timestamps-jump-or-the-logs-make-no-chronological-sense}

Check the clock. Replace the CMOS battery if Windows can't keep track of time correctly.


### `SSIM Leak Test` sits at `StateReadArduino` forever {#ssim-leak-test-sits-at-statereadarduino-forever}

Close `Read SSIM Pressure` and launch the test again.


### The SSIM won't evacuate to about 20 Torr {#the-ssim-won-t-evacuate-to-about-20-torr}

Confirm the SSIM pump is on, its voltage selector is correct, and both vacuum-hose connections are tight. Perhaps, dear reader, the pump has finally decided to kick it and you'll need to either monkey around inside of it with some oil and new gaskets or replace it entirely. If it's past 15,000 hours this answer becomes increasingly likely to be correct.


### The syringe empties before the injection prompt {#the-syringe-empties-before-the-injection-prompt}

The syringe valve was open too early, or there was no isolation valve installed. Keep the sample closed until the Coordinator explicitly asks for the sample valve to be opened.


### The syringe plunger springs back {#the-syringe-plunger-springs-back}

The needle may be blocked by cored septum material: inspect it and switch to a side-port needle. A plunger pushed outward by the system during a run is a different fault: it suggests an internal V2 or V5 leak. Run the `SSIM Leak Test`.


### Direct gas works but an SSIM sample reads low or drifts {#direct-gas-works-but-an-ssim-sample-reads-low-or-drifts}

Inspect the sample adapter, SSIM outlet tube, analyzer inlet, and ferrules. Picarro will only tell you what each kind of leak tends to look like, not how to tell them apart for certain:

-   An **external inward leak** often changes both concentration and delta as room air gets in, though the delta response can be small when ambient and sample compositions are similar.
-   A **V1 cross-port leak** tends to drive concentration down with less change in delta, because zero air contains almost no target gas.

{{< alert2 Caution >}}
**Know when to stop troubleshooting.** If direct gas reads correctly, the internal leak test passes, and the same failure follows you across different sample containers and different SSIMs, contact Picarro technical support and tell them that Morgan sent you and sends his regards and that he hopes the family is doing well.
{{< /alert2 >}}


## Case study {#case-study}

Zero air and a 1,500 ppm CO<sub>2</sub> standard both read correctly connected directly to Luke. Through the SSIM sample port, the same standard would climb briefly and then sink back toward lab air. Syringes, a gas bag, direct tank delivery, and three different SSIMs all produced versions of the same failure.

At one point, breathing near the short SSIM-outlet connection during mask `4` drove measured CO<sub>2</sub> toward 2,000 ppm, which revealed that the below-ambient line could pull room air in at the fitting. In a fit of naïveté, I concluded that the length of stainless-steel tubing must be the root cause and immediately spend hundreds of largely taxpayer dollars at Swagelok Kansas City to fabricate a replacement. It didn't really help.

Then I called Picarro support and they fixed it in one remote session. Oops.


## Appendix: Valve masks {#appendix-valve-masks}

The SSIM2 has five internal solenoid valves. Each one is a three-way: a common port, a **normally open** path that gas takes when the valve is at rest, and a **normally closed** path that opens when the analyzer energises it. The analyzer throws them over the beige `VALVES` cable, and reports the combined state as a single number, `ValveMask`.

`ValveMask` is a bitmask. Each valve contributes its own value, and the mask is the sum of whichever ones are energised:

| Valve | Contributes |
|-------|-------------|
| V1    | 1           |
| V2    | 2           |
| V3    | 4           |
| V4    | 8           |
| V5    | 16          |

So mask `5` is 1 + 4, meaning V1 and V3 are energised and the other three are resting. Mask `0` means nothing is energised at all.


### Decoder {#decoder}

Type a mask, or click one of the states from an ordinary run.

{{< valvemask >}}

{{< alert2 Note >}}
Good lord, org mode is cool.
{{< /alert2 >}}


### The ordinary sample sequence {#the-ordinary-sample-sequence}

This is Table 9 from the A0314 manual, which is the single most useful page in it. An ordinary undiluted sample run walks straight down this list:

| Mask | Energised | Time (s)   | What's happening                                                                           |
|------|-----------|------------|--------------------------------------------------------------------------------------------|
| `8`  | V4        | 20         | Vacuum pumps the chamber down through V2 up to V3. _Evacuation._                           |
| `5`  | V1, V3    | 20         | Zero air flows through the chamber to the analyzer. _Purge._                               |
| `8`  | V4        | 20         | Evacuation again.                                                                          |
| `5`  | V1, V3    | 60         | Longer zero-air purge.                                                                     |
| `8`  | V4        | 20+        | Final evacuation.                                                                          |
| `6`  | V2, V3    | 8          | V2 opens so the sample flows into the chamber, while the analyzer holds a vacuum up to V2. |
| `4`  | V3        | 420 or 720 | The analyzer pulls on the sample held in the chamber.                                      |


## Appendix: SSIM zero-air dilution {#appendix-ssim-zero-air-dilution}

Dilution exists for one reason: your sample is too concentrated for the analyzer's range and you would rather dilute it than lose it. Mode `7` tops out at 2,000 ppm CO<sub>2</sub>, and the high-range methane mode tops out around 1,000 ppm, so anything above those has to come down before it can be measured at all.


### How it works {#how-it-works}

After the sample has been loaded into the chamber, the Coordinator briefly applies mask `1` — about three seconds of V1 energised — which admits zero air into whatever chamber volume the sample didn't fill. Then the ordinary transfer state, mask `4`, proceeds as usual.

The nominal factor is the ratio you'd expect from volumes alone. Write \\(V\_c\\) for the chamber volume, \\(V\_s\\) for the sample volume, \\(C\_0\\) for the sample's original concentration, and \\(C\_d\\) for what the analyzer ends up seeing:

\\[D = \frac{V\_c}{V\_s}\\]

\\[C\_d = \frac{C\_0}{D} = C\_0 \times \frac{V\_s}{V\_c}\\]

With the 20 mL chamber, a 5 mL sample gives a nominal \\(D = 20/5 = 4\\). The manual's worked example runs that backwards to find the floor: to keep \\(C\_d\\) above the G2201-i's 380 ppm lower limit at \\(D = 4\\), the sample has to start above

\\[C\_0 = D \times C\_d = 4 \times 380\ \mathrm{ppm} = 1{,}520\ \mathrm{ppm}\\]

For genuinely pure CO<sub>2</sub>, the manual suggests a calibrated 10 µL syringe, which tells you how quickly this stops being practical.


#### Practical notes {#practical-notes}

-   **Use a small syringe holding only the aliquot you intend.** A larger syringe left open lets the chamber vacuum pull in more sample than you meant to give it, which changes the ratio in a direction you can't see.
-   **Dilution can't be combined with automatic sample repeats** in the standard Coordinator. If you need replicates of a diluted sample, you're running them one at a time.
-   **Consider diluting outside the instrument instead.** Preparing a larger, validated dilution in a gas bag is usually more practical when replicates are required, and it has the significant advantage that you can measure the diluted gas as an ordinary sample with no special Coordinator settings.
-   **Dilution is a concentration operation, not an isotope one.** Provided the zero air is actually carbon-free, the manual expects the isotope ratio to shift less than the concentration does.


## Appendix: Deriving ¹³CO₂ yourself {#appendix-deriving-co-yourself}

Here you go:

\\[\delta^{13}\mathrm{C} = \left( \frac{R\_{\mathrm{sample}}}{R\_{\mathrm{VPDB}}} - 1 \right) \times 1000\\]

where \\(R = {}^{13}\mathrm{C}/{}^{12}\mathrm{C}\\), and the VPDB reference ratio is \\(R\_{\mathrm{VPDB}} = 0.0111802\\).

Rearranging for the sample's own ratio:

\\[R\_{\mathrm{sample}} = R\_{\mathrm{VPDB}} \left( \frac{\delta^{13}\mathrm{C}}{1000} + 1 \right)\\]

Writing \\(C\_{12}\\) for the calibrated `12CO2_dry` reading in ppm, the ¹³CO₂ concentration is just that ratio applied to it, and total CO<sub>2</sub> is the sum:

\\[C\_{13} = C\_{12} \times R\_{\mathrm{sample}}\\]

\\[C\_{\mathrm{total}} = C\_{12} + C\_{13} = C\_{12} \left( 1 + R\_{\mathrm{VPDB}} \left( \frac{\delta^{13}\mathrm{C}}{1000} + 1 \right) \right)\\]

**For example,** take a reading of `12CO2_dry` = 400.0 ppm with δ<sup>13</sup>C = −8.0‰:

\\[R\_{\mathrm{sample}} = 0.0111802 \times \left( \frac{-8.0}{1000} + 1 \right) = 0.0111802 \times 0.992 = 0.0110908\\]

\\[C\_{13} = 400.0 \times 0.0110908 = 4.436\ \mathrm{ppm}\\]

\\[C\_{\mathrm{total}} = 400.0 + 4.436 = 404.4\ \mathrm{ppm}\\]

Notice that ¹³CO₂ is only about 1.1 percent of the total, so total CO<sub>2</sub> is always going to land close to `12CO2` — which is exactly why adding the two displayed fields looks fine right up until you need the number to be defensible.

Also notice that the δ<sup>13</sup>C term barely moves the total: swinging delta from −8‰ to −30‰ changes \\(C\_{\mathrm{total}}\\) by about 0.1 ppm at these concentrations. The isotope value matters enormously as a measurement in its own right, and hardly at all as a correction to total CO<sub>2</sub>.

Use `12CO2_dry` rather than `12CO2` if there's any water vapor in the sample, or the dilution by water will propagate straight through this arithmetic.


## Appendix: Notes on connecting an increasingly out of date operating system to the world wide web {#appendix-notes-on-connecting-an-increasingly-out-of-date-operating-system-to-the-world-wide-web}

Luke runs Windows 7, if you haven't noticed already. Microsoft stopped shipping security updates for it in January 2020, and the extended-support program that carried a few enterprises past that ended in 2023. Nothing about the machine has been patched since.

If possible, use the USB port on the front and a thumb drive. You also could use a patch cable to connect the analyzer to your laptop (or whatever) and `ftp` stuff across the LAN or `croc` or whatever the kids are using these days. You could _also_ do the above and then use remote desktop which I did for quite some time and moderately enjoyed.

Under ideal circumstances I would get on a IT-sponsored soapbox about how you really should don PPE and visit your IT department and prod them to setup a VLAN or a lab-only subnet or something similar but honestly: I tried to do that, correctly, and it took **literal** months of tickets being created and other bureaucratic garbage and it never ended up working.

Do not, under any circumstance, interact with your IT department about _any_ of the above or ask for their help in **any** way! Lesson learned. For the 50,000th time.

If you do end up connecting it to the WAN, the typical sanguine advice about Surfing the Net applies. Use Chrome, it's more up to date on Windows 7 than Firefox, and use your best judgment.


## Manuals and further reading {#manuals-and-further-reading}

Each official link below has a fixed copy on this site's CDN, retrieved or copied from my archive on August 5, 2026. Here's a  [SHA-256 manifest](https://cdn.mor-gan.com/picarro/manuals/SHA256SUMS.txt).

| Document                                                       | Official source                                                                                                                                         | Preserved copy                                                                                                         |
|----------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| A0314 SSIM2 User Manual, P/N 40037 Rev. I                      | [Picarro](https://www.picarro.com/sites/default/files/manuals/A0314-UserManual-40037-Rev_I.pdf)                                                         | [CDN mirror](https://cdn.mor-gan.com/picarro/manuals/A0314-SSIM2-User-Manual-40037-Rev-I.pdf)                          |
| G2201-i User Manual, P/N 40028 Rev. C                          | [Picarro](https://www.picarro.com/sites/default/files/manuals/Picarro_G2201-i-UserManual-40028-Rev_C.pdf)                                               | [CDN mirror](https://cdn.mor-gan.com/picarro/manuals/Picarro-G2201i-User-Manual-40028-Rev-C.pdf)                       |
| G2201-i/G2508 with A0314 site-preparation guide                | [Picarro](https://www.picarro.com/sites/default/files/product_documents/G2201-i%20-%20G2508%20Analyzer_site%20preparation%20guide_092325%20%281%29.pdf) | [CDN mirror](https://cdn.mor-gan.com/picarro/manuals/Picarro-G2201i-G2508-A0314-Site-Preparation-Guide-2025-09-23.pdf) |
| Calibration Guide for Picarro Analyzers, Rev. 1                | [Picarro](https://www.picarro.com/sites/default/files/product_documents/Calibration-Guide-Picarro-analyzers-Rev1.pdf)                                   | [CDN mirror](https://cdn.mor-gan.com/picarro/manuals/Calibration-Guide-Picarro-analyzers-Rev1.pdf)                     |
| AN038, Measuring Small Volume Gas Concentrations with the SSIM | [Picarro application-note page](https://www.picarro.com/analytical/an038_measuring_small_volume_gasconcentrations_with_the_ssim)                        | [CDN mirror (PDF)](https://cdn.mor-gan.com/picarro/manuals/Picarro-AN038-SSIM-Small-Volume-Gas-2018-05-08.pdf)         |
| Legacy A0312 SSIM manual, January 22, 2013                     | No current official link located                                                                                                                        | [CDN mirror](https://cdn.mor-gan.com/picarro/manuals/Picarro-A0312-SSIM-Manual-2013-01-22.pdf)                         |
| Billings Lab G2101-i operating notes, June 5, 2012             | Lab-authored document                                                                                                                                   | [CDN mirror (DOC)](https://cdn.mor-gan.com/picarro/manuals/Billings-Lab-G2101i-Operating-Notes-2012-06-05.doc)         |

---

_Created in Doom Emacs with Org Mode._

_Written from March to August 2026. Content completed in Mast Coffee in Toronto, Ontario. Copy completed in Higuchi Hall._

_Thanks to: Bernie, Meriel, Natasha, Aneri, and Fred._
