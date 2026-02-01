+++
title = "Using the EGM-4 & open-egm4 software"
date = 2026-02-01T12:00:00-06:00
draft = false
+++

{{< alert2 Warning >}}
**Backup your data regularly.**  The EGM-4's internal memory is limited to 9999 records and 99 plots. Failing to dump data regularly will result in data loss when this buffer fills. When memory is full, the oldest records are overwritten.
{{< /alert2 >}}

{{< alert2 Warning >}}
**You are responsible for your data.** Significant care has been taken to ensure data safety. However, by using the open-egm4 software, you accept the risk of data loss. Open-egm4 can not send commands to the EGM-4 itself, and therefore cannot damage it internally.
{{< /alert2 >}}

{{< alert2 Caution >}}
**Don't get water in the gas lines.** If you do, it might enter the IRGA itself and damage it. It's like $15,000 to replace.
{{< /alert2 >}}


## Introduction {#introduction}

The PP Systems EGM-4 (EGM) is a portable infrared gas analyzer (IRGA) designed for measuring soil CO₂ efflux. The device connects to various chamber types and soil probes, and stores measurements in it's internal memory.

The open-egm4 software is a terminal interface designed to make data collection from the EGM reliable and easy. Unlike the legacy (read: outdated, buggy and frustrating) Windows software from PP Systems, this runs on macOS, Linux, and modern Windows systems.

This guide covers operation of the EGM itself, the SRC-1 chamber, how to use them alongside the open-egm4 software, common field scenarios and troubleshooting everything involved.


## TL;DR checklist {#tl-dr-checklist}

1.  **Charge**: The internal battery lasts a few hours. Make sure the EGM-4 is fully charged if you need to go on an expedition to get your data.
2.  **Connect**: Serial Cable → USB Adapter → Computer
3.  **Install Software**: Run the one-line installer (see Installation section below)
4.  **Launch**: Run `open-egm4` in your terminal of choice. It should auto select the serial connection.
5.  **Warm Up**: Wait 5-10 minutes after powering on EGM-4 for it to warm up.
6.  **Measure**: Press `1REC` on EGM-4 to take measurements.
7.  **Export**: Press `4DMP` to dump date after a session


## Installing open-egm4 {#installing-open-egm4}

**What is open-egm4?**

-   A terminal-based (text interface) application that communicates with the EGM
-   Provides real-time CO₂ visualization, data logging, and exporting said data to a csv
-   Works on any modern operating system
-   Can run over SSH for remote field work (if anyone thinks of a genuine use case for this [please tell me](mailto:egm4@mor-gan.com))

**What is a Terminal?**
A terminal (also called "command line" or "shell") is a text-based interface for your computer. Think of it as typing commands directly to your computer instead of clicking on icons. Using a computer through the terminal (or, pediantrically, _it's_ terminal) typically gives you much greater control and choice over it's operation. In this case, open-egm4 was developed as a TUI (_terminal user interface_: an app that runs inside of the terminal) because it allows the app to be significantly smaller, more portable, and more lightweight to run on underpowered computers.

For more information on my debatable decision to develop the app for the terminal, see the appendix.

**System Requirements:**

-   macOS 10.14+, Windows 10+, or any modern Linux
-   Python 3.8+ (the installer handles this automatically)
-   USB serial port or USB-to-serial adapter
    -   _Note_ If you are buying a USB-serial adapter, make sure to get one that uses a FTDI chipset. Cheap adapters often use "Prolific" chips which have notoriously bad drivers. FTDI chips are easier and require zero thought to use.
-   Internet connection (for installation only)


### One-Line Installation (Recommended) {#one-line-installation--recommended}

This is the easiest method. A script handles everything: installing Python dependencies, downloading the software, and setting up shortcuts so you can run `open-egm4` from anywhere.


#### Step 1: Open Your Terminal {#step-1-open-your-terminal}

**macOS:**

1.  Press `Cmd + Space` to open Spotlight search.
2.  Type "Terminal"
3.  Press Enter
4.  A window with white or black background appears—this is your terminal.

**Windows:**

1.  Click the Start Menu (Windows logo)
2.  Type "cmd" or "PowerShell"
3.  Press Enter
4.  A window appears with text—this is your command prompt (command prompt is exclusive to Windows; it is _a_ terminal. It has also been around since the 80s: PowerShell is Microsoft's attempt at an updated terminal for Windows.)

**Linux:**
You already know how to open a terminal.


#### Step 2: Copy and Paste the Installation Command {#step-2-copy-and-paste-the-installation-command}

{{< alert2 Caution >}}
**With great power...** Entering commands into a terminal gives you much more control over your computer than most users are used to. While this power is beneficial for knowledgeable users, it also makes it easy to make potentially irreversible mistakes.
{{< /alert2 >}}

{{< alert2 Warning >}}
**...comes great responsibility.** You should never copy and paste commands into your terminal from sources you do not trust. A malicious command could delete files, install malware, or send your data to an attacker. While **I** wrote this script, you are ultimately trusting _me_ not to do something harmful. You can (and really should) view the install script source before running it.
{{< /alert2 >}}

In your terminal window, copy and paste this line as written:

```bash
curl -sSL https://raw.githubusercontent.com/mmorgans/open-egm4/main/install.sh | bash
```

**How to Paste in Terminal:**

-   **macOS**: Press `Cmd + V` (normal paste works)
-   **Windows (cmd)**: Right-click in the window, select "Paste"
-   **Windows (PowerShell)**: Right-click to paste, OR `Ctrl + Shift + V`
-   **Linux**: `Ctrl + Shift + V` (not `Ctrl + V`!)

Press `Enter` to run the command.


#### Step 3: What You'll See During Installation {#step-3-what-you-ll-see-during-installation}

After pressing Enter, text will start scrolling down the screen. You'll see messages like:

```text
[INFO] Checking prerequisites...
[INFO] Installing fresh to /Users/hello/.open-egm4...
[INFO] Creating virtual environment...
[INFO] Fetching latest version and installing dependencies...
```

The installation takes 1-3 minutes depending on your internet speed. When you see "Installation Complete", it's done.

**Troubleshooting**:

-   On Linux, you might need to add your user to the `dialout` group to access the serial port. You can do this with the command `sudo usermod -a -G dialout $USER`
-   If you see "curl: command not found" on Windows, try using PowerShell instead of cmd
-   If you see "Python not found", the installer will attempt to install it automatically
-   If installation fails, try the manual installation below. If it still doesn't work, [shoot me an email](mailto:egm4@mor-gan.com) and I'll try to help.


### Pip Installation {#pip-installation}

If you're comfortable with Python environments:

```bash
# Install via pipx (recommended for isolation)
pipx install git+https://github.com/mmorgans/open-egm4

# OR install in your active virtual environment
pip install git+https://github.com/mmorgans/open-egm4
```

If you want to edit the code of open-egm4, there are more instructions on [the repository page](https://github.com/mmorgans/open-egm4).


### Initial Connection to the EGM-4 {#initial-connection-to-the-egm-4}

Once software is installed, connect the EGM to a computer:

1.  **Physical Connection:**
    -   Connect the serial cable to the EGM's RS232 port
    -   Connect the USB-to-serial adapter to your computer
    -   Power on the EGM with the switch on the back

2.  **Launch the Software:**

On your computer, in the terminal, run

```bash
open-egm4
```

1.  **Select Serial Port:**
    -   The software will list available serial ports (e.g., `/dev/tty.usbserial`, `COM3`)
    -   It will also attempt to guess at which one the EGM is connected to and automatically connect to it
    -   If it doesn't, select the port manually. If you don't see your port listed, check the cable connection and hit `r` on your keyboard to refresh the list of ports.
    -   On macOS, look for ports containing "usbserial" or "FTDI"
    -   On Windows, look for "COM" ports (COM3, COM4, etc.)
    -   Use arrow keys to select the port, and press Enter to confirm it

2.  **Verify Connection:**
    -   The EGM screams out data over the serial connection, but it's incapable of receiving any data back. Therefore, you'll have no way of knowing if you're actually connected to the EGM unless you dump some data to a computer.
    -   To send data from the EGM to a computer, press `4DMP` on the EGM, then `2 DATA DUMP`, then press any key to begin the transfer.
    -   If you see the data streaming in on your computer, celebrate. If you don't, then check out the troubleshooting section.

3.  **Press `q` to quit** (or `Ctl + c`, which should quit most running terminal commands) when you're done exploring.


## EGM-4 hardware {#egm-4-hardware}


### Physical Interface &amp; Controls {#physical-interface-and-controls}

The EGM-4 is a portable, battery-powered CO₂ analyzer. Key components:

**Front Panel:**

-   **LCD Display**: 2×16 character display
-   1-9 keypad, along with `Y/R` key (used for accepting and recording) and `N` key (used for denying and going back)
-   `8/X` allows you to toggle between display screens while taking a measurement
-   `0/Z` allows you to manually zero the EGM-4 during a measurement

**Top:**

-   **Gas In Port**: Connect sample inlet tubing (1/8" ID)
-   **Gas Out Port**: Exhaust port (1/8" ID) AND static sample injection port
-   **I/O Connectors**: Two 15-pin D-sub connectors for sensors (notably the SRC-1)
-   **RS232 Port**: 9-pin connector for data transfer to a computer

**Back:**

-   **Power Switch**: Self explanatory
-   **12V DC Charge Socket**: For charging the internal battery _and_ running the EGM off of mains power
-   **Fuse**: 1A fuse
-   **Soda Lime Cap**: Access to the CO₂ scrubbing column for replacing it.


### Power &amp; Battery {#power-and-battery}

The EGM-4 uses a 12V 2.0Ah sealed lead-acid battery. It should last around 4 hours of use at 20ºC. If the temperature is below 5ºC, the battery life drops 30-40%.

{{< alert2 Note >}}
At low temperatures, you should hold the EGM inside your jacket, maintaining skin-to-skin contact. This will increase the battery life by a few minutes, and will psychologically bond you with the device.
{{< /alert2 >}}

**Charging:** The manual proports that the battery takes 12 hours to charge fully. _I_ think that's a made up number, and in my testing it's ready for action after around 2 hours. Your mileage may vary.

If you are planning on storing the EGM long term, charge the battery beforehand to avoid damaging it.

**Replacement:** To replace the battery, [Troubleshooting &amp; Maintenance](#troubleshooting-and-maintenance).


### SRC-1 Soil Respiration Chamber {#src-1-soil-respiration-chamber}

The SRC-1 is a soil respiration chamber that allows you to measure the rate of soil respiration by monitoring the rate of increase of CO₂concentration within a closed system: the chamber itself. See the [SRC-1 Workflow section.](#workflow-1-soil-respiration-with-src-1-chamber)


## open-egm4 software {#open-egm4-software}

This section covers how to use the open-egm4 software, assuming you've already installed it.

Launch the software by running `open-egm4` in your terminal.


### Connection screen {#connection-screen}

When you launch the software, you'll see the connection screen, with a list of ports.

Open-egm4 will attempt to detect which port the EGM-4 is connected to and automatically connect to it after 5 seconds. Use the arrow keys to cancel this countdown and select a port manually.

To select a port manually, use the arrow keys to navigate the list of ports and press `Enter` to confirm your selection. If you don't see your port listed, check the cable connection and hit `r` on your keyboard to refresh the list of ports. If you accidentally select the wrong port, hit `q` to quit and try again.

-   On macOS, the EGM-4 will likely appear as a port containing "usbserial" or "FTDI"
-   On Windows, the EGM-4 will likely appear as a "COM" port (COM3, COM4, etc.)

Open-egm4 automatically saves data to its internal database. This allows you to restore from a previous session without having to re-dump data from the EGM. To do this, press `s` while on the connection screen. You'll see a list of saved sessions, and you can use the arrow keys to select one and press `Enter` to restore it. You do not need to have the EGM connected to the computer to restore a session. While the EGM is not connected, "Offline" will be displayed in the status panel.


### Main interface {#main-interface}

This is the main interface, where you'll spend most of your time. It consists of:

**Left Panel - Graph:** This panel displays incoming data from the EGM, whether it be from a live measurement or a data dump. The axes will automatically rescale to fit the data. The units will also change depending on how you are viewing the data, so be sure to check the legend to understand what you're looking at.

Directly below the graph are the available channels and graph controls. The available channels will change depending on what probe was connected when the the data was recorded. Press the number key associated with each channel to view that channel in the graph.

Above the graph, you'll see information about what the graph is currently displaying, including the currently selected channel, the units of the y-axis, and the plot number.

Press the `<` or `>` keys to cycle through different plots. This is useful to view measurements from a specific location, and to filter out data you aren't interested in viewing.

Press `i` to toggle inspect mode on the graph. In this mode, a yellow `x` appears on the graph, and you can use the left and right arrow keys to move the cursor along the x-axis. The y-values for the currently selected channel at the cursor's position are displayed above the graph. Press `i` again to exit inspect mode.

**Right Panels - Status and Log:** These panels display the current status of the EGM and the log of recent events. The status panel shows the current CO₂ concentration, along with derived statistics from that value. The log panel shows EGM system messages and app events.

**Footer:** The footer displays a list of all commands, along with their keyboard shortcuts.


#### Keyboard Commands {#keyboard-commands}

| Key       | Action                             | Description                                  |
|-----------|------------------------------------|----------------------------------------------|
| `q`       | Quit                               | Saves and exits as quickly as possible       |
| `e`       | Export                             | Opens the export screen to save data as CSV  |
| `c`       | Clear                              | Clears all chart data (with confirmation)    |
| `p`       | Pause                              | Pauses/resumes the data stream               |
| `n`       | Note                               | Add a timestamped note to the log            |
| `b`       | Big Mode                           | Large CO₂ display for visibility outdoors    |
| `d`       | Theme                              | Toggle between dark and light themes         |
| `i`       | Inspect                            | Toggleable mode to examine individual points |
| `?`       | Help                               | Information about the app                    |
| `1` - `9` | Switch between data channels       |                                              |
| `,` / `.` | Cycle between different plots      |                                              |
| `<` / `>` | Same as above: plot selection      |                                              |
| `←` / `→` | Move cursor (when in Inspect mode) |                                              |


#### Exporting data {#exporting-data}

Press `e` to open the export screen. This allows you to filter and export your data.

At the top of the export screen, you'll see the number of data currently selected to export. Initially, this will be all of the data currently in the app.

**Filtering data**
To export only a subset of that data, use the `p` and `d` keys to select only certain plots and dates, respectively.

To select specific plots to export, press `p` to open the plot selection screen. Use the arrow keys to navigate the list of plots and press `Space` to select or deselect a plot. Press `p` again to confirm and return to the export screen.

To select specific dates to export, press `d` to open the date selection screen. Use the arrow keys to navigate the list of dates and press `Space` to select or deselect a date. Press `d` again to confirm and return to the export screen.

You should see the number of data points to export update as you make your selections. Once you've selected the data you want to export, press `e` to export the data.

**Output**
.csv files are attempted to be saved to your Downloads directory. If this fails, the file will be saved in the same directory as open-egm4 was run in (likely your home directory).


#### Pausing (`p`) {#pausing--p}

Press `p` to pause the data stream. While paused, the chart will stop updating with data, but you can still interact with the app. This is useful if you need to examine the chart without it updating with new data. Press `p` again to resume the data stream.


#### Adding notes (`n`) {#adding-notes--n}

Press `n` to add a timestamped note to the log. This will open a prompt where you can type a note. Press `Enter` to save the note, or `Esc` to cancel.


#### Clearing data (`c`) {#clearing-data--c}

Press `c` to clear all data from the current session. You will be asked to confirm before the data is cleared.


### Quitting (`q`) {#quitting--q}

Press `q` to quit the app. All data from your session is automatically saved, and you can restore it the next time you open the app by pressing `s` while on the connection screen.


## Workflows {#workflows}


### Workflow 1: Soil Respiration with SRC-1 Chamber {#workflow-1-soil-respiration-with-src-1-chamber}

This is the most common application: measuring CO₂ flux from soil using the SRC-1 closed-chamber method.

**Equipment Needed:**

-   EGM-4 with fully charged battery
-   SRC-1 soil respiration chamber
-   Soil collars (pre-installed in field 24-48 hrs before measurements)
-   Optional: Laptop running open-egm4 for monitoring

**Soil Collars**: Install the soil collars in the soil days\* before you plan to measure. A well-placed collar should be 3-5cm\*\* into the ground. Remove any above ground vegetation inside the collar after placing it.

{{< alert2 Note >}}
The above instructions depend almost _entirely_ on your situation. You might consider installing the soil collar weeks or months ahead of time. The depth of the collar needed to ensure a good measurement will depend on the soil type and the goals of your experiment.
{{< /alert2 >}}

**Field Procedure:**

1.  **Connect SRC-1 to EGM-4:**
    -   Connect the I/O cable of the SRC-1 to the EGM-4
    -   Connect the gas tube labeled "R" to the gas in port of the EGM-4
    -   Connect the unlabeled gas tube to the gas out port of the EGM-4

2.  **Startup &amp; Warmup (10-15 minutes):**
    -   Power on EGM-4
    -   Wait for warm-up message to complete: the EGM must reach an internal temperature of 55°C to be able to take readings

3.  **Enter Measurement Mode:**
    -   Press `1` (REC) from main menu
    -   EGM-4 displays measurement settings
    -   Default: DT=120 seconds (measurement duration), DC=50 ppm (max CO₂ change)
    -   **To change settings**: Press `N` to go back
    -   Press `Y` to confirm settings

4.  **Set Plot Number (if needed):**
    -   Display shows "PLOT NO = X"
    -   Press `Y` to keep current plot number
    -   Or enter new number (e.g., "01" for plot 1) and press `Y`

5.  **Chamber Flush:**
    -   Display shows "CHAMBER FLUSHING - HOLD IN AIR"
    -   Hold chamber in air for ~15 seconds at arms length

6.  **Deployment:**
    -   Display shows "PLACE ON SOIL - PRESS Y TO START"
    -   Place chamber on soil collar, using blue tac to ensure a good seal
    -   Press `Y` to start measurement

7.  **Equilibration:**
    -   Display shows "EQUILIBRATION - PLEASE WAIT"
    -   System equilibrates for ~5 seconds
    -   Then measurement begins automatically

8.  **Measurement:**
    -   Display shows:
        ```text
                  C 395 H14.7 T22
                  A02.11 Q0000 110
        ```
    -   `C`: Current CO₂ (ppm)
    -   `H`: Humidity (mb, if sensor connected)
    -   `T`: Soil temperature (°C, if sensor connected)
    -   `A`: Calculated flux rate (g CO₂ m⁻² hr⁻¹)
    -   `Q`: PAR light level (if sensor connected)
    -   `110`: Elapsed time (seconds) — shows "END" when complete
    -   After a measurement, you will be prompted to save the measurement with "RECORD Y/N"
    -   Press `Y` to save the measurement
    -   Press `N` to discard and retry

9.  **Remove Chamber &amp; Continue:**
    -   Display shows "REMOVE FROM SOIL THEN PRESS Y KEY"
    -   Lift chamber from soil collar
    -   Press `Y` to prepare for next measurement

{{< alert2 Caution >}}
The plot number will **not** auto-increment. You must manually enter the plot number for each measurement, and the EGM will happily overwrite the previous measurement if you don't change the plot number between measurements.
{{< /alert2 >}}

1.  **Data Storage:**

If you had a laptop connected to the EGM while you were taking measurements, then you were able to view the incoming data in real-time and export it at will. If not, the data is stored in the EGM's internal memory. The EGM stores up to 999 records, and will start overwriting old records if full. See for instructions on how to export data from the EGM.


### Workflow 2: Static Sampling via Syringe Injection {#workflow-2-static-sampling-via-syringe-injection}

Static sampling is used when you want to measure CO₂ concentration of a discrete air sample without continuous flow. Common applications: measuring gas concentrations from sealed containers, soil headspace, or captured gas samples.

Instead of pumping air continuously through the EGM-4, you inject a small volume of sample directly into the measurement cell using a syringe. The internal pump is turned off to avoid diluting your sample.

**Equipment Needed:**

-   EGM-4 with battery
-   Luer-lock syringe (5-10 ml)
-   Sample collection container (if collecting from field)
-   Septum or sampling port (if sampling from closed system)

**Setup Procedure:**

1.  **Enable Static Sampling Mode:**
    -   From Main Menu, press `2` (SET)
    -   Press `3` (PMP) to access pump control
    -   Current display shows "SAMPLE PUMP ON / Y/OK N/CHANGE"
    -   Press `N` to change
    -   Display now shows "STATIC SAMPLING / Y/OK N/CHANGE"
    -   Press `Y` to confirm

2.  **Prepare for Injection:**
    -   Press `1` (REC) to enter measurement mode
    -   EGM-4 now displays CO₂ concentration
    -   Display will show the current CO₂ concentration

**Sampling Procedure:**

1.  **Collect Sample:**
    -   Draw sample into syringe, at least 5 ml is required for a stable reading.

2.  **Inject Sample:**
    -   Locate the Gas Out port on top of EGM-4
    -   Inject sample into the Gas Out port
    -   Watch CO₂ reading on display

3.  **Read Stabilized Value:**
    -   The CO₂ reading will change as your sample fills the cell
    -   Wait 10-20 seconds for reading to stabilize
    -   Reading is stable when it changes less than 1-2 ppm over 30 seconds
    -   Press `Y` to record measurement

4.  **Flush Between Samples:**
    -   Inject ambient air several times to flush
    -   Or wait for auto-zero cycle (warnings appear at 2 min and 1 min before zero)
    -   During zero, pump turns on automatically to flush cell, then turns off

**Auto-Zero Warnings in Static Mode:**
The EGM-4 will still perform automatic zeros even with pump off. You'll see warnings:

-   "AUTO ZERO IN 2 MINUTES"
-   "AUTO ZERO IN 1 MINUTE"

When zero begins, the pump turns on for ~15 seconds, then turns off again. This ensures an accurate baseline.

{{< alert2 Caution >}}
Don't forget to re-enable the pump when finished.
{{< /alert2 >}}


### Workflow 3: Dumping Stored Data from EGM-4 Memory {#workflow-3-dumping-stored-data-from-egm-4-memory}

To transfer stored records from the EGM-4 to your computer, do the following:

1.  Connect the EGM-4 to your computer using a serial cable and USB adapter
2.  Power on the EGM-4 and open the open-egm4 app on your computer by typing `open-egm4` in the terminal
3.  Press `4DMP` from the Main Menu on the EGM-4, then Press `2 DATA DUMP`
4.  Once the open-egm4 app is ready, press any key on the EGM-4 to start the transfer
5.  View your data on the graph, and use the `<` and `>` keys to view a specific plot
6.  Press `e` to open the export menu. Use the `p` and `d` keys to select the plot(s) and/or date(s) you want to export, then press `e` to export
7.  The .csv will be saved to your Downloads directory

**Data Record Structure:**

Each record contains (in CSV format):

-   M/R flag (M=real-time, R=stored record)
-   Plot number (0-9999)
-   Record number (1-9999)
-   Date (day, month)
-   Time (hour, minute)
-   CO₂ (ppm)
-   H₂O vapor (mb, if sensor present)
-   RH/Temp sensor data
-   Sensor inputs A-E (mV values)
-   Atmospheric pressure (mb)
-   Probe type (0-11)


## Troubleshooting &amp; Maintenance {#troubleshooting-and-maintenance}

{{< alert2 Warning >}}
Only open the unit if you feel comfortable with electronics. Static discharge can damage sensitive components. Ground yourself before poking around.
{{< /alert2 >}}


### Replacing the Soda Lime CO₂ Scrubber {#replacing-the-soda-lime-co-scrubber}

The EGM needs to know what zero CO₂ looks like to make accurate measurements, and uses the soda lime to figure that out. Gradually, the granules in the soda lime column become saturated with CO₂ and can no longer absorb it, becoming pale in color as they do so. Replace when around 2/3 of the column have changed color.

To do this, unscrew the black cap on the back panel, pour out the old granules, and fill the column with fresh soda lime, leaving about an inch of space at the top. Replace the foam filter and cap.

{{< alert2 Warning >}}
Wash your hands after handling soda lime. It's caustic.
{{< /alert2 >}}


### Replacing the Internal Battery {#replacing-the-internal-battery}

The internal battery will need to be replaced after a few years of use. To do this, unscrew the

flip the egm on its back

4 screws

flip the egm back over, carefully so it doesn't fall out of the case

remove the outer cover

remove the two screws on the back cover, and, leaning the back cover away from the EGM, carefully remove it.

fix this section


### Replacing internal tubing {#replacing-internal-tubing}

Over time, the internal gas tubing will become aged and leak air. You'll need to replace it with 1/8" tubing, being careful not to create kinks or bends in the tubing. If you need 90 degree bends, some are availabe at McMaster-Carr (item number 5463K42).


### EGM-4 error codes {#egm-4-error-codes}

The EGM-4 displays numbered error codes when problems occur:

**Error 01: Zero Too Low**

-   **Cause**: Soda lime exhausted, absorber column not seated, or valve failure
-   **Solution**:
    1.  Replace the soda lime.
    2.  Ensure the soda lime cap is tight.

**Error 02: CO₂ &lt; 250 ppm**

-   **Cause**: Either genuine low CO₂ or same as Error 01
-   **Solution**: If you're measuring ambient air (~400 ppm), this indicates same problems as Error 01

**Error 03: Analyzer Temperature &lt; 50°C**

-   **Cause**: Instrument too cold or thermostat failure
-   **Solution**:
    1.  Allow longer warm-up time, or move somewhere warmer.

**Error 04: Analyzer Temperature &gt; 60°C**

-   **Cause**: Instrument overheating or thermostat failure
-   **Solution**:
    1.  Turn off, allow to cool.
    2.  Check for ventilation blockage.

**Error 05: RH &gt; 90%**

-   **Cause**: High humidity or water in sample line
-   **Solution**: In humid conditions, this may be normal.

**Error 06: Battery Voltage Low**

-   **Cause**: Battery voltage &lt; 10.5V
-   **Solution**: Recharge the battery. If problem persists, replace the battery.


### Software Connection Issues {#software-connection-issues}

-   **"command not found"**: Installation didn't complete. Try re-installing.
-   **"No module named 'serial'"**: Missing dependency—reinstall with `pip install pyserial`

**Can't connect to EGM-4:**

-   Check the cables and make sure they're securely connected
-   Check EGM-4 is powered on
-   Verify you selected the correct serial port
-   Try a different serial port if multiple are available
-   On Linux: check permissions (`ls -l /dev/ttyUSB0` should show you have read access)


## Technical Appendix {#technical-appendix}


### A: Serial Protocol Specification {#a-serial-protocol-specification}

The EGM-4 communicates over RS-232 serial at 9600 baud, 8 data bits, no parity, 1 stop bit, and no flow control. This is a standard configuration supported by virtually all serial terminal software.

Each data record is exactly 61 characters long (1 letter followed by 60 digits), with no spaces or delimiters, terminated by a carriage return and line feed (`\r\n`). The manual refers to "60 digits" which excludes the initial M/R mode character. During live measurements, the EGM transmits one record per second. When dumping stored data, all records are sent consecutively.

Here's an example raw record:

`R000002180313170042900000000000000000000000000400000000096508`

The table below shows how to interpret parsed records. Both real-time measurements (`M`) and stored records (`R`) use the same format:

| M/R | Plot No. | Rec No | Day | Mo | Hr | Min | CO₂ Ref | H₂O Ref | RHT   | A    | B    | C    | D    | E    | F    | G  | H  | AP  | PT |
|-----|----------|--------|-----|----|----|-----|---------|---------|-------|------|------|------|------|------|------|----|----|-----|----|
| M   | 1        | 1      | 28  | 1  | 13 | 19  | 968     | 0       | 000.0 | 0000 | 0000 | 0000 | 0000 | 0000 | 0000 | 00 | 00 | 991 | 0  |
| R   | 1        | 2      | 28  | 1  | 13 | 21  | 930     | 0       | 000.0 | 0000 | 0000 | 0000 | 0000 | 0000 | 0000 | 00 | 00 | 991 | 0  |

The fixed columns are:

| Column  | Description                                                     |
|---------|-----------------------------------------------------------------|
| M/R     | M = real-time measurement, R = record retrieved from memory     |
| Plot No | Plot number, 0-99                                               |
| Rec No  | Record number within the plot, 1-9999                           |
| Day     | Day of month, 1-31                                              |
| Mo      | Month, 1-12                                                     |
| Hr      | Hour in 24-hour format, 0-23                                    |
| Min     | Minute, 0-59                                                    |
| CO₂ Ref | CO₂ concentration in ppm (equivalent to µmol mol⁻¹)             |
| H₂O Ref | Water vapor in millibars (only if optional RH sensor is fitted) |
| RHT     | Temperature from RH sensor in °C (if sensor is fitted)          |
| A-H     | Probe-specific fields (see probe type table below)              |
| AP      | Atmospheric pressure in millibars                               |
| PT      | Probe type code, 0-11                                           |

Columns A through H contain probe-specific data whose meaning depends on the connected sensor:

| Type | Sensor                  | A        | B         | C        | D        | E        | F       | G          | H           |
|------|-------------------------|----------|-----------|----------|----------|----------|---------|------------|-------------|
| 0    | No Sensor (stand-alone) | mV Pin 1 | mV Pin 2  | mV Pin 3 | mV Pin 4 | mV Pin 5 | —       | —          | —           |
| 1    | STP-1 Soil Temp         | PAR      | %RH       | Temp     | —        | mV Pin 5 | —       | —          | —           |
| 2    | HTR-2 %RH/Temp/PAR      | PAR      | %RH       | Temp     | —        | —        | —       | —          | —           |
| 3    | HTR-1 %RH/Temp/LUX      | PAR      | %RH       | Temp     | —        | —        | —       | —          | —           |
| 7    | PMR-4 Porometer         | PAR      | %RH In    | Temp     | %RH Out  | Flow     | GS      | —          | —           |
| 8    | SRC-1 Soil Respiration  | PAR      | %RH       | Temp     | DC       | DT       | SR Rate | —          | +/- SR Rate |
| 10   | 50Y %RH/Temp            | —        | %RH       | Temp     | —        | —        | —       | —          | —           |
| 11   | CFX-1 / CPY-3           | PAR      | Evap Rate | Temp     | DC       | Flow     | SR Rate | Flow Mult. | +/- SR Rate |

The units for each data type are:

| Output Data | Units                                                       |
|-------------|-------------------------------------------------------------|
| PAR         | µmol m⁻² s⁻¹                                                |
| %RH         | %                                                           |
| Evap Rate   | mmol m⁻² s⁻¹ × 1000                                         |
| Temperature | °C                                                          |
| Flow        | ml min⁻¹                                                    |
| GS          | mmol (H₂O) m⁻² s⁻¹ (Stomatal Conductance)                   |
| SR Rate     | g CO₂ m⁻² hr⁻¹ for SRC-1; µmol m⁻² s⁻¹ for CPY-3 and CFX-1  |
| DC          | ppm (change in CO₂ concentration)                           |
| DT          | seconds (change in time)                                    |
| +/-         | 00 = respiration (CO₂ increase), 01 = uptake (CO₂ decrease) |

{{< alert2 Note >}}
For CFX-1/CPY-3, column G contains a flow multiplier (1 or 10) that should be applied to get the true flow rate.
{{< /alert2 >}}

Here's a Python function that parses a raw 61-character record:

```python
def parse_egm4_record(raw):
    """Parse EGM-4 61-character fixed-width record (1 letter + 60 digits).

    Example input: 'R000002180313170042900000000000000000000000000400000000096508'
    """
    return {
        'mode': raw[0],              # 1 char: M or R
        'plot': int(raw[1:3]),       # 2 chars: 00-99
        'record_num': int(raw[3:7]), # 4 chars: 0001-9999
        'day': int(raw[7:9]),        # 2 chars
        'month': int(raw[9:11]),     # 2 chars
        'hour': int(raw[11:13]),     # 2 chars
        'minute': int(raw[13:15]),   # 2 chars
        'co2_ppm': int(raw[15:19]),  # 4 chars
        'h2o_mb': int(raw[19:23]),   # 4 chars
        'rht_temp': float(raw[23:28]) / 10,  # 5 chars (XXX.X format)
        'sensor_a': int(raw[28:32]), # 4 chars
        'sensor_b': int(raw[32:36]), # 4 chars
        'sensor_c': int(raw[36:40]), # 4 chars
        'sensor_d': int(raw[40:44]), # 4 chars
        'sensor_e': int(raw[44:48]), # 4 chars
        'sensor_f': int(raw[48:52]), # 4 chars
        'sensor_g': int(raw[52:54]), # 2 chars
        'sensor_h': int(raw[54:56]), # 2 chars
        'pressure_mb': int(raw[56:59]),  # 3 chars
        'probe_type': int(raw[59:61])    # 2 chars (types 0-11)
    }
```

Beyond data records, the EGM-4 also sends status messages during startup and operation. A boot message takes the form `B,EGM4,<serial>,<firmware>` and provides the device's serial number and firmware version. During warmup, you'll see `W,TT` messages where TT indicates the current cell temperature. The instrument sends `I,NN` during initialization and `Z,NN` during zeroing, where NN is a countdown counter. Diagnostic messages beginning with `D,` contain internal state information documented in the manual on page 38.


### B: Flux Calculation Methods {#b-flux-calculation-methods}

The EGM-4 calculates soil respiration flux automatically, but understanding the underlying mathematics helps with interpreting results and troubleshooting anomalies.


#### Closed-System Chamber Method {#closed-system-chamber-method}

When using the SRC-1 chamber, flux is calculated from the rate at which CO₂ accumulates inside the sealed volume. The fundamental equation is:

\\[F = \frac{dC}{dt} \times \frac{V}{A} \times \frac{P}{R \times T}\\]

In this equation, \\(F\\) represents the CO₂ flux in µmol m⁻² s⁻¹, \\(\frac{dC}{dt}\\) is the rate of CO₂ concentration change in ppm per second, \\(V\\) is the total system volume (chamber plus tubing) in milliliters, and \\(A\\) is the soil area covered by the chamber in square centimeters. The term \\(\frac{P}{RT}\\) converts the concentration change to molar units, where \\(P\\) is atmospheric pressure in Pascals, \\(R\\) is the gas constant (8.314 J mol⁻¹ K⁻¹), and \\(T\\) is air temperature in Kelvin.

The EGM-4 reports flux in g CO₂ m⁻² hr⁻¹. The conversion from µmol m⁻² s⁻¹ involves multiplying by the molecular weight of CO₂ (44.01 g/mol), converting micromoles to moles (× 10⁻⁶), and converting seconds to hours (× 3600):

\\[F\_{g/m²/hr} = F\_{µmol/m²/s} \times 44.01 \times 10^{-6} \times 3600\\]


#### Linear vs. Quadratic Fitting {#linear-vs-dot-quadratic-fitting}

The EGM-4 offers two methods for determining the rate of CO₂ change over time.

Linear fitting assumes a constant flux rate throughout the measurement period. The instrument fits the data to the equation \\(C(t) = C\_0 + kt\\), where the slope \\(k\\) equals \\(\frac{dC}{dt}\\). This approach works well for short measurements under two minutes.

Quadratic fitting accounts for non-linear effects such as chamber leakage and feedback from rising CO₂ concentrations. The instrument fits a curve of the form \\(C(t) = C\_0 + kt + ct^2\\), using the initial slope \\(k\\) for the flux calculation. This method is recommended for measurements longer than two minutes. The EGM-4 automatically selects quadratic fitting when the coefficient \\(c\\) exceeds 0.1 times \\(k\\); otherwise, it defaults to linear.


#### Chamber Corrections {#chamber-corrections}

For the SRC-1, the default chamber volume is 1171 ml with a soil contact area of 78.5 cm² (corresponding to the 10 cm diameter opening). Tubing typically adds 50–100 ml to the total volume. If you're using a custom chamber setup, the total volume is simply the chamber volume plus the tubing volume, where tubing volume can be calculated as \\(V\_{tubing} = \pi r^2 L\\) with \\(r\\) being the internal radius and \\(L\\) the total length in centimeters.

Temperature should ideally be measured inside the chamber using the RH/Temp sensor or an STP-1 probe, as the sample air temperature directly affects the flux calculation. The EGM-4 measures atmospheric pressure internally and applies corrections automatically. At higher elevations, pressure drops significantly—approximately 900 mb at 1000 m and 800 mb at 2000 m compared to 1013 mb at sea level—and this affects how many CO₂ molecules occupy a given volume.


#### Worked Example {#worked-example}

Consider a measurement where CO₂ rose from 400 ppm to 450 ppm over 90 seconds, with a chamber volume of 1171 ml (1.171 × 10⁻³ m³), area of 78.5 cm² (7.85 × 10⁻³ m²), temperature of 20°C (293 K), and pressure of 101,300 Pa.

First, calculate the rate of change: \\(\frac{dC}{dt} = \frac{450 - 400}{90} = 0.556\\) ppm/s, which equals 0.556 × 10⁻⁶ mol mol⁻¹ s⁻¹.

Next, determine the molar density of air: \\(\frac{P}{RT} = \frac{101300}{8.314 \times 293} = 41.58\\) mol m⁻³.

Calculate the volume-to-area ratio: \\(\frac{V}{A} = \frac{1.171 \times 10^{-3}}{7.85 \times 10^{-3}} = 0.149\\) m.

Now compute the flux: \\(F = (0.556 \times 10^{-6}) \times 0.149 \times 41.58 = 3.45\\) µmol m⁻² s⁻¹.

Finally, convert to standard units: \\(F = 3.45 \times 44.01 \times 10^{-6} \times 3600 = 0.55\\) g CO₂ m⁻² hr⁻¹.

This result falls within the typical range for moderately active soil (0.1 to 2.0 g CO₂ m⁻² hr⁻¹), providing a useful sanity check.


#### Sources of Error {#sources-of-error}

Measurement accuracy can be compromised by chamber leaks (which typically cause underestimation), temperature gradients inside the chamber (particularly when exposed to direct sunlight), pressure fluctuations from wind or weather changes, and non-representative soil coverage due to stones or gaps in the collar seal.

For the complete mathematical derivation, consult pages 22–26 of the EGM-4 Operator's Manual and pages 15–20 of the SRC-1 Chamber Manual.


### C: Probe Types Reference (0-11) {#c-probe-types-reference--0-11}

The EGM-4 automatically identifies connected sensors by reading a code resistor on Pin 1 of the 15-pin connector. When you power on the device with a sensor attached, the startup screen displays "PROBETYPE X" where X is the detected type number from the table below:

| Type | Sensor/Probe           | Code Resistor | Typical Use                               |
|------|------------------------|---------------|-------------------------------------------|
| 0    | No sensor              | None          | Stand-alone CO₂ analyzer                  |
| 1    | STP-1 Soil Temperature | 100 kΩ        | Soil temperature logging                  |
| 2    | HTR-2 RH/Temp/PAR      | 56 kΩ         | Environmental monitoring                  |
| 3    | HTR-1 RH/Temp/PAR      | 36 kΩ         | Environmental monitoring (legacy)         |
| 4    | PAR-1 Light Sensor     | 27 kΩ         | PAR (photosynthetically active radiation) |
| 5    | PAR-1 LUX              | 20 kΩ         | Light intensity in lux                    |
| 6    | SRM-1                  | 15 kΩ         | Solarimeter                               |
| 7    | PMR-4 Porometer        | User-set      | Leaf stomatal conductance                 |
| 8    | SRC-1 Soil Respiration | 9.1 kΩ        | Closed-system soil CO₂ flux               |
| 9    | RH/T/O₂                | 20 kΩ         | Humidity, temp, oxygen                    |
| 10   | 50Y RH/Temperature     | 5.6 kΩ        | Humidity and temperature only             |
| 11   | CFX-1 / CPY-3          | 4.3 kΩ        | Open-system flux chambers                 |

For Type 2, 3, and 10 sensors, the raw millivolt readings can be converted to physical units using these relationships: PAR equals the millivolt reading multiplied by 3 (giving µmol m⁻² s⁻¹), relative humidity equals the millivolt reading divided by 10 (giving percent), and temperature equals the millivolt reading divided by 20 (giving °C).

If you're using non-PP-Systems sensors or need to override auto-detection (for Type 0 or 7), you can manually set the probe type through Menu 2 (SET), then option 1 (EGM), where you select stand-alone mode, probe mode, or porometer mode.

Custom sensors can be connected to the I/O ports, which accept 0–1V input signals. The readings appear as millivolt values (0–1000 mV) in the A through E fields of data records. When using custom sensors, ensure your output is scaled to the 0–1V range and apply your own conversion factors during post-processing.


### D: Water Vapor &amp; Temperature Corrections {#d-water-vapor-and-temperature-corrections}

CO₂ measurements are affected by both water vapor and temperature. The EGM-4 applies corrections automatically when appropriate sensors are connected, but understanding these effects helps in troubleshooting anomalous readings.

Water vapor dilutes the mole fraction of CO₂ in air. The relationship between wet and dry CO₂ concentrations is:

\\[C\_{dry} = \frac{C\_{wet}}{1 - \frac{e}{P}}\\]

Here, \\(C\_{dry}\\) is the CO₂ concentration in dry air (ppm), \\(C\_{wet}\\) is the measured concentration in humid air, \\(e\\) is water vapor pressure in millibars, and \\(P\\) is total atmospheric pressure in millibars.

As a practical example: if you measure 400 ppm CO₂ in air with 20 mb of water vapor at 1013 mb total pressure, the correction factor is \\(1 - (20/1013) = 0.980\\), giving a dry-air equivalent of \\(400 / 0.980 = 408\\) ppm. The EGM-4 applies this correction automatically when an RH/Temp sensor is connected; without the sensor, no correction is applied.

Temperature affects CO₂ measurements in several ways. Colder air has higher gas density (more molecules per unit volume), detector sensitivity varies with temperature, and temperature is a direct input to flux calculations. To minimize temperature effects on the IRGA itself, the EGM-4 thermostatically maintains the sample cell at 55°C.

For best results, always use an RH/Temp sensor for accurate measurements, record the temperature inside the chamber (using an STP-1 if available) for flux calculations, and expect 2–4% corrections to CO₂ values when humidity exceeds 90%.


### E: Chamber Volume Calculations {#e-chamber-volume-calculations}

Accurate flux measurements depend on knowing the total system volume, which includes both the chamber and all connecting tubing. For the SRC-1, the manufacturer specifies a chamber volume of 1171 ml. Adding the standard tubing (typically 50–100 ml depending on length) gives a total system volume of roughly 1220–1270 ml.

For cylindrical chambers, volume is calculated as \\(V = \pi r^2 h\\), where \\(r\\) is the radius and \\(h\\) is the height, both in centimeters, yielding volume in cubic centimeters (equivalent to milliliters). Tubing volume uses the same formula: \\(V\_{tube} = \pi r^2 L\\), where \\(L\\) is the total tubing length.

As an example, 1/8" inner diameter tubing has an internal diameter of 3.175 mm, or a radius of 0.15875 cm. For 100 cm of this tubing, the volume is \\(\pi \times (0.15875)^2 \times 100 = 7.9\\) ml.

The soil contact area is similarly calculated as \\(A = \pi r^2\\). For the SRC-1 with its 10 cm diameter opening, this gives \\(A = \pi \times 5^2 = 78.5\\) cm².

To enter custom volume and area values in the EGM-4, press 1 (REC) from the Main Menu, then press N at the settings screen to modify values. Press 1 to change volume or 2 to change area, enter your new values, and the EGM-4 will automatically update the V/A ratio used in flux calculations.

The volume-to-area ratio determines how quickly CO₂ accumulates for a given flux rate. A high V/A ratio means slower accumulation and longer measurement times, while a low V/A ratio results in faster accumulation. For soil respiration work, typical V/A ratios are around 15 cm; the SRC-1 default is 14.9 cm.


### F: open-egm4 Software Design Philosophy {#f-open-egm4-software-design-philosophy}

This section explains why open-egm4 was built as a terminal user interface (TUI) and how the software works internally.


#### Why a Terminal Interface? {#why-a-terminal-interface}

Open-egm4 deliberately uses a text-based terminal interface instead of a graphical interface for several important reasons.

Cross-platform compatibility is a major advantage. The software runs identically on macOS, Linux, and Windows because it does not rely on platform-specific UI frameworks. This eliminates the "it works on my machine" inconsistencies that often arise when porting graphical applications between different operating systems.

Remote access via SSH is trivial with a terminal application. Users can monitor field equipment from any location with an internet connection. Because terminal interfaces use minimal bandwidth—approximately 1 KB/s compared to over 100 KB/s for a standard GUI—the software remains responsive even over slow or unreliable network connections.

The application is lightweight and fast, typically starting in less than one second and consuming only 10–20 MB of RAM. By avoiding the overhead of graphics rendering, the application remains fully functional on older or low-powered field hardware.

A terminal interface is inherently scriptable and automatable. The application can be controlled via shell scripts, making it simple to integrate the EGM-4 into automated data collection pipelines or broader research workflows.

There's also the matter of reliability—terminal applications _should_ be more reliable than GUI apps. Maybe. And finally: KISS. Keep it simple, stupid.


#### Advantages Over Legacy Windows Software {#advantages-over-legacy-windows-software}

The official PP Systems software is Windows-only and has several limitations. It requires specific .NET framework versions that may conflict with other software, offers no remote access capability, and is closed-source (so you can't fix bugs or add features). It also appears to no longer be actively maintained.

Open-egm4 addresses all of these concerns. It runs on any operating system, is open source under the MIT license, and is actively developed and maintained. The community can contribute features, and it works seamlessly over SSH for remote field sites.

**Architecture Overview:**

Open-egm4 is built in Python using the [Textual](https://textual.textualize.io/) framework for terminal UI rendering.

The core serial communication lives in `src/egm_interface.py`, which defines the `EGM4Serial` class. This class manages the connection to the EGM-4 via pyserial, parses the incoming 60-character fixed-width data records using position-based slicing, and dispatches parsed data to registered callbacks. The parser handles all probe types (0-11) and extracts fields like CO₂, temperature, humidity, and calculated flux depending on the connected sensor.

Session persistence is handled by `src/database.py`, which uses SQLite to store readings across sessions. This allows users to close the app and resume later without losing data. The database stores each reading with its timestamp, plot number, channel values, and session metadata.

The TUI itself is composed of screens and widgets in the `src/tui/` directory. The main application entry point is `src/tui/app.py`, which sets up the Textual app and manages screen transitions. Key screens include the connection screen (`screens/connect.py`), the main monitor screen (`screens/monitor.py`), the export wizard (`screens/export.py`), and the high-visibility "big mode" (`screens/big_mode.py`).

The monitor screen orchestrates real-time display by wiring the serial handler to the chart widget (`widgets/co2_chart.py`), which renders data using [plotext](https://github.com/piccolomo/plotext) for ASCII plotting. Statistics are calculated and displayed by `widgets/stats.py`, and the channel legend is managed by `widgets/legend.py`.

Export functionality converts session data to CSV format, allowing users to filter by plot number and date range before saving.

**Data Flow:**

```text
EGM-4 → Serial Cable → USB Adapter → pyserial → EGM4Serial (egm_interface.py)
                                                         ↓
                                                    Parser (position-based slicing)
                                                         ↓
                                               MonitorScreen (monitor.py)
                                                ↙         ↓         ↘
                                          CO2Chart   StatsWidget   Database
                                                                      ↓
                                                               CSV Export
```

_Created in Doom Emacs 2.0.9, using org-mode 9.7._

_Written in January 2026._

Created by Morgan Salisbury
