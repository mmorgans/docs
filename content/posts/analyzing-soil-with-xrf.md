+++
title = "Analyzing soil with a XRF"
date = 2024-10-21T08:56:00-05:00
draft = false
+++

_Note: This article is a draft and will be modified._

**Warning**: The XRF emits X-rays up to 50kV. Improper use can and will cause serious, long term harm to your health. Follow all safety protocols including those beyond this article.


## Introduction {#introduction}

This article assumes you already are in possession of pucks of finely ground soil.


## Procedure {#procedure}

1.  **Prepare the XRF Analyzer**
    -   Take the battery from the charger and insert it into the back of the XRF.
        -   Note that a good amount of force is required to latch the battery into place.
    -   Power on the XRF by holding the power button on the left of the front for about 3 seconds.
    -   Wait for the system to boot.
    -   Log into the device using the password.
    -   The four directional buttons are used to select items on the interface.
    -   The button to the right of the pad is the enter or confirm button, not a back button.
    -   The center of the pad is not a button, which is incredibly unintuitive and confused me for an unbelievably long period of time.
    -   From the main menu, select `System Check` to calibrate the scanner.

2.  **Connect the XRF to a Computer**
    -   Open the `NDTr` software from the start menu on the desktop. It should automatically connect to the XRF and mirror the device’s screen on the computer.
        -   If it doesn't, try some of the following.
        -   The software should be the _only_ XRF-related piece of software open. If something else is open trying to communicate with the scanner, it won't work.
        -   The scanner should be communicating on COM6. To ensure this is the case or to change it:
            -   Maximize the window with the window decoration controls (e.g. _ □ ☒)
            -   Click the now visible settings button.
            -   Change the COM port to 6.
            -   If it still won't work, ensure that the XRF is actually communicating on COM6.
                -   Open Device Manager (search in start menu), and under "Universal Serial Bus", look for the scanner. Note the COM port.

3.  **Prepare and Name the Samples**
    -   Slide the latch on the XRF stand to the right and open the lid.
    -   Place your sample puck on the XRF with the film side facing down.
    -   Close the lid and lock it by sliding the latch back to the right.
    -   Navigate to the `Sample Type` menu and select `Soils and Minerals`, then choose `Soils`.
    -   Navigate to `Data Entry`, and click the glyph of the keyboard to enter the sample's name.
        -   Note that you can use the computer's keyboard to type.

4.  **Perform the Scan**
    -   Ensure that the sample is centered on the sensor and that the lid is locked, then press and hold the trigger. The XRF will scan as long as you are holding the trigger, up to 10 seconds.
        -   Ensure you hold the trigger for the same amount of time for all samples in a batch.
        -   The longer the scan, the more accurate the results are, although scanning for more than 5 seconds is essentially redundant.
    -   After the scan completes, open the lid and remove the sample, placing it on the lab bench film-side up.
        -   Note: placing the sample film side down can easily destroy the puck.
    -   Press the return key on the computer keyboard.
    -   Enter a new sample name, and continue with the next sample.

5.  **Download the Data from the XRF**
    -   Once all samples have been scanned, click the `Disconnect` button on the computer and close the `NDTr` software.
    -   Open the `NDT` software. The XRF should be connected to COM6.
    -   Click `Test` to verify the connection. If successful, click `Query Readings` to retrieve the data from the XRF.
    -   Scroll to the bottom of the readings list, select the samples you need, name the file, and click `Download` to save the data.
    -   .ndt files can be opened in Excel or your text editor of choice.
