+++
title = "Using the EGM-4 & open-egm4 software"
date = 2026-01-30
draft = true
+++

{{< alert2 Warning >}}
**Backup your data regularly.**  The EGM-4's internal memory is limited to 999 records. Failing to dump data regularly will result in data loss when this buffer fills. When memory is full, the oldest records are overwritten.
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

**Connection Parameters:**

-   Baud: 9600
-   Data bits: 8
-   Parity: None
-   Stop bits: 1
-   Flow control: None

**Data Format:**

-   ASCII text, comma-separated values (CSV)
-   Line terminator: `\r\n` (carriage return + line feed)
-   Continuous stream in REC mode (1 record per second)
-   Full dump in DUMP mode

**Record Structure (comma seperated for readability):**

```text
M,1,5,27,1,13,19,968,0,000.0,0000,0000,0000,0000,0000,0000,00,00,991,0
```

Fields (in order):

1.  Mode: `M` (real-time measurement) or `R` (stored record)
2.  Plot number (0-99)
3.  Record number (1-9999)
4.  Day (1-31)
5.  Month (1-12)
6.  Hour (0-23, 24-hour format)
7.  Minute (0-59)
8.  CO₂ Reference (ppm)
9.  H₂O Reference (mb, or 0 if no sensor)
10. RH/Temp sensor temperature (°C × 10, "000.0" format)

11-15. Sensor inputs A-E (mV, "0000" format)
16-17. Reserved (00)

1.  Atmospheric pressure (mb)
2.  Probe type (0-11)

**Probe-Type-Specific Fields (11-17):**

For Probe Type 8 (SRC-1 Soil Respiration):

-   Field 11 (A): PAR (µmol m⁻² s⁻¹)
-   Field 12 (B): %RH (× 10, "000.0" format)
-   Field 13 (C): Temperature (°C × 10)
-   Field 14 (D): ΔC (change in CO₂, ppm)
-   Field 15 (E): ΔT (change in time, seconds)
-   Field 16 (F): Flux rate (g CO₂ m⁻² hr⁻¹ × 100, "00.00" format)
-   Field 17 (G): Flux sign (00=positive/respiration, 01=negative/uptake)

For other probe types, see EGM-4 manual page 35.

**Example Parser (Python):**

```python
import re

def parse_egm4_record(line):
    """Parse EGM-4 serial output line."""
    parts = line.strip().split(',')

    record = {
        'mode': parts[0],
        'plot': int(parts[1]),
        'record_num': int(parts[2]),
        'day': int(parts[3]),
        'month': int(parts[4]),
        'hour': int(parts[5]),
        'minute': int(parts[6]),
        'co2_ppm': int(parts[7]),
        'h2o_mb': int(parts[8]),
        'rh_temp_c': float(parts[9]),
        'sensor_a_mv': int(parts[10]),
        'sensor_b_mv': int(parts[11]),
        'sensor_c_mv': int(parts[12]),
        'sensor_d_mv': int(parts[13]),
        'sensor_e_mv': int(parts[14]),
        'pressure_mb': int(parts[18]),
        'probe_type': int(parts[19])
    }

    return record
```

**Special Messages:**

During startup/operation, EGM-4 sends status messages:

-   `B,EGM4,<serial>,<firmware>`: Boot message with serial number and firmware version
-   `I,NN`: Initialization countdown (NN = counter)
-   `W,TT`: Warmup message (TT = cell temperature)
-   `Z,NN`: Zeroing countdown (NN = counter)
-   `D,<diagnostic_data>`: Diagnostic data (see manual p.38)


### B: Flux Calculation Methods {#b-flux-calculation-methods}

The EGM-4 calculates soil respiration flux automatically, but understanding the math helps interpret results and troubleshoot problems.

**Closed-System Chamber Method (SRC-1):**

Flux is calculated from the rate of CO₂ increase inside the sealed chamber:

**Basic equation:**
\\[F = \frac{dC}{dt} \times \frac{V}{A} \times \frac{P}{R \times T}\\]

Where:

-   \\(F\\) = CO₂ flux (µmol m⁻² s⁻¹)
-   \\(\frac{dC}{dt}\\) = rate of CO₂ concentration change (ppm s⁻¹)
-   \\(V\\) = system volume (chamber + tubing, ml)
-   \\(A\\) = soil area covered (cm²)
-   \\(P\\) = atmospheric pressure (Pa)
-   \\(R\\) = gas constant (8.314 J mol⁻¹ K⁻¹)
-   \\(T\\) = air temperature (K)

**Units conversion to g CO₂ m⁻² hr⁻¹:**
The EGM-4 reports flux in g CO₂ m⁻² hr⁻¹. To convert:
\\[F\_{g/m²/hr} = F\_{µmol/m²/s} \times 44.01 \times 10^{-6} \times 3600\\]

Where 44.01 is the molecular weight of CO₂ (g/mol).

**Linear vs. Quadratic Fitting:**

The EGM-4 offers two methods for calculating \\(\frac{dC}{dt}\\):

1.  **Linear fit**: Assumes constant flux rate
    -   Fits line: \\(C(t) = C\_0 + kt\\)
    -   Slope \\(k\\) = \\(\frac{dC}{dt}\\)
    -   Works well for short measurements (&lt;2 min)

2.  **Quadratic fit**: Accounts for chamber leakage and feedback effects
    -   Fits curve: \\(C(t) = C\_0 + kt + ct^2\\)
    -   Initial slope \\(k\\) = \\(\frac{dC}{dt}\\)
    -   Corrects for non-linearity
    -   Recommended for longer measurements (&gt;2 min)

The EGM-4 automatically uses quadratic if coefficient \\(c > 0.1k\\), otherwise defaults to linear.

**Chamber-Specific Corrections:**

**SRC-1 Default Values:**

-   Volume: 1171 ml (chamber) + tubing volume
-   Area: 78.5 cm² (10 cm diameter)
-   Typical tubing adds ~50-100 ml

**Volume calculation for custom setups:**
\\[V\_{total} = V\_{chamber} + V\_{tubing}\\]

Where:
\\[V\_{tubing} = \pi r^2 L\\]

-   \\(r\\) = internal tubing radius (cm)
-   \\(L\\) = total tubing length (cm)

**Temperature correction:**
The EGM-4 uses air temperature (from RH/Temp sensor or approximate value set by user). For more accuracy, use actual temperature measured inside chamber.

**Pressure correction:**
The EGM-4 measures atmospheric pressure internally. At high elevations:

-   Sea level: ~1013 mb
-   1000m elevation: ~900 mb
-   2000m elevation: ~800 mb

Pressure affects the number of CO₂ molecules per volume, so measurement is automatically corrected.

**Worked Example:**

Measured data:

-   Initial CO₂: 400 ppm
-   Final CO₂: 450 ppm
-   Time elapsed: 90 seconds
-   Chamber volume (V): 1171 ml = 1.171 × 10⁻³ m³
-   Chamber area (A): 78.5 cm² = 7.85 × 10⁻³ m²
-   Temperature: 20°C = 293 K
-   Pressure: 101,300 Pa
-   Gas constant (R): 8.314 J mol⁻¹ K⁻¹

**Step 1: Calculate rate of CO₂ change**

\\[\frac{dC}{dt} = \frac{C\_{final} - C\_{initial}}{\Delta t} = \frac{450 - 400}{90} = 0.556 \text{ ppm s}^{-1}\\]

Note: 1 ppm = 10⁻⁶ mol/mol, so this equals 0.556 × 10⁻⁶ mol mol⁻¹ s⁻¹

**Step 2: Calculate molar density of air using ideal gas law**

\\[\frac{P}{RT} = \frac{101300}{8.314 \times 293} = \frac{101300}{2436} = 41.58 \text{ mol m}^{-3}\\]

**Step 3: Calculate V/A ratio**

\\[\frac{V}{A} = \frac{1.171 \times 10^{-3} \text{ m}^3}{7.85 \times 10^{-3} \text{ m}^2} = 0.149 \text{ m}\\]

**Step 4: Calculate flux in µmol m⁻² s⁻¹**

\\[F = \frac{dC}{dt} \times \frac{V}{A} \times \frac{P}{RT}\\]

\\[F = (0.556 \times 10^{-6}) \times 0.149 \times 41.58\\]

\\[F = 3.45 \times 10^{-6} \text{ mol m}^{-2} \text{ s}^{-1} = 3.45 \text{ µmol m}^{-2} \text{ s}^{-1}\\]

**Step 5: Convert to g CO₂ m⁻² hr⁻¹**

\\[F = 3.45 \text{ µmol m}^{-2} \text{ s}^{-1} \times 44.01 \frac{\text{g}}{\text{mol}} \times 10^{-6} \frac{\text{mol}}{\text{µmol}} \times 3600 \frac{\text{s}}{\text{hr}}\\]

\\[F = 3.45 \times 44.01 \times 10^{-6} \times 3600 = 0.55 \text{ g CO}\_2 \text{ m}^{-2} \text{ hr}^{-1}\\]

**Sanity check:** Typical soil respiration rates range from 0.1 to 2.0 g CO₂ m⁻² hr⁻¹, so 0.55 is reasonable for a moderately active soil.

**Sources of Error:**

-   Chamber leaks (usually causes underestimation)
-   Temperature gradients (chamber warms in sun)
-   Pressure fluctuations (wind, weather changes)
-   Non-representative soil area (stones, cracks in collar seal)

**For full derivation, see:**

-   EGM-4 Operator's Manual, page 22-26
-   SRC-1 Chamber Manual, pages 15-20


### C: Probe Types Reference (0-11) {#c-probe-types-reference--0-11}

The EGM-4 recognizes different sensor types via code resistors in the 15-pin connector.

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

**Sensor Conversions (from mV to real units):**

When using Type 2/3/10 sensors:

-   PAR: \\(\text{PAR (µmol m⁻² s⁻¹)} = \text{mV} \times 3\\)
-   %RH: \\(\text{RH (\\%)} = \text{mV} / 10\\)
-   Temperature: \\(\text{Temp (°C)} = \text{mV} / 20\\)

**Auto-Detection:**
When you connect a PP Systems sensor and power on the EGM-4, it reads the code resistor on Pin 1 of the connector and automatically sets the probe type. You'll see "PROBETYPE X" on the startup screen.

**Manually Setting Probe Type:**
If using non-PP Systems sensors or for Type 0/7:

-   Menu `2` (SET) → `1` (EGM)
-   Select option `1` (stand-alone), `2` (with probe), or `3` (porometer)

**Custom Sensors:**
You can connect custom sensors to the I/O ports. Each port accepts 0-1V input:

-   A-E inputs appear as mV values (0-1000 mV) in data records
-   Scale your sensor output to 0-1V range
-   Apply conversion factors in post-processing


### D: Water Vapor &amp; Temperature Corrections {#d-water-vapor-and-temperature-corrections}

CO₂ measurements are affected by water vapor (dilution effect) and temperature. The EGM-4 applies corrections automatically, but understanding these helps troubleshoot anomalies.

**Water Vapor Dilution:**

Water vapor dilutes the mole fraction of CO₂ in air. Relationship:
\\[C\_{dry} = \frac{C\_{wet}}{1 - \frac{e}{P}}\\]

Where:

-   \\(C\_{dry}\\) = CO₂ mole fraction in dry air (ppm)
-   \\(C\_{wet}\\) = measured CO₂ in humid air (ppm)
-   \\(e\\) = water vapor pressure (mb)
-   \\(P\\) = total atmospheric pressure (mb)

**Example:**

-   Measured: 400 ppm CO₂ at 20 mb H₂O vapor, 1013 mb pressure
-   Correction factor: \\(1 - (20/1013) = 0.980\\)
-   Dry-air equivalent: \\(400 / 0.980 = 408\\) ppm

The EGM-4 applies this correction when an RH/Temp sensor is connected. Without the sensor, no correction is applied.

**Temperature Effects:**

Temperature affects:

1.  **Gas density**: More molecules per volume when cold
2.  **IRGA sensitivity**: Detector response varies with temperature
3.  **Flux calculations**: See Flux Calculations section

The EGM-4 thermostatically controls the sample cell at 55°C to minimize temperature effects on the IRGA itself. However, sample temperature still matters for flux calculations.

**Best Practices:**

-   Always use RH/Temp sensor for accurate measurements
-   Record temperature inside chamber (STP-1) for flux calculations
-   In very humid conditions (&gt;90% RH), expect ~2-4% correction to CO₂ values


### E: Chamber Volume Calculations {#e-chamber-volume-calculations}

Accurate flux measurements require knowing the total system volume (chamber + tubing).

**SRC-1 Default:**

-   Chamber volume: 1171 ml (manufacturer spec)
-   Standard tubing: ~50-100 ml (depends on length)
-   Total: ~1220-1270 ml

**Calculating Custom Volumes:**

**Chamber volume** (for cylindrical chambers):
\\[V = \pi r^2 h\\]

-   \\(r\\) = radius (cm)
-   \\(h\\) = height (cm)
-   Volume in cm³ (= ml)

**Tubing volume:**
\\[V\_{tube} = \pi r^2 L\\]

-   \\(r\\) = internal radius (cm)
-   \\(L\\) = total length (cm)

**Example:**

-   1/8" ID tubing = 3.175 mm ID = 0.15875 cm radius
-   100 cm length
-   \\(V = \pi (0.15875)^2 (100) = 7.9\\) ml

**Area Calculation:**
\\[A = \pi r^2\\]

For SRC-1 (10 cm diameter):
\\[A = \pi (5)^2 = 78.5 \text{ cm²}\\]

**Setting Custom Values in EGM-4:**

1.  Press `1` (REC) from Main Menu
2.  At settings screen, press `N` to modify
3.  Press `1` to change volume, `2` to change area
4.  Enter new values
5.  EGM-4 auto-updates V/A ratio used in calculations

**Why V/A Ratio Matters:**
The \\(\frac{V}{A}\\) ratio determines how quickly CO₂ accumulates per unit flux:

-   High V/A: Slower accumulation, longer measurement time needed
-   Low V/A: Faster accumulation, shorter measurement time

For soil respiration, typical V/A ≈ 15 cm (SRC-1 default is 14.9 cm).


### F: open-egm4 Software Design Philosophy {#f-open-egm4-software-design-philosophy}

This section explains why open-egm4 was built as a terminal user interface (TUI) and how the software works internally.

**Why a Terminal Interface?**

Open-egm4 deliberately uses a text-based terminal interface instead of a graphical interface (GUI) for several important reasons:

1.  **Cross-Platform Compatibility:**
    The software runs identically on macOS, Linux, and Windows because it does not rely on platform-specific UI frameworks. This eliminates the "it works on my machine" inconsistencies that often arise when porting graphical applications between different operating systems.

2.  **Remote Access via SSH:**
    Users can monitor field equipment from any location with an internet connection. Because terminal interfaces use minimal bandwidth—approximately 1 KB/s compared to over 100 KB/s for a standard GUI—the software remains responsive even over slow or unreliable network connections.

3.  **Lightweight and Fast:**
    Open-egm4 is designed to be highly efficient, typically starting in less than one second and consuming only 10–20 MB of RAM. By avoiding the overhead of graphics rendering, the application remains fully functional on older or low-powered field hardware.

4.  **Scriptable and Automatable:**
    The interface can be controlled via shell scripts, making it simple to integrate the EGM-4 into automated data collection pipelines or broader research workflows.

5.  **Reliability:**
    It should be much more reliable than a GUI app. Maybe.

6.  **KISS:**
    Keep it simple, stupid.

**Advantages Over Legacy Windows Software:**

The official PP Systems software (Windows-only) has several limitations:

-   Only runs on Windows
-   Requires specific .NET framework versions
-   No remote access capability
-   Closed-source (can't fix bugs or add features)
-   No longer actively maintained

Open-egm4 addresses all of these:

-   ✓ Runs on any OS
-   ✓ Open source (MIT license)
-   ✓ Actively developed and maintained
-   ✓ Community can contribute features
-   ✓ Works over SSH for remote field sites

**Architecture Overview:**

Open-egm4 is built in Python with these components:

1.  **Serial Handler** (`serial_handler.py`):
    -   Manages connection to EGM-4 via pyserial library
    -   Parses incoming data stream using regex
    -   Handles reconnection on dropout
    -   Runs in separate thread to prevent blocking UI

2.  **Data Manager** (`data_manager.py`):
    -   Stores measurements in memory during session
    -   Validates data (checks for anomalies)
    -   Timestamps each record
    -   Handles session management (start/stop/export)

3.  **Terminal UI** (`tui.py`):
    -   Built with textual
    -   Real-time chart rendering using ASCII art
    -   Keyboard input handling
    -   Layout management (adaptive to terminal size)

4.  **CSV Exporter** (`export.py`):
    -   Converts in-memory data to CSV format
    -   Adds headers with metadata (session info, device settings)
    -   Handles multiple sessions in one export

**Data Flow:**

```text
EGM-4 → Serial Cable → USB Adapter → pyserial → Serial Handler
                                                        ↓
                                                   Parser (regex)
                                                        ↓
                                                  Data Manager
                                                   ↙         ↘
                                           Terminal UI     CSV Export
```

_Created in Doom Emacs 2.0.9, using org-mode 9.7._

_Written in January 2026._

Created by Morgan Salisbury
