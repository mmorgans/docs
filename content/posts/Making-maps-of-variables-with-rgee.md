+++
title = "Making maps of variables with rgee"
author = ["Morgan Salisbury"]
date = 2024-08-13T11:37:00-05:00
tags = ["rgee"]
draft = false
+++

## Introduction {#introduction}

Raw data often needs to be transformed in order to do anything useful with it. Typically, transforming variables in GEE involves manipulating raw bands of imagery to create products like NDVI and EVI, or performing math operations with multiple datasets.


### Dividing EVI by Precipitation {#dividing-evi-by-precipitation}

In this example, EVI is being divided by precipitation data for Kansas, and the result is mapped.

_Load and initialize rgee first!_

```R
library(rgee)
ee_Initialize()

# Define an area of interest (AOI) over Kansas
aoi <- ee$Geometry$Rectangle(c(-102.05, 36.99, -94.6, 40.0))

# Load the Sentinel-2 image collection and calculate EVI
s2_collection <- ee$ImageCollection("COPERNICUS/S2")$
  filterDate('2020-06-01', '2020-08-31')$
  filterBounds(aoi)$
  map(function(image) {
    evi <- image$expression(
      '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
      list('NIR' = image$select("B8"), 'RED' = image$select("B4"), 'BLUE' = image$select("B2"))
    )$rename("EVI")
    return(image$addBands(evi))
  })
evi_image <- s2_collection$select("EVI")$mean()$clip(aoi)

# Visualize EVI to ensure it's calculated correctly
evi_viz <- list(
  min = -1,
  max = 1,
  palette = c("brown", "yellow", "green")
)
Map$setCenter(-98.35, 38.5, 6)
Map$addLayer(evi_image, evi_viz, "EVI")

# Load the TerraClimate PPT (precipitation) dataset
ppt_dataset <- ee$ImageCollection("IDAHO_EPSCOR/TERRACLIMATE")$
  filterDate('2020-01-01', '2020-12-31')$
  select("pr")$
  mean()$
  clip(aoi)

# Visualize PPT to ensure it's loaded correctly
ppt_viz <- list(
  min = 0,
  max = 2000,
  palette = c("blue", "white", "green")
)
Map$addLayer(ppt_dataset, ppt_viz, "Precipitation")

# Ensure the datasets align perfectly for each pixel
evi_resampled <- evi_image$reproject(crs = ppt_dataset$projection(), scale = 1000)
ppt_resampled <- ppt_dataset$reproject(crs = evi_image$projection(), scale = 1000)

# Divide EVI by PPT
evi_ppt_ratio <- evi_resampled$divide(ppt_resampled)

# Define visualization parameters for the ratio
evi_ppt_viz <- list(
  min = 0,
  max = 0.1,
  palette = c("blue", "white", "red")
)

# Add the EVI/PPT ratio layer
Map$addLayer(evi_ppt_ratio, evi_ppt_viz, "EVI/PPT Ratio")
```


### Breakdown {#breakdown}


#### Define the AOI, the state of Kansas. {#define-the-aoi-the-state-of-kansas-dot}

```R
aoi <- ee$Geometry$Rectangle(c(-102.05, 36.99, -94.6, 40.0))
```


#### Load and Filter Sentinel-2 Data {#load-and-filter-sentinel-2-data}

Next, we load the Sentinel-2 image collection, filter it for the summer months (June to August 2020), and calculate EVI for each image. EVI values are then averaged and clipped only to our AOI.

```R
s2_collection <- ee$ImageCollection("COPERNICUS/S2")$
  filterDate('2020-06-01', '2020-08-31')$
  filterBounds(aoi)$
  map(function(image) {
    evi <- image$expression(
      '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
      list('NIR' = image$select("B8"), 'RED' = image$select("B4"), 'BLUE' = image$select("B2"))
    )$rename("EVI")
    return(image$addBands(evi))
  })
evi_image <- s2_collection$select("EVI")$mean()$clip(aoi)
```


#### First mapping of EVI {#first-mapping-of-evi}

This is to make sure the current values are correct and being visualized correctly. I had a lot of trouble with this example in particular, so I am redundantly checking work as we go.

```R
evi_viz <- list(
  min = -1,
  max = 1,
  palette = c("brown", "yellow", "green")
)
Map$setCenter(-98.35, 38.5, 6)
Map$addLayer(evi_image, evi_viz, "EVI")
```


#### Loading precip data {#loading-precip-data}

We load precip data from TerraClimate, filter it for the year 2020, average values, and clip them.

```R
ppt_dataset <- ee$ImageCollection("IDAHO_EPSCOR/TERRACLIMATE")$
  filterDate('2020-01-01', '2020-12-31')$
  select("pr")$
  mean()$
  clip(aoi)
```


#### Visualize PPT to make sure it's correct {#visualize-ppt-to-make-sure-it-s-correct}

Again, I am visualizing the precipitation data to make sure it looks correct.

```R
ppt_viz <- list(
  min = 0,
  max = 2000,
  palette = c("blue", "white", "green")
)
Map$addLayer(ppt_dataset, ppt_viz, "Precipitation")
```


#### Make sure data is aligned {#make-sure-data-is-aligned}

Before actually performing any operations on the data, making sure that both datasets are aligned correctly is important. Here I'm reprojecting both sets to the same scale and resolution.

```R
evi_resampled <- evi_image$reproject(crs = ppt_dataset$projection(), scale = 1000)
ppt_resampled <- ppt_dataset$reproject(crs = evi_image$projection(), scale = 1000)
```


#### Transform the data {#transform-the-data}

Dividing the EVI by the precip to calculate the ratio.

```R
evi_ppt_ratio <- evi_resampled$divide(ppt_resampled)
```


#### Define viz params for mapping the new ratio {#define-viz-params-for-mapping-the-new-ratio}

```R
evi_ppt_viz <- list(
  min = 0,
  max = 0.1,
  palette = c("blue", "white", "red")
)
Map$addLayer(evi_ppt_ratio, evi_ppt_viz, "EVI/PPT Ratio")
```
