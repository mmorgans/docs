+++
title = "Analyzing soil with an XRF"
date = 2024-10-21T08:56:00+08:00
draft = false
+++

{{< alert2 Warning >}}
**This instrument produces ionizing radiation.** Usual radiation safety measures apply. Don't operate the XRF with the enclosure open.
{{< /alert2 >}}


## Introduction {#introduction}

The lab's Thermo Scientific Niton XL3t Ultra is a portable X-ray fluorescence analyzer, or pXRF. It measures elemental concentrations in soil without dissolving the sample. Put a prepared sample over the measurement window, collect a spectrum, and the software translates that spectrum into a table of elements and concentrations.


## How the measurement works {#how-the-measurement-works}

The instrument directs X-rays into the sample. These can eject electrons from inner atomic shells; when other electrons fill the vacancies, the atoms release X-rays with energies characteristic of their elements. The detector measures those energies and how many photons arrive. The software fits the resulting spectrum and uses its calibration to estimate concentrations.

This is an _elemental_ measurement, not a mineral identification or an extraction. A reported iron concentration does not tell you which minerals contain the iron, its oxidation state, or how much is available to plants. Nor does this setup replace a carbon and nitrogen analyzer. The elements you can measure usefully depend on the instrument, method, and sample. See Thermo Fisher's [overview of XRF soil analysis](https://www.thermofisher.com/in/en/home/industrial/spectroscopy-elemental-isotope-analysis/materials-science-research/environmental-analysis/air-soil-analysis.html) for the measurement principle.

The analyzer also sees only the material within its measurement area and effective sampling depth, not the entire cup. Uneven grinding, moisture, and a poorly presented surface can change the result. Consistent preparation is part of the measurement, not housekeeping; [EPA Method 6200](https://www.epa.gov/sites/production/files/2015-12/documents/6200.pdf) discusses these effects in detail.


## Before starting {#before-starting}

Have the prepared samples and sample list ready, along with the analyzer's power supply, PC connection cable, in-house standard pucks, lab notebook, and an approved USB drive. Fill out the `Thermo Niton XRF X-Ray Log` kept between the instrument and computer. Check that the stand, latch, and safety features are intact. If the enclosure will not close properly or a safety indicator behaves unexpectedly, stop and tell the instrument's maintainer.

Inspect each puck before putting it near the analyzer. The film should be intact, the measurement face evenly covered by soil, and the outside free of loose powder. Set aside cups with torn film, leaks, or uncertain labels. Keep labels and ink off the measurement face, and use the same approved film and preparation procedure throughout the batch.

Keep unmeasured and completed samples in separate areas of the bench. A surprisingly large fraction of avoiding mistakes is making it difficult to pick up the wrong thing.


### What goes into a puck {#what-goes-into-a-puck}

The 2025 preparation procedure starts with a representative 25-30 g subsample, removes roots and other biomass along with rocks larger than 2 mm, dries it at 105 degrees C for 24-32 hours, and grinds it with a mortar and pestle to a flour-like consistency. These are project preparation choices, not a prescription for every analyte. Confirm that this drying treatment suits the elements you intend to report before applying it to a new project.

Do not homogenize a stored sample until you know whether it is still needed for aggregate-size distribution work. Grinding and mixing are irreversible even though the XRF measurement itself is nondestructive. Clean tools between samples, let cleaning liquids evaporate, and discard soil spilled onto the bench rather than putting it back.

The documented puck uses 4-micrometer X-ray film, held taut by the cup's outer ring. Soil fills the cup to about 5 mm below the top; a 2.4 cm filter-paper disk and polyester stuffing hold it in place beneath the lid. Use the approved film stock, not an arbitrary plastic of similar thickness. Wear gloves, keep fingers off the film, and put the label on the lid, not the measurement face. The illustrated assembly instructions are in `XRF Protocol_2025.docx`.

Enough soil must be present that adding more depth would not appreciably change the result, often called _infinite thickness_. That depth depends on the material and element. The prescribed fill level is a preparation target, not proof that every element meets that condition. Use the fitted storage holder to protect the film; on an ordinary bench, rest the puck film-side up.


### Decide on the measurement settings {#decide-on-the-measurement-settings}

Before running the batch, confirm the lab's established soil mode, measurement duration, replicate plan, and quality-control acceptance limits. Record them with the instrument ID and sample-preparation details. If the method uses several filters or beam conditions, record their timing as well; a total duration alone may not describe the measurement.

Longer measurements generally improve counting precision and detection limits, but they cannot fix a mislabeled sample or unsuitable calibration. If no validated method exists for your samples, work with the instrument's maintainer to establish the duration using reference materials and repeat measurements at the concentrations you care about. Then keep it consistent. A [study of soil preparation, moisture, and excitation time](https://pmc.ncbi.nlm.nih.gov/articles/PMC9230696/) illustrates why the benefit depends on both the sample and the element.


## Start the analyzer {#start-the-analyzer}

1.  Check that the analyzer is secured in the test stand and that the sample chamber is clean. With emission off, slide the latch **right to unlock** and lift the lid. Close the lid and slide the latch **left to lock**. If the measurement window is contaminated, have it assessed rather than wiping it experimentally.
2.  Connect the analyzer's power supply at the rear port, on the far right of the port bay. The 2025 bench procedure uses mains power rather than relying on the battery.
3.  Hold the power button to the left of the button array for about 4-5 seconds, until the screen lights up. Allow **five minutes** for stabilization. You can log into the computer and open NDTr during this time.
4.  Log into the analyzer with the lab's credentials. After warmup, select `System Check` from the main menu with the stand secured, and follow the instrument's prompts.
5.  Confirm that the check passes before proceeding, then select `Okay` to return to the main menu. Record a failure and investigate it rather than repeatedly dismissing it.

The local protocol keeps phones, smartwatches, and other potential electromagnetic-interference sources at least two feet from the analyzer during System Check and measurements. Keep the bench arrangement consistent; that separation is an interference precaution, not a radiation exclusion distance.

The four directional buttons move through the interface. The button to their right is _enter_, not back. The center of the directional pad is not a button. It looks like one, which is unhelpful.

`System Check` is an instrument check or standardization, not proof that the soil results are accurate. You still need to measure a suitable reference material using the same method as your samples.


## Connect to the computer {#connect-to-the-computer}

There are two similarly named programs, with different jobs:

| Program | Use it for                                             |
|---------|--------------------------------------------------------|
| `NDTr`  | Mirroring and operating the analyzer from the computer |
| `NDT`   | Downloading stored readings and working with reports   |

Connect the analyzer to the computer using its usual cable, then open `NDTr` from the Start menu. Close other programs that may be using the analyzer's connection. When connected, NDTr should show the instrument's screen and let you enter sample names with the computer keyboard.

Keep the dedicated XRF computer offline, as specified by the lab protocol. Do not connect it to the internet or update the instrument software to troubleshoot a session. Transfer files using the lab's approved USB workflow instead.

The original lab setup used `COM6`. Windows can assign a different port after a cable, adapter, or USB socket changes, so use the port actually assigned to the analyzer. If NDTr does not connect:

1.  Check that the analyzer is powered on and the cable is connected at both ends.
2.  Close `NDT` and any other instance of `NDTr`.
3.  Open Windows Device Manager and look under `Ports (COM & LPT)` for the analyzer or its serial adapter. Note the COM number. If it is missing or marked with a warning, resolve the cable or driver problem first.
4.  Maximize NDTr if its settings button is hidden, then select that COM port in its connection settings and reconnect.


## Run a batch {#run-a-batch}


### Select the method and check the instrument {#select-the-method-and-check-the-instrument}

Set the method before loading the first standard:

1.  From the main menu, open `Advanced`, then `Elemental Range`.
2.  Select `TestAll Geo` in the mode dropdown. Set each of the four filters, `Light`, `Low`, `Main`, and `High`, to `120.0` seconds, then select `Save`.
3.  In `Advanced`, open `Start/Stop`. Set `Max Time` to `480.0` seconds and save. This equals the sum of the four filter times; changing one without the other can change the acquisition.
4.  Return to the main menu. Select `Sample Type`, then `Soils and Minerals`, then **TestAll Geo**.

Do not substitute `Soils` mode because the sample happens to be soil. The 2025 method specifies TestAll Geo, which the protocol describes as combining the Soils and Mining calibrations. Different modes can produce different results; record the selected mode with the data.

The local session chart brackets the unknowns with three in-house standards: **standards 1-3, unknown samples, then standards 1-3 again**. Apply the same three-reading, repositioned procedure to standards and unknowns. Choose the actual standards with the project lead so their matrices reasonably resemble the samples, and record their IDs rather than simply writing "standard 1."

In-house controls track repeatability and drift. They establish accuracy only to the extent that they have independently assigned values. Use the project's required blanks and matrix-appropriate certified reference materials as well, with documented acceptance limits. The protocol names `XRF-ProDev-TestAll Geo-Standards-Quality Assurance-120s.xlsx` as the template for tracking standards over time; obtain that record and the applicable criteria before running the batch.

If a check fails, pause the batch. Check the mode, presentation, and sample identity, then follow the lab's corrective procedure. Keep the failed reading and identify which unknowns were measured since the last passing check. Do not quietly delete the inconvenient result and carry on.


### Load, name, and measure each sample {#load-name-and-measure-each-sample}

The `Info` tab shows the measurement-window camera on the instrument. If that area is blank in NDTr, select `Video` in the top toolbar to open a separate camera window. The protocol notes that the camera reverses up and down, but not left and right. Use it to check coverage, never by looking into the measurement window.

1.  Confirm that the preceding measurement has ended and the X-ray-on indicator is off. Slide the latch right and open the lid.
2.  With gloved hands, place the puck **film-side down** and center it over the aperture using the camera. Lift it slightly and offset it about 2 mm down and right for the first position. Keep the soil-filled face covering the aperture; lift rather than drag the film. Follow the demonstrated bench orientation for these moves, accounting for the camera's reversed vertical view.
3.  Close the lid and slide the latch left to lock it. Keep your hands outside the enclosure.
4.  Open `Data Entry` and select the keyboard icon beside `SAMPLE`. Enter the full sample ID followed by `#1`, then select `Return`. Compare it with the puck's label. If the tabs disappear, the blue box with a yellow upward arrow restores them.
5.  Select `Start` in NDTr. Let the full **480-second** reading finish. This is a software-started measurement, not a ten-second trigger hold.
6.  Check the summary's ID, reading number, acquisition time, and warnings. Record the reading number, sample ID, and replicate number in the notebook.
7.  After confirming emission has stopped, unlock and open the stand. Lift the puck, move it about 2 mm left from the first position, and set it down. Check coverage, close and lock the stand, change the suffix to `#2`, and repeat the full reading.
8.  After the second reading and confirmation that emission has stopped, lift the puck and move it about 2 mm up and right from the second position. Check coverage, secure the stand, update the suffix to `#3`, and take the third reading.
9.  Once the third reading is complete and emission is off, remove the puck and return it to its protective holder or the completed-sample area, film-side up if resting on the bench.

To interrupt a reading, select `Stop` and wait for acquisition to end and the emission indicator to turn off before opening the stand. Record why it was stopped and retain it as a flagged record. Completing this method requires three full readings; an interrupted run does not count as one of them. Resolve the reason for stopping before repeating it, and record the replacement reading number.

If a measurement fails to stop or the X-ray-on indicator stays on, keep the enclosure closed. Follow the instrument's approved emergency procedure and contact the radiation-safety lead; do not open the stand to investigate.

{{< alert2 Caution >}}
**Protect both windows.** The sample film keeps soil in the puck; the analyzer window protects the instrument. A torn cup can turn one spoiled sample into an instrument-cleaning problem. If soil spills onto the analyzer, stop and follow its approved cleaning procedure. Do not poke or wipe the window experimentally.
{{< /alert2 >}}

These are three positions on one prepared puck, not three independently prepared samples. Keep all three readings. Repositioning tests local variation as well as instrumental repeatability; averaging should not hide a large disagreement. If you also prepare a second cup or scan without moving, label those separately.


## Download and verify the data {#download-and-verify-the-data}

Run the batch's final quality checks before downloading so their readings are included. Keep the analyzer powered on and connected during the transfer.

1.  In `NDTr`, return to the main menu with `Escape`, log off the analyzer interface, disconnect if still connected, and close the program. Logging off is not powering off.
2.  Open `NDT`, then `Download > Download Readings`. Select the current COM port and use `Test` to check communication. Connect if the dialog requires it, then select `Query Readings`.
3.  Select every reading in the batch notebook, not simply the last group in the list. Include the standards, blanks, replicates, and interrupted runs, plus the two System Check readings described by the local protocol.
4.  Set the destination to the computer's `Shared Data` folder. Use a filename beginning `YYYYMMDD_Grant_Site_`, followed by the collection date or other identifying information. Enable `Simultaneous Download to MS Excel` and select `Download`. Wait for completion and check for skipped-reading or transfer errors, then select `Disconnect` and `Done`.
5.  Reopen the saved report in NDT. Reconcile every reading number and sample ID with the batch record, including the quality checks and replicates. Look for omissions and duplicates, not just a matching total.

The local protocol retains three files: the native `.ndt` download, an Excel `.xls` copy, and a `.csv`. Save the Excel copy, then use `Save As` to create the CSV and confirm that all three files are in `Shared Data`. Thermo Fisher's [download instructions](https://documents.thermofisher.com/TFS-Assets/CAD/Instructions/downloading-data-xrf-analyzer.pdf) also describe direct CSV options. Renaming an NDT file to CSV is not conversion.

Open the CSV before leaving the bench. Verify sample names, units, timestamps, measurement times, and the uncertainty or detection-limit fields available in your report. Import IDs as text if Excel would otherwise remove leading zeros or turn them into dates. Keep an untouched export alongside your working spreadsheet, and back up the native file and export before deleting anything from the analyzer.

Copy all three files to the approved USB drive and safely eject it. On an internet-connected computer, transfer them to the project's SharePoint location and verify the uploaded copies. Leave the acquisition computer offline.


## Reading the results {#reading-the-results}

Check the column headings before interpreting the numbers. For mass concentrations, `1 ppm = 1 mg/kg` and `1% = 10,000 mg/kg`. Those equalities do not establish whether a result is on a dry-mass basis; that depends on sample preparation and the method. Keep that information with the dataset.

A below-detection result is not a measured zero. Preserve its qualifier and reported limit. Similarly, the instrument's displayed uncertainty does not capture everything that could have gone wrong during sampling, grinding, labeling, or calibration.

Compare replicate agreement and reference-material performance before interpreting differences between soils. Agreement between repeats is useful, but a consistently biased result can also repeat beautifully. For decisions requiring confirmation, use the laboratory method and confirmation plan appropriate to the project rather than assuming the XRF and an acid extraction measure exactly the same thing.


## After the session {#after-the-session}

Once the final checks and downloads are complete, disconnect the software and log out of the computer. With emission stopped, remove the last sample, close the stand, and hold the analyzer's power button for about 5-6 seconds to shut it down. Confirm shutdown before unplugging its power supply. Store the instrument securely and leave the stand and bench clean. Complete the session log, including any failed checks, damaged cups, or connection problems.


## Troubleshooting {#troubleshooting}

| Problem                                       | First checks                                                                                                                                                                                |
|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NDTr or NDT cannot connect                    | Close the other program, check the cable and power, and match the assigned COM port.                                                                                                        |
| The analyzer will not start a measurement     | Read the displayed message; check the authorized login, mains supply and power connection, completed system check, and properly closed stand. Never bypass a safety control to make it run. |
| Readings change when the puck is repositioned | Inspect the film and sample coverage; review preparation and heterogeneity before averaging the disagreement away.                                                                          |
| A reference material fails                    | Confirm its identity, assigned values, method, timing, and presentation. Pause unknowns until the failure is resolved.                                                                      |
| A cup leaks or film tears                     | Stop, remove it only after emission ends, and have any contamination assessed before continuing.                                                                                            |
| Readings are missing from the download        | Check the selected reading range, reading-type filters, destination file, and transfer errors against the instrument's stored list.                                                         |


## Further reading {#further-reading}

-   `XRF Protocol_2025.docx`, Michael Mackenzie and Percy Macek, February 2025: the primary local source for preparation, TestAll Geo settings, repositioned readings, and data handling. It is in `Billings Lab/XRF work/XRF Protocol/Methods`.
-   `Manual-XL3-Series-v7.0.11` is the manual filename named by the local protocol; its bibliography gives an XL3 guide version of 7.0.1, Revision C. Check the actual manual against the installed software before using model-specific reference tables.
-   The `Certificates of Analysis for XRF Standards` folder contains reference documentation. Match certificates to the material and lot actually used; a generic detection-limit table is not a measured detection limit for every soil.
-   [EPA Method 6200](https://www.epa.gov/sites/production/files/2015-12/documents/6200.pdf): soil and sediment XRF, interferences, preparation, and quality control. It is method guidance, not a substitute for the manual for this analyzer.
-   [Thermo Fisher's Niton data-download instructions](https://documents.thermofisher.com/TFS-Assets/CAD/Instructions/downloading-data-xrf-analyzer.pdf): connection testing, reading selection, and saving reports.
-   [Assessment of the Effect of Soil Sample Preparation, Water Content and Excitation Time on Proximal X-ray Fluorescence Sensing](https://pmc.ncbi.nlm.nih.gov/articles/PMC9230696/): experimental evidence for the effects of preparation and measurement duration.
