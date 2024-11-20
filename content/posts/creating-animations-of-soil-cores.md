+++
title = "Creating animations of soil cores out of CT scans"
date = 2024-11-20T13:53:00-06:00
draft = false
+++

## Introduction {#introduction}

Goal: To create animations of soil cores spinning from .vol files obtained from the Pacific Northwest National Laboratory.

We're getting our files from the Environmental Molecular Sciences Laboratory at the Pacific Northwest National Laboratory, who have scanned the soil cores with a Nikon XTH CT scanner.


## Requirements {#requirements}

-   .vol files from a CT scanner
-   At least 16gb of memory
    -   [Ideally more](https://downloadmoreram.com/). Both Fiji and Dragonfly attempt to load the entire file into memory; the downloaded .vol is almost 40gb.
-   [Dragonfly from Comet Software](https://dragonfly.comet.tech/). You'll need a license: [30 day free trials](https://www.theobjects.com/dragonfly/get-trial-version-request-comet.php) are easily accessible, and [non commercial licenses are available](https://dragonfly.comet.tech/en/non-commercial-licensing).
-   [Fiji](https://fiji.sc/) or ImageJ, but use Fiji.
-   A windows or Linux machine to run Dragonfly on; everything but that can be done on Mac


## TL;DR {#tl-dr}

-   Download .vol files from [EMSL Data portal](https://sc-data.emsl.pnnl.gov/#state=32f73ab7-1755-4bad-8f02-a5640adf3a1a&session_state=0f3eb580-fa1b-48b2-aed4-6eefcad788f9&code=6f48e754-f383-442b-884b-f7222be36fbe.0f3eb580-fa1b-48b2-aed4-6eefcad788f9.21cf84f6-6ada-4d20-8b12-72f0a3e0bce3)
-   Import the files into Fiji as raw data, 2000x2000x2000
    -   Convert to 8-bit, save as .tiff
-   Open the .tiff in Dragonfly, crop to slices 250-1800
    -   Make a cylindrical mask to crop the garbage off the core
    -   Use movie maker to make a rotating movie, export to .avi
-   Use Handbrake or similar to convert to mp4
-   Use Final Cut Pro or similar to crop to square
-   Use Gifski to convert to reasonably sized gif


## Getting .vol files from EMSL data portal {#getting-dot-vol-files-from-emsl-data-portal}


### Selecting cores {#selecting-cores}

To start, we need to get the CT scan files from EMSL, provided as .vol files.

-   Navigate to the [EMSL data portal](https://sc-data.emsl.pnnl.gov/#state=32f73ab7-1755-4bad-8f02-a5640adf3a1a&session_state=0f3eb580-fa1b-48b2-aed4-6eefcad788f9&code=6f48e754-f383-442b-884b-f7222be36fbe.0f3eb580-fa1b-48b2-aed4-6eefcad788f9.21cf84f6-6ada-4d20-8b12-72f0a3e0bce3), and login.
-   On the left hand side of the screen, open the "Project" drawer and scroll down to the "Principle Investigator" field.
-   Enter the first few characters of a name, and then check the cooresponding box.
-   The main panel should update with the relevant project.
-   Scroll down to the "Select Datasets" button, and click it.

You should now see a list of the datasets associated with that project. In this example, we're looking for individually numbered soil cores, but you will note that none of the data are labeled.

If you have a specific core number in mind, the only way to locate it is by looking inside of every single dataset by clicking the "DOI" button next to the Upload ID. You can then see the individual file names, which include the soil core number. If you decide to embark on a search to find a soil core, I recommend sorting by Instrument to only see XCT data, and then sort by file size. You are looking for datasets that are 29.8GB. Only view 10 datasets per page, as when you exit the DOI file viewer the entire webpage snaps to the top; it's easier to keep track of where you are when there are only 10 items.

Once you find the core you want, note the Upload ID. To search for an ID you already know, set Items per page to All, and use cmd + f.

Some known core ID's:

| Core # | Bottom  | Top     |
|--------|---------|---------|
| 1      | 3132984 |         |
| 2      | 3134562 |         |
| 5      | 3135086 |         |
| 6      | 3135290 |         |
| 7      | 3049610 |         |
| 10     | 3133330 |         |
| 11     | 3051409 | 3051495 |
| 15     | 3010819 | 3010713 |
| 16     | 3011663 | 3013268 |
| 20     | 3010658 | 3010660 |

Some notes:

-   Each core is 30cm tall, and the bottom 10cm and top 10cm were scanned.
-   Core height
-   2000 slices, how much is each slice
-   Some cores (Listed above: 1 &amp; 6) are difficult to use because they were sampled on a hill or something and its like just dirt and air


### Downloading cores {#downloading-cores}

Add each dataset to your cart by checking the box next to it. To download the cores, you will need to set up and use Globus I realllly do not want to detail how to do that

Once EMSL prepares the files, you will see a link to go to the created guest collection. Open it, and navigate to your endpoint (computer) on the pane without the .tar in it. Go to the folder where you want the files to be downloaded to. Once there, select the tar on the other pane, hit "Transfer or Sync to..." in the middle, and then click start above the pane.

Globus will start transferring the file. You should get an email when its done. For reference, a 96GB transfer took a little over three and a half hours.


## Initial .vol work in Fiji {#initial-dot-vol-work-in-fiji}

Unzip the tarball, and navigate through the mess of folders inside to get to the .vol files (each should be around 30GB). I recommend moving the .vols into their own folder, separate from the tarball's filesystem, because it's obnoxious to have to go 30 directories deep to get to them.

Notes:

-   Each .vol has a corresponding .vgi that contains metadata about the .vol. Open it in a text editor if you want to know more.
-   There are a number of other derived products in the tar, namely still images of the core and csv files with data (notably porosity).

Each .vol contains 2000 images, each of which is 2000x2000 pixels, totalling **8 billion voxels**, each of which is represented as a 32-bit floating-point number and saved in an uncompressed file. This makes the raw files wildly impractical to work with, hence the use of Fiji. The goal is to convert each file to 8-bit and save it as a .tiff, both of which should drastically reduce the size while losing no useable data.

Open Fiji, and use File &gt; Import &gt; Raw... to open the .vol.

-   Image type: 32-bit Real
-   Width: 2000
-   Height: 2000
-   Offset: 0
-   Number of images: 2000
-   Gap: 0

Check Little-endian byte order and Use virtual stack. Virtual stacks load the images without fully committing them to memory, making it possible to view datasets that are larger in size than the amount of memory you have. **If you don't have at least 40GB of memory and don't use virtual stacks, Fiji will crash your system attempting to load the file.**

Fiji will open the file, and you should be able to scroll through the slices of the core, or use the scroll bar at the bottom of the window containing the core.

To convert the file to 8-bit, use Image &gt; Type &gt; 8-bit. This will take time: you should be able to see Fiji converting images by the hundreds on the main toolbar.

You should now have an updated view of the core; notice the reduced file size displayed in the window title. To save as a .tiff, use File &gt; Save as &gt; Tiff...


## Working in Dragonfly {#working-in-dragonfly}


### Loading &amp; masking {#loading-and-masking}

In Dragonfly, open the newly created .tiff file with File &gt; Import Image Files... . Click the Add... button, then select the file. Click Next in the bottom right.

The fields on this screen should be correct. Ensure that the Total size (on right, under Information) is less than the amount of memory you have.

Click Crop Image... and preview the image of the soil core. If the core doesn't take up most of the frame, crop it by dragging the green dotted edges or corners inward.

In the Crop Image... window, crop the image to slices 250-1800. Under the Cropping slider, enter 250 in the first field and 1800 in the second. Click OK.

Click Finish. After loading, you should see four views of the core: a 3D render and three orthogonal views. You can maximize a pane by double clicking, and you can move the 3D view by clicking and dragging in its pane. Double click again to return to all four views.

Notice the "fuzziness" or garbage data visible in the 3D view (most visible looking top down, around the edges). To remove this data, we need to create a cylindrical mask.

At the top of the 3D view, there is a row of buttons under the Shapes bar. Click the cylinder button, the third from the left - note the capsule button right next to the cylinder button.

You should see a wireframe cylinder insdie of the soil core. Using one of the side orthogonal views, drag the green lines outward, and stop when you hit the garbage data.

You should see the cylinder on the other views increasing and get a sense of what you're doing. Everything outside the cylinder will be excluded.

On the right hand side of the screen, you should see a list of the objects loaded: the core and the cylinder. Click on the cylinder, and look under Shape properties, Visual effects, Visuals. Check the box next to the core. Check "Outside", then under 3D effects, "Clip". You should see the 3D view update to exclude anything outside the cylinder.


### Animating {#animating}

Right click the 3D view and select Show Movie Maker. Double click the 3D view pane to maximize it. You'll need to position the 3D view to be what you want the video to look like: I position the core straight on, with the camera slightly raised above it at an angle so the top is visible.

Click and drag to manipulate the core, and click and hold the middle mouse button and move your cursor up and down to zoom in and out. To physically move the core in the 3D space, press x on your keyboard and click and drag. Make sure to press escape when you are done moving it to return to the default track tool.

Once you've positioned the core, look at the timeline near the bottom of the screen. At the 00:00 mark, you should see a square with a picture of the core in it. Right click it, and select "Update key frame".

To actually rotate the core, click the "Rotate" button above the timeline. Choose one of the two right-most options (I use clockwise), and select "Rotate around the object's axis". A second image, or keyframe, should appear on the timeline. Drag this second keyframe out to around the 20 second mark, or however long you want the video to be.

The original keyframe is where the animation will start, and the ending keyframe is exactly the same except that the core has been rotated 360 degrees. Dragonfly interpolates the motion in between the keyframes, so by dragging the 2nd keyframe further out along the timeline you are causing the core to spin slower.

You can drag the green bar marker along the timeline to preview the animation, or click the play symbol above the timeline. Note that the animation likely will not play at full speed, as it's rendering in real time.

To change the color of the background to a solid white, click the "Scene's Views Properties" bar in the left list of toolbars. Near-ish the top is a button next to "Background color". In the window, you'll want to select "Uniform" under mode, and then click the button next to "Color 1" in the Color section on the right. In the color picker, drag the right mode slider up from black to white, and click OK, then OK. You should see the updated background.

To export the animation, click the "Export animation" symbol above the timeline, immediately next to the start / beginning symbol. Set the FPS to 60, the Dimensions preset to 1920x1080, and the bitrate to High. Click Save as Video File. Once you've given a name and location for the file, Dragonfly will render and export the animation as an .avi file.


## Working with .avi video files. {#working-with-dot-avi-video-files-dot}


## Ideas maybe {#ideas-maybe}

-   Make little gif animations


## GIFS: {#gifs}

-   GLOBUS transfer
-   fiji import dialogue
-   fiji converting to 8-bit
-   dragonfly import
-   dragonfly cropping
-   adjusting cylinder
-   outside, visual effects, clip
-   dragging keyframe
-   export animation from dragonfly
-

<!--listend-->

-   Screen recordings of dragonfly might be much easier to digest than explaining the ii over text
-


## Soil cores {#soil-cores}

-   Cores from EMSL data portal
    -   11, 15 AND 16, 20. Bottom if needed to choose
        -   15 bot: 3010819 top: 3010713
        -   16 bot: 3011663 top: 3013268
        -   11 bot: 3051409 top: 3051495
        -   20 bot: 3010658 top: 3010660
        -   1 bot: 3132984
            -   Had issues: use 2 bot: 3134562
        -   5 bot: 3135086
        -   6 bot: 3135290
            -   Had issues that might make me use 7 bot: 3049610
        -   10 bot: 3133330

            Made gifs for 11, 15, 16, 20.
            Need to make gifs for: 2, 5, 7, 10

    -   11/8 update downloaded 2, 7. Now making gifs of those and finalizing gifs of others
