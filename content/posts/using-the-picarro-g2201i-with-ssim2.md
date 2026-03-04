+++
title = "Using the Picarro G2201-i with SSIM2 module"
date = 2026-03-04T12:00:00-06:00
draft = false
+++

{{< alert2 Warning >}}
**This instrument is expensive.** The Picarro G2201-i analyzer costs approximately $100,000. The SSIM2 module adds another $15,000-20,000. Handle with care, follow all procedures precisely, and never force connections or ignore error messages.
{{< /alert2 >}}

{{< alert2 Caution >}}
**Leaks will ruin your data.** All gas connections must be leak-free. A tiny leak can contaminate samples with ambient air, rendering isotopic measurements meaningless. Always use proper Swagelok fittings and check connections carefully.
{{< /alert2 >}}

{{< alert2 Warning >}}
**The vacuum pump must ALWAYS be running when the analyzer is powered on.** The Picarro's internal cavity operates at reduced pressure. If the vacuum pump is off while the analyzer is on, pressure will build up inside the cavity, potentially damaging sensitive optical components. This is not optional—treat the vacuum pump as part of the analyzer's power system.
{{< /alert2 >}}


## Introduction {#introduction}

The Picarro G2201-i is a high-precision isotopic analyzer that measures both CO₂ and CH₄ concentrations along with their stable carbon isotope ratios (δ¹³C-CO₂ and δ¹³C-CH₄). The instrument uses Cavity Ring-Down Spectroscopy (CRDS), a laser-based technique that provides part-per-billion sensitivity and exceptional isotopic precision.

The Small Sample Isotope Module (SSIM2, Model A0312) is an accessory that enables analysis of discrete gas samples as small as ~20 ml. Without the SSIM, the Picarro operates in continuous-flow mode requiring sample volumes exceeding 100 ml. With the SSIM, you can analyze gas from sample bags, vials, soil chamber headspace, or any small container—making it ideal for field sampling where large volumes aren't practical.

This guide covers the complete workflow: hardware setup, gas connections, software operation, taking measurements, data handling, and troubleshooting.


## Before You Begin: Analyzer Boot Issues {#before-you-begin-analyzer-boot-issues}

If you're setting up a Picarro that's been in storage or transported, you may encounter a bootloop where the analyzer repeatedly restarts without fully initializing. This happened with our G2201-i and was resolved by reseating the internal RAM modules.

**Symptoms of RAM-related bootloop:**

-   Analyzer powers on, fans spin up
-   LCD display shows initialization messages
-   System restarts after 30-60 seconds
-   Cycle repeats indefinitely, never reaching the main GUI

**Solution:**

{{< alert2 Warning >}}
**Opening the analyzer enclosure voids warranties and exposes you to electrical hazards and laser radiation.** Only perform this procedure if you're comfortable working with electronics and have appropriate training. If your analyzer is under warranty, contact Picarro support instead.
{{< /alert2 >}}

1.  **Power off** the analyzer completely and unplug from mains power
2.  **Wait 5 minutes** for capacitors to discharge
3.  **Remove the analyzer cover** (typically 6-8 screws on the rear and side panels)
4.  **Locate the RAM modules** on the motherboard (usually near the CPU, two DIMM slots)
5.  **Remove both RAM sticks** by pressing the retention clips outward
6.  **Clean the RAM slots** by gently blowing out any dust or debris with your breath or compressed air
7.  **Clean the RAM stick contacts** with a lint-free cloth (isopropyl alcohol optional but not necessary)
8.  **Reseat the RAM firmly** into their slots until the retention clips click into place
9.  **Reassemble the cover** and restore power
10. **Power on** and verify the analyzer boots normally

In our case, the issue was resolved immediately after reseating the RAM and clearing dust from the sockets. The analyzer likely accumulated dust during transport or storage, causing intermittent electrical contact.

{{< alert2 Note >}}
If reseating the RAM doesn't fix the bootloop, the issue may be with the power supply, motherboard, or other components. Contact Picarro support for assistance.
{{< /alert2 >}}


## What the System Measures {#what-the-system-measures}

The G2201-i reports the following for each sample:

-   **CO₂ concentration** (ppm or µmol mol⁻¹)
-   **δ¹³C-CO₂** (‰ vs. VPDB standard)
-   **CH₄ concentration** (ppm or µmol mol⁻¹)
-   **δ¹³C-CH₄** (‰ vs. VPDB standard)
-   **H₂O concentration** (ppm)

**What is δ¹³C?**

Delta notation (δ¹³C) expresses the ratio of ¹³C to ¹²C in your sample relative to a reference standard (Vienna Pee Dee Belemnite, or VPDB). The value is reported in per mil (‰, parts per thousand). A more positive δ¹³C means your sample is enriched in the heavier isotope ¹³C relative to the standard; more negative means depleted.

For example: atmospheric CO₂ has a δ¹³C around −8‰, while soil-respired CO₂ from C3 plants is typically −25‰ to −30‰. This isotopic difference allows you to distinguish CO₂ sources.


## Pre-Installation Requirements {#pre-installation-requirements}

Before setting up the SSIM2, ensure you have:

1.  **Picarro G2201-i analyzer** fully operational and calibrated. The analyzer must be powered on and stabilized for at least 2 hours before making measurements.

2.  **External vacuum pump** with power cable. The SSIM uses an external vacuum pump to evacuate the sample chamber and gas lines between measurements.

3.  **Pressurized "zero air" cylinder** with regulator set to ≥1 psi (0.07 bar) and &lt;8 psi (~0.5 bar). Typical operating pressure is 3 psi. Zero air should contain &lt;1 ppm CO₂, &lt;5 ppb CH₄, and &lt;10 ppm H₂O. This is used to flush the system between samples.

4.  **Pressurized calibration gas cylinder** with known δ¹³C values and CO₂/CH₄ concentrations, with regulator set to same pressure as zero air (typically 3 psi). You'll measure this repeatedly to calibrate your samples.

5.  **Sample containers** with manual valves. These can be Tedlar bags, glass flasks, or any container that can be attached via 1/8" Swagelok fittings and has a manual valve to isolate it during purging.

{{< alert2 Note >}}
**Manual valves on sample containers are mandatory.** During the SSIM's purge cycle, the external vacuum pump evacuates the system. If your sample container doesn't have a valve to isolate it, the vacuum will suck out your sample and you'll lose it.
{{< /alert2 >}}

1.  **1/8" stainless steel tubing and Swagelok fittings** (various lengths). All gas connections use 1/8" Swagelok compression fittings.

2.  **Wrenches for Swagelok fittings**: 7/16", 1/2", 9/16", and 11/16" inch wrenches.


## System Architecture {#system-architecture}

The SSIM2 sits between your sample and the Picarro analyzer. Gas flows through this path:

```text
Sample Container → SSIM Sample Port → SSIM Internal Chamber (20ml) →
SSIM Outlet → Picarro Gas Inlet
```

The SSIM contains:

-   **Internal valves** (V₁, V₂, V₃, V₄) that control gas routing
-   **20 ml sample chamber** where pressure equilibration occurs
-   **Pressure sensor** to monitor chamber pressure
-   **Vacuum port** connected to external vacuum pump
-   **Zero air port** for flushing
-   **Cal port** for calibration gas (optional, on front panel)

The workflow is automated by the SSIM Coordinator software:

1.  **Purge**: Zero air flows through the system to remove residual sample
2.  **Evacuate**: Vacuum pump evacuates SSIM and analyzer to remove all gas
3.  **Sample loading**: User opens manual valve on sample container
4.  **Equilibration**: Sample expands into the 20ml chamber, pressure equilibrates
5.  **Measurement**: Picarro continuously measures the sample for 8-12 minutes
6.  **Repeat**: Multiple replicate measurements of the same sample (typically 3-5)


## Hardware Setup {#hardware-setup}


### SSIM2 Physical Connections {#ssim2-physical-connections}

{{< alert2 Warning >}}
**The analyzer must be running and stabilized for at least 2 hours before connecting the SSIM.** The internal cavity must reach thermal equilibrium. If you connect the SSIM and start measurements too soon, your data will show drift as the analyzer continues to stabilize.
{{< /alert2 >}}

The SSIM2 has ports on the rear panel and front panel:

**Rear panel:**

-   **Sample Out** (connects to Picarro gas inlet)
-   **Vacuum** (connects to external vacuum pump)
-   **Zero Air** (connects to zero air cylinder)
-   **USB** (connects to computer)
-   **Valves** (power connection to SSIM)

**Front panel:**

-   **Sample** (connects to sample container with manual valve)
-   **Cal** (optionally connects to calibration gas cylinder)

Follow these steps to make gas connections:

1.  Position the SSIM2 close to the Picarro analyzer to minimize dead volume in connecting tubing.

2.  **Connect SSIM outlet to Picarro inlet:**
    -   Use a short length (~15-30 cm) of 1/8" stainless steel tubing with 1/8" Swagelok fittings on both ends
    -   Connect from "Sample Out" on the rear of the SSIM to "Gas Inlet" on the Picarro
    -   Tighten compression fittings: finger-tight, then 1.25 turns with wrench

3.  **Connect vacuum pump:**
    -   Connect vacuum pump to "Vacuum" port on rear of SSIM with supplied vacuum line
    -   Plug vacuum pump into power outlet

{{< alert2 Warning >}}
**Turn on the vacuum pump NOW and leave it running continuously.** The vacuum pump must be running whenever the Picarro analyzer is powered on. The analyzer's internal cavity operates under reduced pressure, and if the pump stops, pressure will build up and potentially damage the optical cavity. Treat the vacuum pump as an essential part of the system—if the analyzer is on, the pump must be on.
{{< /alert2 >}}

1.  **Connect zero air cylinder:**
    -   Attach regulator to zero air cylinder and set output pressure to 3 psi
    -   Connect from regulator to "Zero Air" port on rear of SSIM using 1/8" tubing
    -   Leave the cylinder valve closed for now

2.  **Connect calibration gas (optional):**
    -   Attach regulator to calibration gas cylinder and set output pressure to 3 psi
    -   Connect from regulator to "Cal" port on front of SSIM using 1/8" tubing
    -   Leave the cylinder valve closed for now

{{< alert2 Caution >}}
**Check all Swagelok connections for leaks.** After making connections, apply a small amount of soapy water to each fitting. Open gas cylinders briefly and watch for bubbles. Even tiny leaks will contaminate your samples. If you see bubbles, tighten the fitting an additional 1/4 turn.
{{< /alert2 >}}

1.  **Connect USB and power:**
    -   Connect USB cable from rear of SSIM to computer running the SSIM Coordinator software
    -   Connect the "Valves" power cable between SSIM and the Picarro analyzer's "Valves" port
    -   Verify the vacuum pump is running (you should hear it)


### Software Setup {#software-setup}

The SSIM Coordinator software controls the SSIM hardware, manages the measurement sequence, and logs data.


#### Disabling the Valve Sequencer {#disabling-the-valve-sequencer}

If your Picarro has been used with other accessories (like the 16-Port Distribution Manifold), you must disable the Valve Sequencer before using the SSIM:

1.  On the Windows computer, navigate to Start Menu → Utilities → Setup Tool
2.  In the Setup Tool, go to the **Port Manager** tab
3.  Set "Valve Sequencer MPV" to **OFF**
4.  Click "Apply" and close the Setup Tool
5.  Restart the Picarro software

If you skip this step, the Coordinator will display an error about valve conflicts.


#### Installing the SSIM Coordinator {#installing-the-ssim-coordinator}

The Coordinator installer is typically on a USB drive provided by Picarro or can be requested from Picarro support.

1.  Locate `setup_SSIM.exe` and double-click to begin installation
2.  Click "Next" through the installation wizard
3.  Select destination (default is `C:\Picarro\G2000`)
4.  Select your analyzer type: **G2201-i** (for isotopic CO₂ and CH₄)
5.  Click "Install" and wait for completion
6.  Click "Finish"

Several new icons will appear on the desktop:

-   **Picarro SSIM Coordinator** (for making measurements)
-   **SSIM Ready Test** (for system diagnostics)
-   **Read Ext Sensor** (for monitoring SSIM pressure)


#### Running the Ready Test {#running-the-ready-test}

Before your first measurement session, run the Ready Test to verify the system is functioning:

1.  Open **Picarro Coordinator Launcher** from the desktop
2.  Select **SSIM Ready Test** from the dropdown
3.  Click "Launch"
4.  Set "Maximum test duration" to 10 minutes (default)
5.  Click "OK"

The Ready Test uses a reference calibration gas (CAL) to verify the analyzer has stabilized and is producing consistent results. The test runs until the analyzer meets stability criteria or times out after 10 minutes.

You'll see a table of measurements appear in the Coordinator window. The test prints an update every 30 seconds. If the analyzer is stable, the test will complete in 5-10 minutes.

{{< alert2 Note >}}
**It's normal to see "Pressure High/Pressure Low" warnings** in the GUI status log during SSIM operation. The analyzer constantly adjusts internal pressure as the SSIM purges and delivers samples. These warnings are harmless unless accompanied by a persistent "System Alarm" indicator.
{{< /alert2 >}}


## Operating the SSIM2 {#operating-the-ssim2}


### Launching the Coordinator {#launching-the-coordinator}

1.  Open **Picarro Coordinator Launcher** from the desktop
2.  Select the appropriate mode:
    -   **SSIM G2201-i**: For standalone operation (manual sample containers)
    -   **SSIM G2201-i w/ HP CH4**: If your G2201-i has the high-precision CH₄ upgrade
3.  Click "Launch"
4.  The "Select Reference Gas" dialog appears—select your calibration gas from the dropdown (e.g., "Reference Gas G2101-i #1")
5.  Click "OK"


### Configuring Measurement Parameters {#configuring-measurement-parameters}

The "User Editable Parameters" window allows you to configure how measurements are taken:

| Parameter                         | Description                                                                    | Recommended Value                  |
|-----------------------------------|--------------------------------------------------------------------------------|------------------------------------|
| **Multi-Port Valve**              | Set to **2** if NOT using 16-Port Manifold                                     | 2                                  |
| **Number of Sample Ports**        | Ignored if Multi-Port Value = 2                                                | 1                                  |
| **Number of Repeats per Sample**  | How many times to measure each sample                                          | 3-5                                |
| **Number of Repeats of Standard** | How many times to measure the CAL gas                                          | 1                                  |
| **Standard Mode**                 | 1 = measure CAL between each sample; 2 = measure CAL only at beginning and end | 1 (recommended)                    |
| **Measurement Mode**              | 1 = single measurement; 2 = continuous loop                                    | 1                                  |
| **Measurement Duration**          | 1 = standard (12 min); 2 = fast (8 min)                                        | 2 (for most applications)          |
| **Sample Loading**                | 1 = manual; 2 = automatic                                                      | 1 (for manual sample bags)         |
| **Sample Dilution**               | 1 = no dilution; 2 = dilute sample with zero air                               | 1 (unless sample &gt;2000 ppm CO₂) |

**Typical configuration for soil/atmospheric samples:**

-   Repeats per sample: **3** (for statistical confidence)
-   Repeats of standard: **1** (measure CAL between each sample)
-   Standard mode: **1** (interleaved standards correct for drift)
-   Measurement duration: **2** (fast, 8 minutes per replicate)
-   Sample loading: **1** (manual)
-   Sample dilution: **1** (no dilution, unless your samples exceed 2000 ppm CO₂)

After setting parameters, click "OK" to continue.


### Measurement Workflow {#measurement-workflow}

Once the Coordinator window appears, the automated sequence begins:


#### Step 1: Purge and Evacuate {#step-1-purge-and-evacuate}

The Coordinator displays messages in the bottom log window:

```text
Run started.
Warming up the analyzer.
Make SAMPLE closed.
Vacuum lines being opened: 830.00
...
```

The SSIM will:

1.  Flush the system with zero air for ~30 seconds
2.  Close valves and turn on the vacuum pump to evacuate gas lines
3.  Wait for chamber pressure to drop below 10 Torr

**This takes approximately 2-3 minutes.**

{{< alert2 Warning >}}
**Ensure your sample container's manual valve is closed during purging.** The system evacuates to near-vacuum (~10 Torr). If the valve is open, your sample will be sucked out and lost.
{{< /alert2 >}}


#### Step 2: Attach Sample {#step-2-attach-sample}

After purging completes, the Coordinator prompts:

```text
ATTACH SAMPLE (CONTAINER WITH VALVE CLOSED) AND THEN SELECT "RESUME" UNDER "CONTROL" MENU.
```

1.  Take your sample container (Tedlar bag, flask, etc.) with its manual valve **closed**
2.  Attach the container to the "Sample" port on the front of the SSIM using a 1/8" Swagelok connection
3.  Once securely connected, go to the Coordinator window
4.  Click **Control** → **Resume**

{{< alert2 Note >}}
**Work quickly but carefully.** The analyzer is continuously measuring zero air while waiting. Extended delays will waste time, but rushing and making a poor connection will contaminate the sample.
{{< /alert2 >}}


#### Step 3: Sample Loading {#step-3-sample-loading}

The Coordinator will perform another brief purge and pump cycle to clean the line between the SSIM and your sample container.

After ~30 seconds, the Coordinator prompts:

```text
OPEN SAMPLE BAG VALVE, WAIT FOR PRESSURE TO SETTLE, AND SELECT "RESUME" UNDER "CONTROL" MENU.
```

1.  Slowly open the manual valve on your sample container
2.  Watch the pressure indicator in the Coordinator window (or the Read Ext Sensor window if open)
3.  The pressure will spike briefly, then settle as the sample expands into the SSIM's 20ml chamber
4.  Wait ~10-15 seconds for pressure to stabilize
5.  Click **Control** → **Resume**

{{< alert2 Caution >}}
**Open the valve slowly.** A rapid pressure surge can disturb the analyzer's optical cavity. A slow, controlled opening allows smooth equilibration.
{{< /alert2 >}}


#### Step 4: Measurement {#step-4-measurement}

The measurement begins automatically. You'll see:

-   The top panel shows real-time concentration and isotope values
-   The table fills with data rows (one row per second)
-   The log window shows status messages

**Fast measurement mode** runs for 8 minutes per replicate. The first 2-3 minutes are settling time while the gas equilibrates through the analyzer. The last 5-6 minutes are stable, averaged for your final result.

**Standard measurement mode** runs for 12 minutes per replicate.

The Coordinator will automatically perform the number of replicates you specified (e.g., 3 replicates = 24 minutes total for fast mode).

Between replicates, the system briefly evacuates and re-introduces your sample. This provides independent measurements of the same sample.


#### Step 5: Standard Measurement {#step-5-standard-measurement}

After completing all replicates of your sample, the Coordinator measures the calibration gas standard.

If "Standard Mode" was set to 1 (interleaved), it measures the CAL gas between each sample. This is recommended because the analyzer can drift slightly over hours, and interleaved standards allow you to correct for that drift during data processing.

The standard measurement is automatic (no user input required).


#### Step 6: Next Sample {#step-6-next-sample}

After the standard, the Coordinator returns to Step 1 (purge and evacuate) and prompts you to attach the next sample.

The cycle repeats until you manually terminate the program by clicking the red "X" or **Control** → **Stop**.

{{< alert2 Warning >}}
**Allow the Coordinator to finish gracefully.** Click the red "X" and wait for the program to complete its shutdown sequence (up to 1 minute). This returns the SSIM and analyzer to a safe idle state. Forcibly killing the program may leave valves open or the vacuum pump running.
{{< /alert2 >}}


## Data Output and Analysis {#data-output-and-analysis}


### Data File Location {#data-file-location}

Every time the Coordinator is started, a new CSV file is automatically created and saved to:

```text
C:\Isotopedata\
```

The filename format is: `CRDS####_####_YYYYMMDD_HHMMSS.dat`

For example: `CRDS2101_5892_20260304_143021.dat`

The file is written in real-time as measurements proceed. The upper portion of the Coordinator window displays the current data table, which is identical to what's saved in the CSV.


### Data File Structure {#data-file-structure}

Each row in the CSV represents one second of data. Key columns include:

| Column                   | Description                                   |
|--------------------------|-----------------------------------------------|
| **Run Num**              | Sequential measurement number                 |
| **Sample Bag**           | Sample identifier (user can edit in software) |
| **Date/Time**            | Timestamp                                     |
| **12CO2 (ppm)**          | CO₂ concentration                             |
| **12CO2_Mean**           | Average CO₂ over last 30 seconds              |
| **13CO2 (ppm)**          | ¹³CO₂ concentration                           |
| **Delta_Raw (‰)**        | Raw δ¹³C-CO₂ value                            |
| **12CH4 (ppm)**          | CH₄ concentration                             |
| **13CH4 (ppm)**          | ¹³CH₄ concentration                           |
| **Delta_Raw_CH4 (‰)**    | Raw δ¹³C-CH₄ value                            |
| **h2o_ppm**              | Water vapor concentration                     |
| **SSIM Pressure (Torr)** | SSIM chamber pressure                         |


### Processing the Data {#processing-the-data}

The raw δ¹³C values must be calibrated against your known reference standard. The general procedure:

1.  **Identify stable measurement periods:** For each replicate, the first 2-3 minutes are equilibration. The last 5-6 minutes (fast mode) or 8-9 minutes (standard mode) are stable.

2.  **Average stable values:** For each replicate, calculate the mean of the stable period for:
    -   `12CO2_Mean`
    -   `Delta_Raw` (δ¹³C-CO₂)
    -   `12CH4_Mean`
    -   `Delta_Raw_CH4` (δ¹³C-CH₄)

3.  **Calculate the mean and standard deviation across replicates** for each sample.

4.  **Apply two-point calibration using standards:** If you measured two reference gases with known δ¹³C values, create a linear calibration:
    ```text
          δ¹³C_true = m × δ¹³C_raw + b
    ```
    Where `m` and `b` are determined from your standards. This corrects for any instrument drift or offset.

5.  **Check precision:** The standard deviation across replicates should be &lt;0.2‰ for δ¹³C-CO₂ and &lt;0.5‰ for δ¹³C-CH₄. Higher variability suggests leaks, poor connections, or sample contamination.


## Sample Preparation Best Practices {#sample-preparation-best-practices}


### Collecting Field Samples {#collecting-field-samples}

**Tedlar bags:**

-   Use inert Tedlar bags with manual valve
-   Overfill bags (fill to bulging, then release pressure until soft)
-   Store samples in a cooler away from direct sunlight
-   Analyze within 24 hours (some CO₂ can permeate through bag material over days)

**Glass flasks:**

-   Better for long-term storage (weeks to months)
-   Evacuate flasks before field sampling, then open valve to fill with sample
-   Close valve immediately
-   Check for vacuum seal before analysis

**Soil chamber headspace:**

-   Let chamber equilibrate with soil for 5-10 minutes before sampling
-   Use syringe to transfer gas from chamber to sample bag
-   Or attach chamber directly to SSIM if chamber has appropriate fittings


### Sample Volume Requirements {#sample-volume-requirements}

The SSIM needs ~20 ml to fill its internal chamber. However, your sample container should hold more than 20 ml because:

1.  Some gas remains in the connecting tubing and fittings
2.  Multiple replicates draw from the same container (3 replicates ≈ 60 ml total)

**Recommended minimum sample volume: 100 ml**

If you have less than 100 ml, you may only get 1-2 replicates, which reduces statistical confidence.


### Diluting High-Concentration Samples {#diluting-high-concentration-samples}

If your sample exceeds ~2000 ppm CO₂, the analyzer may saturate or show nonlinear response. In this case, use the dilution feature:

1.  Set "Sample Dilution" parameter to **2** in the User Editable Parameters window
2.  The SSIM will automatically mix your sample with zero air at a 1:1 ratio before introducing it to the analyzer
3.  This halves the effective concentration

For soil respiration samples (which can reach 5000-10000 ppm CO₂), dilution is often necessary.


## Troubleshooting and Maintenance {#troubleshooting-and-maintenance}


### Common Issues {#common-issues}


#### "Pressure High" or "Pressure Low" Warnings (Normal) {#pressure-high-or-pressure-low-warnings--normal}

**Symptom:** The GUI Status Log shows alternating "Pressure High" and "Pressure Low" warnings during measurements.

**Cause:** The analyzer constantly adjusts cavity pressure as the SSIM delivers sample, purges, and evacuates. These pressure fluctuations are normal and expected.

**Solution:** Ignore these warnings unless they persist for more than 5 minutes or are accompanied by a "System Alarm" indicator. If the alarm triggers, check for leaks or blockages in the gas lines.


#### Sample Reads as Ambient Air (~420 ppm CO₂, δ¹³C ≈ -8‰) {#sample-reads-as-ambient-air--420-ppm-co-δ-c-8}

**Symptom:** Your sample reads identical to atmospheric air, even though you expected a different composition.

**Cause:** The sample container leaked, or the sample was lost during the vacuum/purge cycle.

**Solution:**

-   Verify the manual valve on the sample container was closed during the purge step
-   Check all Swagelok connections for leaks (use soapy water)
-   Ensure the sample container itself is airtight (some bags develop pinholes)


#### High Variability Across Replicates (SD &gt; 0.5‰) {#high-variability-across-replicates--sd-0-dot-5}

**Symptom:** The three replicates of a single sample show δ¹³C values that differ by more than 0.5‰.

**Cause:** Leak in the connection, incomplete pressure equilibration, or contamination.

**Solution:**

-   Tighten all Swagelok fittings (add 1/4 turn)
-   Wait longer (20-30 seconds) for pressure to stabilize after opening the sample valve
-   Check that the zero air and calibration gas cylinders are not contaminated


#### Values Don't Stabilize (CO₂ Continues Drifting) {#values-don-t-stabilize--co-continues-drifting}

**Symptom:** The CO₂ concentration or δ¹³C value continues to drift throughout the 8-12 minute measurement instead of reaching a plateau.

**Cause:** Slow leak, or the sample is reacting with moisture/materials inside the sample container.

**Solution:**

-   Check all connections for leaks
-   Avoid using sample bags that have been stored with reactive gases (e.g., don't reuse bags that previously held high-humidity samples)
-   Consider switching to glass flasks


#### SSIM Pressure Won't Drop Below 50 Torr During Evacuation {#ssim-pressure-won-t-drop-below-50-torr-during-evacuation}

**Symptom:** The log window shows the SSIM chamber pressure remains at 50-100 Torr even after several minutes of evacuation.

**Cause:** Leak in the vacuum line, or the vacuum pump is failing.

**Solution:**

-   Check the vacuum line connections (both at the SSIM and at the pump)
-   Listen to the vacuum pump—it should be running continuously. If it's silent, check power and connections
-   Replace the vacuum pump if it's been used for several years (diaphragm pumps degrade over time)

{{< alert2 Warning >}}
**Never turn off the vacuum pump while the analyzer is running.** Doing so will cause pressure to build up in the analyzer's optical cavity, potentially causing permanent damage. The vacuum pump must run continuously whenever the analyzer is powered on.
{{< /alert2 >}}


#### "Error: Could Not Find Valve" in Coordinator Window {#error-could-not-find-valve-in-coordinator-window}

**Symptom:** The Coordinator displays an error about not finding the SSIM valve when launching.

**Cause:** The Valve Sequencer was not disabled, or the USB connection is faulty.

**Solution:**

-   Open Setup Tool → Port Manager and set "Valve Sequencer MPV" to OFF
-   Restart the Picarro GUI software
-   Check the USB cable connection between SSIM and computer
-   Restart the computer if necessary


### Replacing the Vacuum Pump {#replacing-the-vacuum-pump}

The external vacuum pump is a consumable component that will eventually fail (typically after 2-5 years of use). Symptoms of a failing pump:

-   SSIM chamber pressure won't drop below 50 Torr
-   Pump makes unusual noises (grinding, squealing)
-   Pump doesn't turn on when Coordinator starts

To replace:

1.  Purchase a replacement diaphragm vacuum pump (Picarro part number or equivalent, capable of reaching &lt;10 Torr)
2.  Disconnect the old pump from the SSIM vacuum port and power
3.  Connect the new pump to the same vacuum line and power
4.  Run a Ready Test to verify the new pump functions correctly


### Cleaning the SSIM Sample Chamber {#cleaning-the-ssim-sample-chamber}

Over time, dust, moisture, or particulates from samples can accumulate inside the SSIM's 20ml sample chamber. This is rare but can cause erratic readings.

**Warning:** Opening the SSIM requires disassembly and should only be done if you're comfortable with precision fittings. Contact Picarro support if unsure.

To clean:

1.  Power off the SSIM and disconnect all gas lines
2.  Remove the sample chamber cover (typically 4 screws on the side panel)
3.  Flush the chamber with high-purity nitrogen or compressed air
4.  Use a lint-free wipe moistened with isopropyl alcohol to wipe the interior surfaces
5.  Allow to air-dry completely
6.  Reassemble and perform a Ready Test


### Annual Maintenance {#annual-maintenance}

At least once per year (or every 1000 measurement hours):

1.  **Check zero air and calibration gas cylinders** for contamination. Replace if CO₂ or CH₄ concentrations have drifted.

2.  **Verify calibration** by measuring 2-3 reference standards with known δ¹³C values (different from your routine CAL gas). If measured values deviate by &gt;0.5‰, contact Picarro support for recalibration.

3.  **Inspect all tubing and fittings** for wear, corrosion, or damage. Replace any suspect components.

4.  **Replace vacuum pump oil** (if using an oil-sealed pump) or inspect diaphragm condition (if using diaphragm pump).

5.  **Clean the Picarro analyzer's optical cavity** (if trained to do so, or contact Picarro service).


## Understanding Isotopic Data {#understanding-isotopic-data}


### What Do the Numbers Mean? {#what-do-the-numbers-mean}

**δ¹³C is a relative measurement, not an absolute one.** It compares the ¹³C/¹²C ratio in your sample to the ¹³C/¹²C ratio in a reference standard (VPDB).

```text
δ¹³C (‰) = [(R_sample / R_VPDB) - 1] × 1000
```

Where `R = ¹³C / ¹²C`

-   **δ¹³C = 0‰**: Your sample has the same ¹³C/¹²C ratio as VPDB
-   **δ¹³C = -10‰**: Your sample is depleted in ¹³C by 10 parts per thousand (10‰) relative to VPDB
-   **δ¹³C = +5‰**: Your sample is enriched in ¹³C by 5 parts per thousand relative to VPDB

Most natural CO₂ sources have negative δ¹³C because biological processes preferentially use ¹²C (it's lighter and reacts faster).


### Typical Values {#typical-values}

| Source                                   | δ¹³C-CO₂ (‰) |
|------------------------------------------|--------------|
| Atmospheric CO₂                          | -7 to -9     |
| C3 plant respiration (trees, most crops) | -24 to -30   |
| C4 plant respiration (corn, sugarcane)   | -10 to -14   |
| Soil respiration (mixed sources)         | -18 to -25   |
| Fossil fuel combustion                   | -25 to -30   |
| Ocean-atmosphere exchange                | ~-8          |

By measuring δ¹³C-CO₂ in a soil chamber, you can distinguish whether the CO₂ is coming from C3 plant roots, C4 plant roots, decomposition of organic matter, or atmospheric contamination.


### Keeling Plot Analysis {#keeling-plot-analysis}

If you're measuring a series of samples with different CO₂ concentrations, you can use a Keeling plot to determine the source δ¹³C.

Plot `δ¹³C` (y-axis) vs. `1/CO₂` (x-axis). The y-intercept (where 1/CO₂ → 0, meaning CO₂ → ∞) gives the δ¹³C of the source.

This is useful for soil respiration studies where you have chamber measurements taken at different closure times (and thus different CO₂ concentrations).


## Safety Notes {#safety-notes}

-   **The vacuum pump must run continuously whenever the analyzer is on.** This is the most important safety rule for the Picarro. The internal optical cavity operates at reduced pressure. If the pump stops while the analyzer is running, pressure will build inside the cavity and can permanently damage the optics. **Never turn off the vacuum pump unless you've first shut down the analyzer.** If you need to leave the lab for extended periods (days), either leave both the analyzer and pump running, or shut down both together.

-   **Compressed gas cylinders** can be hazardous if mishandled. Always secure cylinders in an upright position, use proper regulators, and never exceed maximum pressure ratings.

-   **Vacuum systems** can implode if glass components are damaged. Inspect all glass flasks for cracks before subjecting them to vacuum.

-   **The Picarro analyzer contains a laser.** Never attempt to open the analyzer enclosure without proper training. The laser is Class 1 (safe) only when enclosed. If you must open the enclosure (e.g., to reseat RAM), power off completely and wait 5 minutes for capacitors to discharge.

-   **Electrical hazards:** The vacuum pump and analyzer operate on mains voltage. Do not operate equipment with damaged power cables.


## Appendix: Gas Cylinder Specifications {#appendix-gas-cylinder-specifications}


### Zero Air {#zero-air}

-   **Composition:** &lt;1 ppm CO₂, &lt;5 ppb CH₄, &lt;10 ppm H₂O, balance N₂ and O₂
-   **Typical supplier:** Airgas "Ultra Zero Air" or equivalent
-   **Cylinder size:** Depends on usage; a size 300 cylinder (~6000 L) lasts ~6 months with daily use
-   **Regulator:** Single-stage or two-stage regulator, 0-60 psi range, 1/8" outlet fitting


### Calibration Gas {#calibration-gas}

-   **Composition:** Known δ¹³C-CO₂ and δ¹³C-CH₄ values, typically 400-800 ppm CO₂, 2-5 ppm CH₄, balance N₂
-   **Typical supplier:** Airgas, Isometric Instruments, or NOAA-certified standards
-   **Cylinder size:** Typically size 150 (aluminum) for portability
-   **Regulator:** Same as zero air

{{< alert2 Note >}}
**Request a certificate of analysis** when purchasing calibration gas. The certificate lists the exact δ¹³C values and concentrations, which you'll need for data processing.
{{< /alert2 >}}


## Appendix: Software Files and Paths {#appendix-software-files-and-paths}


### Key Directories {#key-directories}

-   **Installation:** `C:\Picarro\G2000\`
-   **Data output:** `C:\Isotopedata\`
-   **Configuration files:** `C:\Picarro\G2000\AddOns\SSIM\`
-   **Reference gas definitions:** `C:\Picarro\G2000\AddOns\SSIM\ReferenceGases.ini`


### Editing Reference Gases {#editing-reference-gases}

To add, remove, or modify reference gases:

1.  Close the SSIM Coordinator if running
2.  Navigate to `C:\Picarro\G2000\AddOns\SSIM\`
3.  Open `ReferenceGases.ini` in a text editor
4.  Add a new section:

<!--listend-->

```ini
[Reference Gas G2201-i #2]
12CO2 = 450.5
Delta_Raw = -8.25
12CH4 = 2.15
Delta_Raw_CH4 = -47.8
```

1.  Save the file
2.  The new reference gas will appear in the dropdown when you next launch the Coordinator


## Conclusion {#conclusion}

The Picarro G2201-i with SSIM2 module provides lab-quality isotopic measurements of discrete samples. The key to success is attention to detail: leak-free connections, proper sample handling, and careful data processing. With practice, you can achieve precision better than 0.2‰ for δ¹³C-CO₂, enabling powerful insights into carbon cycling, source partitioning, and biogeochemical processes.

If you encounter issues not covered in this guide, consult the official Picarro G2201-i manual, contact Picarro support, or reach out to [morgan@mor-gan.com](mailto:morgan@mor-gan.com).

---

_Written in March 2026._

_Created by Morgan Salisbury_
