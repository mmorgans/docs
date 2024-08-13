+++
title = "Exporting data to a CSV with rgee"
date = 2024-08-13T11:37:00-05:00
tags = ["rgee"]
draft = false
+++

## Introduction {#introduction}

In general, exporting data to a .csv with rgee is pretty easy. The general gist of the process is:

-   Define the area or points you are interested in
-   Filter data
-   Convert the results to a list, and
-   Export to a csv.


## Example {#example}

_Make sure to load and initialize rgee first!_

```R
# Define an AOI over Kansas
aoi <- ee$Geometry$Rectangle(c(-102.05, 36.99, -94.6, 40.0))

# Define sample points in the area
points <- ee$FeatureCollection(c(
  ee$Feature(ee$Geometry$Point(-98.5795, 39.8283), list(label = "1")),
  ee$Feature(ee$Geometry$Point(-97.5795, 38.8283), list(label = "2")),
  ee$Feature(ee$Geometry$Point(-96.5795, 37.8283), list(label = "3"))
))

# Grab an image from Sentinal 2 and calculate NDVI
s2_collection <- ee$ImageCollection("COPERNICUS/S2")$
  filterDate('2020-06-01', '2020-06-30')$
  filterBounds(aoi)$
  map(function(image) {
    ndvi <- image$normalizedDifference(c("B8", "B4"))$rename("NDVI")
    return(image$addBands(ndvi))
  })
ndvi_image <- s2_collection$select("NDVI")$mean()$clip(aoi)

# Grab NDVI values at the sample points
ndvi_values <- ndvi_image$reduceRegions(
  collection = points,
  reducer = ee$Reducer$mean(),
  scale = 30
)

# Convert the result to a list and then to a data frame
ndvi_list <- ndvi_values$getInfo()$features
ndvi_df <- do.call(rbind, lapply(ndvi_list, function(x) data.frame(
  label = x$properties$label,
  NDVI = x$properties$mean,
  lon = x$geometry$coordinates[1],
  lat = x$geometry$coordinates[2]
)))

# Save the data frame as a CSV
write.csv(ndvi_df, "ndvi_values_hello.csv", row.names = FALSE)
```
