+++
title = "Setting up rgee"
author = ["Morgan Salisbury"]
date = 2024-08-13T11:37:00-05:00
tags = ["rgee", "R"]
draft = false
+++

## Introduction {#introduction}

From the [rgee github page](https://github.com/r-spatial/rgee): "rgee is an R binding package for calling Google Earth Engine API from within R. Various functions are implemented to simplify the connection with the R spatial ecosystem."

This guide assumes use of RStudio on a Mac, but I personally use Emacs with ESS and found it to work wonderfully. Any Unix based system should work similarly. Windows should theoretically work by following the below, but more work might be required and I haven't tested it.


## Prerequisites {#prerequisites}

-   R and RStudio (or other IDE)
-   Google Earth Engine account.
    -   Create a GEE project to work in.
-   A healthy mindset 😊


## Installation {#installation}

Install rgee, geojsonio and miniconda.

```R
install.packages('rgee')
install.packages('reticulate')
install.packages('geojsonio')
reticulate::install_miniconda()
```


## Setup {#setup}

Load the packages.

```R
library(rgee)
library(geojsonio)
library(reticulate)
```

Install dependencies and double check to make sure everything is up to date.

```R
rgee::ee_install()
rgee::ee_install_upgrade()
```

By this point, you should be ready to initialize rgee. To double check everything is ready, run a

```R
ee_check()
```

to make sure. _Note: If the previous command complains about an argument being of length zero, it should be fine to ignore it and carry on._


## Initializing {#initializing}

If you haven't already, you will need to create a new project to work in. This process is semi annoying if you haven't already done it before, full disclaimer.

Navigate over to [the GEE code editor](https://code.earthengine.google.com) and click on your profile picture in the top right. Click "Register a new Cloud Project". Assuming this is correct, click "Register a Noncommercial or Commercial project" and then select "Unpaid usage". Select the relevent project type in the dropdown menu.

On the next screen, choose "Create a new Google Cloud Project". You can leave the Organization field blank, but you will need to at the least choose a project ID. I usually name my projects with the **ee-username-rgee-#**, where username is my username and # is a number. Note that creating the project can take a while. Don't refresh the page, as you will be forced to go through the above process again.

Once you've confirmed your project's information, you will be redirected to the GEE online code editor, where you can close the tab.

Moving back into the IDE, we can now initialize rgee.

```R
ee_Initialize()
```

This should launch a page in your web browser where you can log in and select the project you created to link to rgee. Make sure to choose "Select an existing project" and select it.

If that didn't work, or threw you an error, don't panic. I had enormous amounts of trouble getting rgee to initialize properly. If this is the case for you, you can instead run the below two commands, which does the same thing.

_Note that you will need to replace the project name with your own._

```R
ee$Authenticate(auth_mode='localhost')
ee$Initialize(project='YOUR-PROJECT-NAME')
```

Optionally, check your connectivity to GEE to see if everything is setup correctly.

```R
ee$String('Hello from the Earth Engine servers!')$getInfo()
```

If one of those methods worked, pop the champagne.

**At the start of every new R session where you want to use rgee, you will need to load and then initialize the package in order to use it.**

This should look something like this

```R
library(rgee)
ee$Authenticate(auth_mode='localhost')
ee$Initialize(project='YOUR-PROJECT-NAME')
```

Remember to change the project name to the one you created earlier.


## Examples {#examples}


### Surface water occurrence {#surface-water-occurrence}

In this example, rgee is used to visualize global surface water occurrence using the JRC Global Surface Water dataset.

_Load and initialize rgee first!_

```R
# Loads the dataset from JRC
gsw <- ee$Image("JRC/GSW1_1/GlobalSurfaceWater")
occurrence <- gsw$select("occurrence")

# Defines params to show surface water
VIS_OCCURRENCE <- list(
  min = 0,
  max = 100,
  palette = c("red", "blue")
)

# Makes a mask with said params
VIS_WATER_MASK <- list(
  palette = c("white", "black")
)

# Creates another mask that only shows areas w/ 90% water occurance
water_mask <- occurrence$gt(90)$selfMask()

# Sets the center of the map to Douglas County
Map$setCenter(-95.3, 38.91, 11)

# Adds both masks to the map
Map$addLayer(occurrence$updateMask(occurrence$divide(100)), VIS_OCCURRENCE, "Water Occurrence (1984-2018)") +
Map$addLayer(water_mask, VIS_WATER_MASK, "90% occurrence", FALSE)
{% endhighlight %}
```


### May 28th 2019 Tornado {#may-28th-2019-tornado}

In this example, rgee is used to view the damage path from the 2019 EF4 tornado that touched down in central Douglas County.

_Load and initialize rgee first!_

```R

# Defines an area around Douglas County.
aoi <- ee$Geometry$Rectangle(c(-95.3, 38.85, -95.22, 38.91))

# Defines the dates we are interested in.
start_date <- '2019-05-28'
end_date <- '2019-06-01'
pre_event_date <- '2019-05-20'

# Load Sentinel-2 data for said dates.
s2_collection <- ee$ImageCollection('COPERNICUS/S2')$
  filterDate(start_date, end_date)$
  filterBounds(aoi)

# Get the least cloudy image from the post-event period.
post_event_image <- s2_collection$sort('CLOUDY_PIXEL_PERCENTAGE')$first()

# Define params for said image.
viz_params <- list(
  bands = c('B4', 'B3', 'B2'),
  min = 0,
  max = 3000,
  gamma = 1.4
)

# Add the post-event image to the map.
Map$centerObject(aoi, 12)  # Zoom in to level 12 for better detail
Map$addLayer(post_event_image, viz_params, 'Post-Event Sentinel-2 Image')

# Load pre-event data for comparison.
pre_event_image <- ee$ImageCollection('COPERNICUS/S2')$
  filterDate(pre_event_date, start_date)$
  filterBounds(aoi)$
  sort('CLOUDY_PIXEL_PERCENTAGE')$first()


# Calculate NDVI for pre and post tornado.
pre_ndvi <- pre_event_image$normalizedDifference(c('B8', 'B4'))
post_ndvi <- post_event_image$normalizedDifference(c('B8', 'B4'))

# Find difference.
ndvi_diff <- post_ndvi$subtract(pre_ndvi)

# Define params for NDVI difference.
ndvi_viz_params <- list(min = -0.5, max = 0.5, palette = c('red', 'yellow', 'green'))

# Add NDVI diff. layer to map!
Map$addLayer(ndvi_diff, ndvi_viz_params, 'NDVI Difference')
{% endhighlight %}
```
