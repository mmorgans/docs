+++
title = "Using variables in rgee"
author = ["Morgan Salisbury"]
date = 2024-08-13T11:37:00-05:00
tags = ["rgee"]
draft = false
+++

## Introduction {#introduction}

Google Earth Engine provides access to a bunch of geospatial datasets including satellite imagery, climate data and land cover classifications. These datasets, known as variables, are used to perform geospatial analyses.


## Calling variables {#calling-variables}

_Load and initialize rgee first!_

Define an area that you want to visualize. The easiest way of doing this is to define a rectangle with coordinates.

```R
aoi <- ee$Geometry$Rectangle(c(-120.4, 34.5, -119.4, 35.5))
```

In this example, I'll use the MODIS land cover datasets.

```R
landcover <- ee$ImageCollection("MODIS/061/MCD12Q1")$first()$select("LC_Type1")
```

Set some visualization parameters to control how the data is displayed.

```R
landcover_viz <- list(
  min = 1,
  max = 17,
  palette = c("05450a", "086a10", "54a708", "78d203", "009900",
              "c6b044", "dcd159", "dade48", "fbff13", "b6ff05",
              "27ff87", "c24f44", "a5a5a5", "ff6d4c", "69fff8",
              "f9ffa4", "1c0dff")
)
```

Center the map on the area we are interested in, and add in the land cover layer using the parameters we defined above.

```R
Map$centerObject(aoi,8)
Map$addLayer(landcover, landcover_viz, "Land Cover :)")
```
