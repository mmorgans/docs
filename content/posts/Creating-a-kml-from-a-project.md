+++
title = "Creating a .kml file from a Google Earth project"
date = 2024-08-15T12:39:00-05:00
draft = false
+++

## Introduction {#introduction}

"Keyhole Markup Language"

.kml files are useful for a number of reasons, namely storing pins, locations, polygons, images, and other GIS info. One of the easiest ways to make them is with Google Earth.

You can approach this in a couple of ways. Both the [Earth website](https://earth.google.com) and the [Google Earth Pro desktop app](https://www.google.com/earth/about/versions/) are usable.


## Google Earth Web {#google-earth-web}

1.  Open [Google Earth](https://earth.google.com) in a browser.
2.  Open the left hand side bar. It's a little arrow in the middle of the left edge.
3.  Click the "+ New" button, select "Local KML file", and click "Create".
4.  You should see a new section, "Local KML files", and your new project, "Untitled".
    -   You can rename the project by clicking on the kebab menu while hovering on it, and clicking "Rename".
5.  Click on the project to select it.
6.  To add a location to the project, navigate to it, and then click the "Save to project" button that appears in the card.
    -   Alternatively, you can use the pin / placemark tool (first on the left in the toolbar) and it will be automatically added to the selected project.
    -   You can rename the pin / placemark by either doing so when you initially place it, or by using the kebab menu in the project menu.
7.  Once you are done adding to your project, you can export by clicking the kebab menu on it, and then selecting "Export as KML file".


## Google Earth Pro {#google-earth-pro}

1.  Open [Google Earth Pro](https://www.google.com/earth/about/versions/).
2.  Create a folder under Add &gt; Folder. This is your project, so name it accordingly.
3.  Create placemarks with the placemark tool.
    -   They should be automatically placed into the new folder.
    -   You can drag other objects inside of the folder to add them to the project.
4.  Once you are done with the project, export it by right clicking on the folder and selecting "Save place as.."
    -   There are two options to save: a .kml and .kmz.
    -   If you don't know what to use, select .kml.
    -   .kmz files are used to compress larger projects, typically ones that include images, but have some compatability issues.
