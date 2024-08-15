+++
title = "Mapping DI and EP with rgee"
date = 2024-08-15T12:39:00-05:00
tags = ["rgee", "maps"]
draft = false
+++

![](/images/rgee_global.png)
Note: I have a sneaking suspicion that trying this in Earth Engine proper using JS will significantly improve the results. The same goal attempted in rgee will remain available below, and a hopefully better JS version will appear above this in the coming days.


## Rgee version {#rgee-version}


### Introduction {#introduction}

Goal: create global maps showing Dryness Index and Evaporative Index in both 2012 and 2019, using rgee.

This was pretty tricky to get working. The primary challenge was visualizing the data in a way that was meaningful, and preventing extreme values from obfuscating the scale.


#### Scale values / min and max {#scale-values-min-and-max}

A major pain to get right. The values in the script below _are still not correct_ and the product generated **should not** be used for any purpose other than general visualization. Google Earth Engine documentation [provides estimated min and max values and scale](https://developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#bands), but using those results in seemingly useless visualizations. After trials, I found that the best visualization came from using max values of 4 for DI layers, and 2 for EI layers. Additionally, make sure to multiple all bands by 0.1 to account for scale.


#### Color palette {#color-palette}

Another pinch point. At first, the map being dominated by extreme values seems like an issue that could be easily solved by using a more expansive color palette. In practice, this doesn't work. Going from only three colors to over twenty just creates more range in the areas of the map where range actually exists, instead of creating it in the areas that are solidly either the min or the max.


#### Data statistics {#data-statistics}

Interesting findings here that mostly reveal my own incompetence. Doing some light sniffing on the visualized values gives some very bizarre results: for both bands, the 50th percentile is 0. For EI, the 95th percentile is 0.662 and the 99th is 0.759. Similar values are present among both years and both DI and EI.


### Script {#script}

```R

# Load required libraries
library(rgee)
library(ggplot2)

# Initialize rgee: see docs.mor-gan.com/posts/setting-up-rgee/#initializing
ee_check()
ee_install_upgrade()
ee$Authenticate(auth_mode='localhost')
ee$Initialize(project='ee-pugbugdude')

# Define the years of interest
years <- c(2012, 2019)

# Function to load datasets for different years - continued with snippet below.
load_dataset <- function(year) {
  ee$ImageCollection("IDAHO_EPSCOR/TERRACLIMATE")$
    filter(ee$Filter$calendarRange(year, year, "year"))$
    mean()
}

# Loads the dataset above for both defined years.
dataset_2012 <- load_dataset(2012)
dataset_2019 <- load_dataset(2019)

# Function to select bands and scale properly
# see developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#bands
# for scaling info.
get_scaled_bands <- function(dataset) {
  list(
    pet = dataset$select('pet')$multiply(0.1),
    aet = dataset$select('aet')$multiply(0.1),
    pr = dataset$select('pr')
  )
}

# Sets the bands for both years
bands_2012 <- get_scaled_bands(dataset_2012)
bands_2019 <- get_scaled_bands(dataset_2019)

# Calculate indices
# DI (Dryness Index) = PET / PR
# EI (Evaporative Index) = AET / PR
calculate_indices <- function(bands) {
  list(
    dryness_index = bands$pet$divide(bands$pr)$rename("Dryness_Index"),
    evap_index = bands$aet$divide(bands$pr)$rename("Evaporative_Index")
  )
}

# Calculates indices for both years
indices_2012 <- calculate_indices(bands_2012)
indices_2019 <- calculate_indices(bands_2019)

# Sets the palette to use for mapping.
index_palette <- c("blue", "cyan", "green", "yellow", "orange", "red", "darkred")

# Function to put layers on the map for both years and bands
# Uses variables set above
# Why: It's easier to be able to edit the palette, min, and max values
#  for all layers at once, rather than having to keep track of several different lines.
visualize_layer <- function(image, title, min, max) {
  Map$addLayer(
    image,
    list(min = min, max = max, palette = index_palette),
    title
  )
}

# Set min and max values for visualization.
# IMPORTANT: These are very, very finicky to figure out. The min and max listed at
# developers.google.com/earth-engine/datasets/catalog/IDAHO_EPSCOR_TERRACLIMATE#bands
# will result in a wonky, poorly visualized map.
# The numbers used below are a best attempt effort that generates a product to be used purely for
# visualization, not a particularly accurate one. I strongly encourage you to adjust them to see how the map changes.
dryness_index_min <- 0
dryness_index_max <- 4

evap_index_min <- 0
evap_index_max <- 1.5

# Adds each of the layers to the map.
# In RStudio, the map should open automatically in the viewer tab.
# In other environments, the map should open in a browser tab.
visualize_layer(indices_2012$dryness_index, "DI 2012", dryness_index_min, dryness_index_max)
visualize_layer(indices_2012$evap_index, "EI 2012", evap_index_min, evap_index_max)

# Add layers for 2019
visualize_layer(indices_2019$dryness_index, "DI 2019", dryness_index_min, dryness_index_max)
visualize_layer(indices_2019$evap_index, "EI 2019", evap_index_min, evap_index_max)
```
