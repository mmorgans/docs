+++
title = "Analyzing soil with an XRF"
date = 2024-10-21T08:56:00+08:00
draft = false
+++

{{< alert2 Warning >}}
**This instrument produces ionizing radiation.** Usual radiation safety measures apply. Don't operate the XRF with the enclosure open.
{{< /alert2 >}}


## Introduction {#introduction}

The lab's Thermo Scientific Niton XL3t Ultra is a portable X-ray fluorescence analyzer, or pXRF. It measures elemental concentrations in soil without dissolving the sample. You put a prepared puck over the measurement window, collect a spectrum, and the software turns that spectrum into a table of elements and concentrations.

This guide follows the lab's 2025 protocol, written by Michael Mackenzie and Percy Macek. It covers making pucks, running a session, and getting the data off the instrument.


## How the measurement works {#how-the-measurement-works}

The analyzer fires X-rays into the sample. These knock electrons out of inner atomic shells, and when other electrons drop in to fill the gaps, the atoms give off X-rays at energies specific to each element. The detector sorts those X-rays by energy and counts them. The software fits the resulting spectrum and uses its calibration to estimate concentrations.

What you get is total elemental concentration. An iron number won't tell you which minerals hold the iron, its oxidation state, or how much of it is available to plants. Carbon and nitrogen are too light to measure at all, so those still go to the CN analyzer. Thermo Fisher has a good [overview of XRF soil analysis](https://www.thermofisher.com/in/en/home/industrial/spectroscopy-elemental-isotope-analysis/materials-science-research/environmental-analysis/air-soil-analysis.html) if you want more on how it works.

The analyzer only sees a thin layer of soil against the film. Uneven grinding, moisture, and loose packing all show up in the result, which is why so much of this guide is about preparation. [EPA Method 6200](https://www.epa.gov/sites/production/files/2015-12/documents/6200.pdf) goes through these effects in detail.


## Before starting {#before-starting}

Only approved personnel run the XRF. If it's your first time, or it's been more than about two weeks, reread the relevant parts of the manual and the safety PDF.

Have the prepared pucks and sample list ready, along with the analyzer's power cord, the in-house standard pucks, the lab notebook, and a USB drive. Fill out the `Thermo Niton XRF X-Ray Log` on the bench between the instrument and the computer.

Check each puck before it goes near the analyzer. The film should be intact, soil should cover the whole face, and there shouldn't be loose powder on the outside. Set aside anything torn, leaking, or with a questionable label.

Keep unmeasured and completed samples in separate areas of the bench. A surprisingly large fraction of avoiding mistakes is making it difficult to pick up the wrong thing.


### What goes into a puck {#what-goes-into-a-puck}

The 2025 protocol takes a representative 25–30 g subsample and picks out roots, other biomass, and rocks larger than 2 mm. The subsample dries at 105 °C for 24–32 hours, then gets ground in a mortar and pestle until it's like flour. If you can still hear high-pitched scraping, keep grinding. Some soils have silica grains that won't grind down no matter what. Show those to someone more senior.

Before you mix a stored sample, check that nobody needs it for aggregate-size distribution (ASD). Homogenizing it in the bag wrecks the aggregates. Clean tools between samples with DI water and 70% ethanol, and let the ethanol evaporate. Any soil that jumps out of the mortar is contaminated, so throw it out.

Drying at 105 °C can drive off mercury. If you care about Hg, dry a separate portion at room temperature.

Each puck is 4 µm X-ray film pulled taut by the cup's outer ring. Soil fills the cup to about 5 mm below the top, with a 2.4 cm filter-paper disk on the soil and a ping-pong-ball-sized wad of poly stuffing under the lid to hold everything in place. Wear gloves, because skin oils and salts end up in the analysis, and keep your fingers off the film. The label goes on the lid, covering its hole. The protocol has photos of each step.

That 5 mm fill gives you _infinite thickness_: enough soil that adding more wouldn't send any more X-rays back to the detector.

Store pucks film-side down in the foam holder. Anywhere else, rest them film-side up.


## Start the analyzer {#start-the-analyzer}

1.  Slide the test stand's latch **right** to unlock it, lift the lid, and check the chamber for dust. If it's dirty, clean it with a Kimwipe, wiping outward from the measurement window. Close the lid and slide the latch **left** to lock it.
2.  Make sure the analyzer is locked into the stand, then plug in the power cord. The port is on the back, far right of the port bay. Run it on mains power. An older draft of the protocol warns that battery charge can affect results.
3.  Hold the power button, on the left of the button array under the screen, for 4–5 seconds until the screen lights up. Let it warm up for **five minutes**. Log into the computer and open NDTr in the meantime.
4.  Log into the analyzer. The default password is in the manual and on the reference sheet in the storage case.
5.  Select `System Check` from the main menu. If it reports errors, run it again. When it passes, select `Okay`.

Keep phones, smartwatches, and computer monitors at least two feet from the analyzer during System Check and measurements. Their radio emissions can interfere with both.

The four directional buttons move through the interface. The button to their right is _enter_, not back. The center of the directional pad is not a button. It looks like one, which is unhelpful.

`System Check` is the instrument checking itself. It won't tell you whether your soil numbers are right. That's what the standards are for.


## Connect to the computer {#connect-to-the-computer}

There are two similarly named programs, with different jobs:

| Program | Use it for                                             |
|---------|--------------------------------------------------------|
| `NDTr`  | Mirroring and operating the analyzer from the computer |
| `NDT`   | Downloading stored readings                            |

The XRF computer stays offline. A Windows update could break the instrument software, so don't connect it to the internet or update anything. Files leave by USB.

Windows greets you with a few popups when you log in. Choose `Ask me later` on `Windows Activation`, `Close` on `Optional update delivery is not working`, and `Okay` on `Mozy Pro Error`.

Open `NDTr` from the Start menu and maximize it. Close anything else that might be talking to the analyzer, including `NDT`. Once it connects, NDTr mirrors the analyzer's screen, and you can use the computer's mouse and keyboard for everything, including typing sample names.

If NDTr says `Unable to open COM6`:

1.  Select `Okay` and maximize NDTr so the toolbar shows. Open `Settings`, pick `COM6` (it may be listed as `Thermo Scientific NITON Analyzers USB Port`), and select `Connect`.
2.  If that doesn't work, open Device Manager, expand `Ports (COM & LPT)`, and note the COM number on the Thermo Scientific entry. Select that port in NDTr and connect. Windows can reassign the port after a cable or USB socket changes.


## Run a session {#run-a-session}


### Set the method {#set-the-method}

1.  From the main menu, open `Advanced`, then `Elemental Range`.
2.  Select `TestAll Geo` in the mode dropdown. Set each of the four filters, `Light`, `Low`, `Main`, and `High`, to `120.0` seconds, then select `Save`.
3.  In `Advanced`, open `Start/Stop`. Set `Max Time` to `480.0` seconds and save. Max Time has to equal the four filter times added up. If it's longer, the analyzer cycles back through the filters and some get more time than others.
4.  Select `Return`, then `Sample Type`, `Soils and Minerals`, and `TestAll Geo`.

Use TestAll Geo even though your samples are soil. It runs both the `Soils` calibration, which is built for elements under about 5,000 ppm, and the `Mining Cu/Zn` calibration, which handles higher concentrations. For each element it reports whichever gives the lower detection limit. The Mining calibration also lists Mg, Al, Si, and P, which `Soils` mode skips. Be suspicious of those. An older lab note and Thermo's own spec table both say the standard XL3t can't measure the lightest of them, so don't trust them until a standard backs them up.

Longer readings mean less error. According to the manual, quadrupling a filter's time halves its error. The 120 seconds per filter is the lab's choice. Whatever you use, keep it the same across a project.


### Bracket with standards {#bracket-with-standards}

Each session runs the in-house standards, then your unknowns, then the same standards again. Measure the standards exactly the way you measure samples, three repositioned readings and all.

Pick standards whose soil roughly matches yours. You won't know the clay mineralogy or organic matter of every sample, but choosing deep or shallow standards to match your samples gets you most of the way. Record the standards by ID.

Track each standard across sessions in `XRF-ProDev-TestAll Geo-Standards-Quality Assurance-120s.xlsx`. That's where drift shows up.

If a standard comes out well off its usual values, stop running unknowns and figure out why. Keep the bad reading in the record, and note which unknowns ran since the last good one.


### Load, name, and measure each sample {#load-name-and-measure-each-sample}

The `Info` tab shows the camera at the measurement window. In NDTr that area is blank, so select `Video` in the top toolbar to open the feed in its own window. The camera flips up and down, but not left and right.

1.  Unlock the stand and open the lid. With gloves on, hold the puck film-side down and use the camera to center it over the measurement window, then set it down.
2.  Lift it slightly, move it about 2 mm down and to the right, and set it back down. Close and lock the stand.
3.  Open `Data Entry` and select the keyboard icon next to `SAMPLE`. Enter the full sample ID followed by `#1`, then select `Return`. If the tabs disappear, the blue box with a yellow up arrow, usually in the bottom right, brings them back.
4.  Select `Start`. The reading takes **480 seconds**. Record the reading number, sample ID, and rep number in the notebook.
5.  When the summary page appears, unlock the stand, lift the puck, move it about 2 mm left, and set it down. Lock the stand, change the suffix to `#2`, and start the second reading.
6.  Do it once more with the puck moved about 2 mm up and to the right and the suffix `#3`.
7.  Put the puck back in storage, then close and lock the empty stand.

Don't look into the measurement window while the chamber is open.

To stop a reading early, select `Stop`. It takes a few seconds to end, and the analyzer keeps firing until it does. Note why you stopped it. If you rerun it, record the new reading number.

{{< alert2 Caution >}}
**Watch the film.** A torn puck drops soil onto the measurement window. If that happens, stop and clean the chamber before the next reading.
{{< /alert2 >}}

The three readings are three spots on the same puck. Keep all of them. If they disagree a lot, the puck is telling you something about its grinding or packing, so look at it before you average them. If you're curious why the lab moves the puck at all, `XRF – TestAll Geo – Standards – NM vs M Plots.xlsx` compares moved and unmoved readings.


## Download the data {#download-the-data}

The analyzer keeps every reading in its internal storage until you download it.

1.  Press `Escape` until you're back at the main menu, select `Log Off`, and close `NDTr`. Leave the analyzer on.
2.  Open `NDT` and maximize it. Select `Download > Download Readings`, then `Test`. A popup should say the hardware is communicating.
3.  Select `Query Readings` and scroll to the bottom of the list for the newest readings. Check every reading in your notebook, plus the two `System Check` readings from the start of the session.
4.  Set the destination to the `Shared Data` folder, found at the bottom of the list behind the `...` button. Name the file `YYYYMMDD_Grant_Site_` followed by the collection date, like `20250211_CZNet_R8_H-R_Oct2021Samples`. Leave `#` out of the filename. NDT throws an error on it.
5.  Check `Simultaneous Download to MS Excel` and select `Download`. When the progress bar fills, select `Disconnect`, then `Done`.
6.  Excel opens with the data. `Save As` a `.csv`, then close both files.

You should now have three files in `Shared Data`: `.ndt`, `.xls`, and `.csv`. Open the CSV and check that every reading number and sample ID from your notebook made it, standards and repeats included. Excel likes to turn sample IDs into dates, so watch for that.

Copy all three files to the USB drive and eject it. Upload them to SharePoint from a computer with internet.


## Reading the results {#reading-the-results}

1 ppm is 1 mg/kg, and 1% is 10,000 mg/kg.

A below-detection result isn't zero. Keep the `<LOD` flag and the reported limit with it. The error the analyzer reports comes from counting statistics, so it says nothing about grinding, labeling, or calibration.

Check the repeats and the standards before comparing soils. Repeats can agree beautifully and still be biased, and the standards are how you'd find out. XRF measures total concentration, so don't expect it to match an acid digestion or extraction.


## After the session {#after-the-session}

Log out of the computer. Make sure the stand is empty, closed, and locked. Hold the analyzer's power button for 5–6 seconds to shut it down, then unplug it. Finish the X-ray log, including anything that went wrong.


## Troubleshooting {#troubleshooting}

| Problem                                | Check                                                                                                             |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| NDTr or NDT won't connect              | Close the other program, check the cable, and match the COM port in Device Manager.                               |
| The analyzer won't start a reading     | Read the message on screen. Check that you're logged in, System Check passed, and the stand is closed and locked. |
| The three readings disagree            | Check the film and that soil covers the whole face. Uneven grinding or packing shows up here.                     |
| A standard is off                      | Check that it's the right puck, mode, and timing. Don't run more unknowns until it's sorted out.                  |
| A puck leaks or the film tears         | Stop, remove the puck, and clean the chamber before continuing.                                                   |
| Readings are missing from the download | Scroll the whole list in `Query Readings` and check the boxes against your notebook.                              |


## Further reading {#further-reading}

-   `XRF Protocol_2025.docx`, Michael Mackenzie and Percy Macek, February 2025. The lab's protocol and the source for this guide, in `Billings Lab/XRF work/XRF Protocol/Methods`. It has photos of puck assembly.
-   The XL3 user guide. The protocol calls it `Manual-XL3-Series-v7.0.11` and cites version 7.0.1, Revision C, from November 2010. The puck preparation is adapted from its page 155.
-   [Knight, Kjarsgaard &amp; Russell (2021)](https://doi.org/10.1016/j.apgeochem.2021.105026), _An analytical protocol for determining the elemental chemistry of Quaternary sediments using a portable X-ray fluorescence spectrometer_, Applied Geochemistry. The lab's session structure and standards are roughly based on its section 7.2.
-   `Certificates of Analysis for XRF Standards`, in the same folder as the protocol.
-   [EPA Method 6200](https://www.epa.gov/sites/production/files/2015-12/documents/6200.pdf), on soil and sediment XRF, interferences, preparation, and quality control.
-   [Thermo Fisher's Niton data-download instructions](https://documents.thermofisher.com/TFS-Assets/CAD/Instructions/downloading-data-xrf-analyzer.pdf).
-   [Assessment of the Effect of Soil Sample Preparation, Water Content and Excitation Time on Proximal X-ray Fluorescence Sensing](https://pmc.ncbi.nlm.nih.gov/articles/PMC9230696/), on how preparation and measurement time change results.
