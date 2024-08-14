+++
date = 2024-08-12
draft = false
+++

<div class="ox-hugo-toc toc">

<div class="heading">Table of Contents</div>

- [<span class="org-todo done DONE">DONE</span> Setting up rgee](#setting-up-rgee):rgee:R:
    - [Introduction](#introduction)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Setup](#setup)
    - [Initializing](#initializing)
    - [Examples](#examples)
        - [Surface water occurrence](#surface-water-occurrence)
        - [May 28th 2019 Tornado](#may-28th-2019-tornado)
- [<span class="org-todo done DONE">DONE</span> Using variables in rgee](#using-variables-in-rgee):rgee:
    - [Introduction](#introduction)
    - [Calling variables](#calling-variables)
- [<span class="org-todo done DONE">DONE</span> Making maps of variables with rgee](#Making-maps-of-variables-with-rgee):rgee:
    - [Introduction](#introduction)
        - [Dividing EVI by Precipitation](#dividing-evi-by-precipitation)
        - [Breakdown](#breakdown)
- [<span class="org-todo done DONE">DONE</span> Exporting data to a CSV with rgee](#Exporting-data-to-a-csv-with-rgee):rgee:
    - [Introduction](#introduction)
    - [Example](#example)
- [<span class="org-todo done DONE">DONE</span> Getting data from AppEEARS and NOAA](#Getting-data-from-AppEEARS-and-NOAA):rgee:
    - [Data types (link to method of gathering)](#data-types--link-to-method-of-gathering)
    - [Sites](#sites)
    - [Process](#process)
        - [MAT](#mat)
        - [MAP](#map)
        - [NPP](#npp)
        - [PET](#pet)
        - [AET, ET](#aet-et)
        - [DI](#di)
        - [EP](#ep)
        - [GPP](#gpp)
    - [Initial .csv setup](#initial-dot-csv-setup)
- [<span class="org-todo todo TODO">TODO</span> Mapping DI and EP with rgee](#Mapping-DI-and-EP-with-rgee):rgee:maps:
- [Creating My Website with Hugo and Cloudflare Pages](#creating-my-website-with-hugo-and-cloudflare-pages)
    - [Introduction](#introduction)
    - [Prerequisites](#prerequisites)
    - [Setting Up Hugo](#setting-up-hugo)
    - [Building and Previewing the Site](#building-and-previewing-the-site)
    - [Deploying to Cloudflare Pages](#deploying-to-cloudflare-pages)
    - [Adding Functionality](#adding-functionality)

</div>
<!--endtoc-->



## <span class="org-todo done DONE">DONE</span> Setting up rgee <span class="tag"><span class="rgee">rgee</span><span class="R">R</span></span> {#setting-up-rgee}


### Introduction {#introduction}

From the [rgee github page](https://github.com/r-spatial/rgee): "rgee is an R binding package for calling Google Earth Engine API from within R. Various functions are implemented to simplify the connection with the R spatial ecosystem."

This guide assumes use of RStudio on a Mac, but I personally use Emacs with ESS and found it to work wonderfully. Any Unix based system should work similarly. Windows should theoretically work by following the below, but more work might be required and I haven't tested it.


### Prerequisites {#prerequisites}

-   R and RStudio (or other IDE)
-   Google Earth Engine account.
    -   Create a GEE project to work in.
-   A healthy mindset 😊


### Installation {#installation}

Install rgee, geojsonio and miniconda.

```R
install.packages('rgee')
install.packages('reticulate')
install.packages('geojsonio')
reticulate::install_miniconda()
```


### Setup {#setup}

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


### Initializing {#initializing}

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


### Examples {#examples}


#### Surface water occurrence {#surface-water-occurrence}

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


#### May 28th 2019 Tornado {#may-28th-2019-tornado}

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


## <span class="org-todo done DONE">DONE</span> Using variables in rgee <span class="tag"><span class="rgee">rgee</span></span> {#using-variables-in-rgee}


### Introduction {#introduction}

Google Earth Engine provides access to a bunch of geospatial datasets including satellite imagery, climate data and land cover classifications. These datasets, known as variables, are used to perform geospatial analyses.


### Calling variables {#calling-variables}

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


## <span class="org-todo done DONE">DONE</span> Making maps of variables with rgee <span class="tag"><span class="rgee">rgee</span></span> {#Making-maps-of-variables-with-rgee}


### Introduction {#introduction}

Raw data often needs to be transformed in order to do anything useful with it. Typically, transforming variables in GEE involves manipulating raw bands of imagery to create products like NDVI and EVI, or performing math operations with multiple datasets.


#### Dividing EVI by Precipitation {#dividing-evi-by-precipitation}

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


#### Breakdown {#breakdown}

<!--list-separator-->

-  Define the AOI, the state of Kansas.

    ```R
    aoi <- ee$Geometry$Rectangle(c(-102.05, 36.99, -94.6, 40.0))
    ```

<!--list-separator-->

-  Load and Filter Sentinel-2 Data

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

<!--list-separator-->

-  First mapping of EVI

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

<!--list-separator-->

-  Loading precip data

    We load precip data from TerraClimate, filter it for the year 2020, average values, and clip them.

    ```R
    ppt_dataset <- ee$ImageCollection("IDAHO_EPSCOR/TERRACLIMATE")$
      filterDate('2020-01-01', '2020-12-31')$
      select("pr")$
      mean()$
      clip(aoi)
    ```

<!--list-separator-->

-  Visualize PPT to make sure it's correct

    Again, I am visualizing the precipitation data to make sure it looks correct.

    ```R
    ppt_viz <- list(
      min = 0,
      max = 2000,
      palette = c("blue", "white", "green")
    )
    Map$addLayer(ppt_dataset, ppt_viz, "Precipitation")
    ```

<!--list-separator-->

-  Make sure data is aligned

    Before actually performing any operations on the data, making sure that both datasets are aligned correctly is important. Here I'm reprojecting both sets to the same scale and resolution.

    ```R
    evi_resampled <- evi_image$reproject(crs = ppt_dataset$projection(), scale = 1000)
    ppt_resampled <- ppt_dataset$reproject(crs = evi_image$projection(), scale = 1000)
    ```

<!--list-separator-->

-  Transform the data

    Dividing the EVI by the precip to calculate the ratio.

    ```R
    evi_ppt_ratio <- evi_resampled$divide(ppt_resampled)
    ```

<!--list-separator-->

-  Define viz params for mapping the new ratio

    ```R
    evi_ppt_viz <- list(
      min = 0,
      max = 0.1,
      palette = c("blue", "white", "red")
    )
    Map$addLayer(evi_ppt_ratio, evi_ppt_viz, "EVI/PPT Ratio")
    ```


## <span class="org-todo done DONE">DONE</span> Exporting data to a CSV with rgee <span class="tag"><span class="rgee">rgee</span></span> {#Exporting-data-to-a-csv-with-rgee}


### Introduction {#introduction}

In general, exporting data to a .csv with rgee is pretty easy. The general gist of the process is:

-   Define the area or points you are interested in
-   Filter data
-   Convert the results to a list, and
-   Export to a csv.


### Example {#example}

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


## <span class="org-todo done DONE">DONE</span> Getting data from AppEEARS and NOAA <span class="tag"><span class="rgee">rgee</span></span> {#Getting-data-from-AppEEARS-and-NOAA}


### Data types (link to method of gathering) {#data-types--link-to-method-of-gathering}

-   [MAT (Mean Annual Temperature)](#mat)
    -   Average yearly temperature.
-   [MAP (Mean Annual Precipitation)](#map)
    -   Average yearly precipitation.
-   [GPP (Gross Primary Productivity)](#gpp)
    -   Total amount of energy captured by plants. Does not account for respiration losses.
-   [NPP (Net Primary Productivity)](#npp)
    -   Amount of energy that remains after plants have used some of the captured energy for their own respiration. Actual amount of new biomass that is available for consumption by other critters. NPP = GPP - Respiration
-   [PET (Potential Evapotranspiration)](#pet)
    -   Amount of water that would be evaporated and transpired by vegetation if there was sufficient water available. Atmospheric demand for water.
-   [AET, ET (Actual Evapotranspiration)](#aet-et)  - Actual amount of water that is evaporated from soil and transpired by vegetation. Less than or equal to PET. Depends on availability of water.
-   [DI (Dryness Index)](#di)
    -   PET / MAP
-   [EP (Evaporation Potential)](#ep)
    -   1 - (PET /MAP)


### Sites {#sites}

This data was gathered from many sites across the globe. Sites were sorted with a RegionName, SiteName, and Pit.

| RegionName     | SiteName        | Pit          |
|----------------|-----------------|--------------|
| Calhoun        | R7              | R7P2         |
| Calhoun        | R2              | R2P1         |
| Calhoun        | R7              | R7P1         |
| Calhoun        | R8              | R8P1         |
| Calhoun        | R8              | R8P2.5       |
| Calhoun        | R8              | R8P2         |
| Calhoun        | R1              | R1C2         |
| Calhoun        | R1              | R1C3         |
| Calhoun        | R2              | R2H1         |
| Calhoun        | R7              | R7H1         |
| Calhoun        | R7              | R7H2         |
| Calhoun        | R8              | R8H1         |
| Calhoun        | R8              | R8H2.5       |
| Calhoun        | R8              | R8H2         |
| Luquillo       | ElVerde         | ElVerdeM     |
| Luquillo       | ElVerde         | ElVerdeR     |
| Luquillo       | ElVerde         | ElVerdeT     |
| Luquillo       | Icacos          | IcacosM      |
| Luquillo       | Icacos          | IcacosR      |
| Luquillo       | Icacos          | IcacosT      |
| Catalina       | MixedCon        | MC_M         |
| Catalina       | MixedCon        | MC_R         |
| Catalina       | MixedCon        | MC_T         |
| Catalina       | BigelowDesert   | B2D_M        |
| Catalina       | BigelowDesert   | B2D_R        |
| Catalina       | BigelowDesert   | B2D_T        |
| ReynoldsCr     | NorthBasalt     | NB_R         |
| ReynoldsCr     | NorthBasalt     | NB_T         |
| ReynoldsCr     | NorthLoess      | NL_T         |
| ReynoldsCr     | SWBasalt        | SWB_M        |
| ReynoldsCr     | SWBasalt        | SWB_T        |
| ReynoldsCr     | SWLoess         | SWL_T        |
| SouthernSierra | SJER            | SJER_M       |
| SouthernSierra | SJER            | SJER_R       |
| SouthernSierra | SJER            | SJER_T       |
| DukeFarm       | DukeFarm        | DFPasture    |
| EKS            | Ottawa          | EKSAgri      |
| EKS            | Welda           | EKSNative    |
| EKS            | Welda           | EKSPostAg    |
| KNZ            | KNZ             | KNZNative    |
| KNZ            | KNZ             | KNZAgri      |
| KNZ            | KNZ             | KNZPostAg    |
| HAY            | HAY             | HAYNative    |
| HAY            | HAY             | HAYAgri      |
| HAY            | HAY             | HAYPostAg    |
| TRB            | TRB             | TRBNative    |
| TRB            | TRB             | TRBAgri      |
| TRB            | TRB             | TRBAgriIrrig |
| TRB            | TRB             | TRBPostAg    |
| FRESCC         | CC1             | CC1_2020     |
| FRESCC         | CC2             | CC2_2020     |
| FRESCC         | CC2             | CC2_2022     |
| FRESCC         | CC3             | CC3_2021     |
| FRESCC         | CC3             | CC3_2022     |
| FRESCC         | CC4             | CC4_2021     |
| FRESCC         | CC5             | CC5_2021     |
| Konza          | GrassyToe       | GrToeN01B    |
| Konza          | WoodyToe        | WdToeN04D    |
| Konza          | GrassyBackslope | GrBackslN01B |
| Konza          | WoodyBackslope  | WdBackslN04D |
| Konza          | GrassySummit    | GrSummN01B   |
| Konza          | WoodySummit     | WdSummN04D   |
| HJAndrews      | WS01            | NF_Y_A       |
| HJAndrews      | WS01            | SF_Y_A       |
| HJAndrews      | WS02            | NF_O_A       |
| HJAndrews      | WS02            | SF_O_A       |
| HJAndrews      | WS03            | NF_O_A       |
| HJAndrews      | WS03            | NF_Y_A       |
| HJAndrews      | WS03            | SF_O_A       |
| HJAndrews      | WS03            | SF_Y_A       |
| Alps           | Glacier         | Alps1        |
| Alps           | GlacierRidge    | Alps2        |
| Alps           | Limestone       | Alps3        |
| Alps           | Gneiss          | Alps5        |
| Alps           | Alluvial        | Alps6        |
| NH             | ThompsonPasture | NH_TP        |
| NH             | ThompsonForest  | NH_TF        |
| NH             | OrganicPasture  | NH_OP        |
| NH             | OrganicForest   | NH_OF        |


### Process {#process}


#### MAT {#mat}

Gathered mainly from [NCEI at NOAA](https://www.ncei.noaa.gov/maps/annual/).

-   Turn on the "Annual Normals (2006-2020)" map layer, and disable the "Global Summary of the Year" layer.
-   Put coords into floating search box, and find a station near enough to the site to be relevant.
-   Click the wrench on "Annual Normals (2006-2020)", and use the rectangle tool to make a box around the station, just enough to select it.
-   Select the station in the menu that appears on the left side of the page, and add to cart.
-   In the new tab, click "Show List" under the "Data Types" text field.
-   Type, filter, and select both "Annual average temperature mean" and "Annual precipitation totals"
-   In the downloaded .csv, precip is labeled as ANN-PRCP-NORMAL, and temperature is labeled as ANN-TAVG-NORMAL.


#### MAP {#map}

Gathered mainly from [NCEI at NOAA](https://www.ncei.noaa.gov/maps/annual/).

-   Turn on the "Annual Normals (2006-2020)" map layer, and disable the "Global Summary of the Year" layer.
-   Put coords into floating search box, and find a station near enough to the site to be relevant.
-   Click the wrench on "Annual Normals (2006-2020)", and use the rectangle tool to make a box around the station, just enough to select it.
-   Select the station in the menu that appears on the left side of the page, and add to cart.
-   In the new tab, click "Show List" under the "Data Types" text field.
-   Type, filter, and select both "Annual average temperature mean" and "Annual precipitation totals"
-   In the downloaded .csv, precip is labeled as ANN-PRCP-NORMAL, and temperature is labeled as ANN-TAVG-NORMAL.


#### NPP {#npp}

NPP data is gathered from [AppEEARS](https://appeears.earthdatacloud.nasa.gov/).

-   Navigate to Extract &gt; Point, and make an account if you haven't.
-   Start a new request.
-   Name the request, and put your coordinates in the text box on the right. Comma seperated, the text should look like _ID, Category, Lat, Long_.
    -   You can alternatively upload a .csv with the same formatting, useful for large pulls.
-   Set the dates. For this process, I was pulling from Jan 1, 2006 - Dec 31, 2021.
-   Scroll down to select layers to include in the sample.
-   NPP is the first result. Make sure the data is yearly, not 8-day.
-   Add other products if you wish, and submit the request.
-   Depending on the size of the data requested, it can take up to a couple hours to process.


#### PET {#pet}

PET data is gathered from [AppEEARS](https://appeears.earthdatacloud.nasa.gov/).

-   Navigate to Extract &gt; Point, and make an account if you haven't.
-   Start a new request.
-   Name the request, and put your coordinates in the text box on the right. Comma seperated, the text should look like _ID, Category, Lat, Long_.
    -   You can alternatively upload a .csv with the same formatting, useful for large pulls.
-   Set the dates. For this process, I was pulling from Jan 1, 2006 - Dec 31, 2021.
-   Scroll down to select layers to include in the sample.
-   Search for "Evapo yearly" select the first option.
-   PET is labeled "PET", and AET is labeled "ET".
-   Depending on the size of the data requested, it can take up to a couple hours to process.


#### AET, ET {#aet-et}

AET data is gathered from [AppEEARS](https://appeears.earthdatacloud.nasa.gov/).

-   Navigate to Extract &gt; Point, and make an account if you haven't.
-   Start a new request.
-   Name the request, and put your coordinates in the text box on the right. Comma seperated, the text should look like _ID, Category, Lat, Long_.
    -   You can alternatively upload a .csv with the same formatting, useful for large pulls.
-   Set the dates. For this process, I was pulling from Jan 1, 2006 - Dec 31, 2021.
-   Scroll down to select layers to include in the sample.
-   Search for "Evapo yearly" select the first option.
-   PET is labeled "PET", and AET is labeled "ET".
-   Depending on the size of the data requested, it can take up to a couple hours to process.


#### DI {#di}

-   DI and EP are calculated with PET and MAP products.
-   PET / MAP


#### EP {#ep}

-   EP and Di are calculated with PET and MAP products.
-   1 - (PET / MAP)


#### GPP {#gpp}

GPP data is gathered from [AppEEARS](https://appeears.earthdatacloud.nasa.gov/).

-   Navigate to Extract &gt; Point, and make an account if you haven't.
-   Start a new request.
-   Name the request, and put your coordinates in the text box on the right. Comma seperated, the text should look like _ID, Category, Lat, Long_.
    -   You can alternatively upload a .csv with the same formatting, useful for large pulls.
-   Set the dates. For this project, I was pulling from Jan 1, 2006 - Dec 31, 2021.
-   Scroll down to select layers to include in the sample.
-   GPP is only available in 8-day, which creates an extremely obnoxious problem - I solved this problem with an R script

-   If you need to calculate yearly GPP for many different sites, the first script is intended for that purpose.
-   If you only need to calculate yearly GPP for one single site, then scroll down for instructions.


### Initial .csv setup {#initial-dot-csv-setup}

-   Before you begin, we will need to edit the excel file that AppEEARS gives us.
    -   Keep only the needed columns: ID, Category, Latitude, Longitude, Date and GPP - Note that the actual GPP column is labeled something like "MOD17A2HGF_061_Gpp_500m"
        -   There are many extra columns that you will need to delete.
        -   Rename the GPP column to "GPP"
-   Create a new column called "Year". The goal is to have this column have the year in YYYY format for every sample.
    -   In the first cell (Should be E2 or F2), enter "=YEAR(D2)", where D2 refers to your date column. Change the cell type to "General" - you should see a year in YYYY format.
    -   Extend this formula down to fill in the whole Year column.
    -   Copy the whole column, and then Edit &gt; Paste Special..., and select Values. This replaces the context dependent cells with ones that just have the year.
-   The list of columns should be ID, Category, Latitude, Longitude, Date, Year, GPP.
-   "appears.csv" refers to the downloaded .csv - either rename your file or change this to call in the file that contains the downloaded data.

<!--list-separator-->

-  Multiple sites

    ```R
      library(dplyr)

      # sets initial df as the sanitzed, edited .csv
      df <- read.csv("appeears.csv", header = TRUE)

      # sets output to not be in scientific notation
      options(scipen = 999)

      # checking the df to make sure all good.
      # I had to mess around in excel a bit to get rid of empty rows at the bottom.
      head(df)
      tail(df)

      # set object to sum all the 8day GPP values
      summarized_data <- aggregate(GPP ~ Category + Year, data=df, sum, na.rm = TRUE)

      # The goal was to take the sum values and keep the Site and Pit labels
      #   in the sheet.
      names(summarized_data)[names(summarized_data) == "GPP"] <- "total_GPP"

      # Gets rid of duplicates for Category and Year rows.
      unique_rows <- df[!duplicated(df[, c("Category", "Year")]), ]

      # set object to merge the sum'd GPPs and the category and year
      summarized_all_data <- merge(unique_rows, summarized_data, by=c("Category", "Year"))

      # export a .csv with the above
      write.csv(summarized_all_data, "annual_gpp.csv", row.names=FALSE)

      # New goal: to average each sites GPP values across all the defined years 2006-2021
      # removed stray 2005 8day values from output .csv in excel
      df2 <- read.csv("annual_gpp.csv", header = TRUE)

      #checking df2
      head(df2)

      # ALERT!! I open the annual_gpp.csv here and rename columns to be "Pit" and "Site", accordingly.
      # adds mean of total_GPP, and sets that to be average_GPP
      average_GPP <- aggregate(total_GPP ~ Pit, data = df2, FUN = mean)

      # takes average_GPP value and merges it with all the label columns
      # sorts by Pit
      merged_data <- merge(average_GPP, df2[c("Site", "Pit", "Year", "Latitude", "Longitude")]
                           , by = "Pit")

      # removes duplicates
      merged_data <- merged_data[!duplicated(merged_data$Pit), ]

      #  exports a csv with all of that stuff. Hip Hip hooray
      write.csv(merged_data, file = "time_averaged_GPP.csv", row.names = FALSE)
    ```

<!--list-separator-->

-  Single site

    If you only are processing GPP data from one site, then some slight modifications are needed for the script to function.

    ```R
    library(dplyr)

    # sets initial df as the sanitized, edited data
    df <- read.csv("appeears.csv", header = TRUE)

    # sets output to not be in scientific notation
    options(scipen = 999)

    # checking the df to make sure all good
    head(df)
    tail(df)

    # set object to sum all the 8day GPP values
    summarized_data <- aggregate(GPP ~ Year, data=df, sum, na.rm = TRUE)

    # The goal was to take the sum values and keep the Site and Pit labels in the sheet
    names(summarized_data)[names(summarized_data) == "GPP"] <- "total_GPP"

    # Gets rid of duplicates for Year rows
    unique_rows <- df[!duplicated(df$Year), ]

    # set object to merge the summed GPPs and the year
    summarized_all_data <- merge(unique_rows, summarized_data, by="Year")

    # export a .csv with the above
    write.csv(summarized_all_data, "annual_gpp.csv", row.names=FALSE)

    # Read the exported .csv
    df2 <- read.csv("annual_gpp.csv", header = TRUE)

    # Checking df2
    head(df2)

    # Calculate the average of total_GPP for each combination of Latitude and Longitude
    average_GPP <- aggregate(total_GPP ~ Latitude + Longitude, data = df2, FUN = mean)

    # Rename the average GPP column
    names(average_GPP)[names(average_GPP) == "total_GPP"] <- "average_GPP"

    # Merge the average GPP values with the original data to keep all necessary columns
    merged_data <- merge(average_GPP, df2[, c("ID", "Latitude", "Longitude", "Year")], by = c("Latitude", "Longitude"))

    # Remove duplicates to ensure each Latitude-Longitude combination appears only once
    merged_data <- merged_data[!duplicated(merged_data[, c("Latitude", "Longitude")]), ]

    # Export a csv with the averaged GPP values
    write.csv(merged_data, file = "final_averaged_GPP.csv", row.names = FALSE)
    ```


## <span class="org-todo todo TODO">TODO</span> Mapping DI and EP with rgee <span class="tag"><span class="rgee">rgee</span><span class="maps">maps</span></span> {#Mapping-DI-and-EP-with-rgee}

hello test


## Creating My Website with Hugo and Cloudflare Pages {#creating-my-website-with-hugo-and-cloudflare-pages}



### Introduction {#introduction}

This document details the steps I followed to create my website using Hugo, Cloudflare Pages, and associated tools. It includes setting up a static site generator, configuring themes, deploying to Cloudflare Pages, and troubleshooting common issues.


### Prerequisites {#prerequisites}

Before starting, ensure you have the following installed on your system:

-   `Hugo`
-   `Git`
-   A GitHub account for version control
-   A Cloudflare account for deployment


### Setting Up Hugo {#setting-up-hugo}

**\*** Install Hugo:
    Hugo is a fast, modern static site generator. I installed it using Homebrew:

```bash
       brew install hugo
```

**\*** Create a New Hugo Site:
    I initialized a new Hugo site by running the following command:

```bash
       hugo new site mysite
```

**\*** Choose and Install a Theme:
    I opted for the `PaperMod` theme, which offers a clean and modern look:

```bash
       git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/papermod
```

After adding the theme, I configured the site by editing the `hugo.toml` file to use the `PaperMod` theme.


### Building and Previewing the Site {#building-and-previewing-the-site}

**\*** Build the Site Locally:
    To build and preview the site locally, I used the following command:

```bash
       hugo server -D
```

This command starts a local server where I could view my site at `http://localhost:1313`.

**\*** Customizing the Site:
    I customized various aspects of the site, including the footer, search functionality, and more, by editing the relevant files in the `themes/papermod` directory.


### Deploying to Cloudflare Pages {#deploying-to-cloudflare-pages}

**\*** Set Up Cloudflare Pages:
    I configured Cloudflare Pages to deploy the site directly from my GitHub repository. I connected my repository to Cloudflare Pages and set the build command to:

```bash
       hugo
```

The output directory was set to `public`.

**\*** Troubleshooting Deployment Issues:
    One issue I encountered was related to submodules not deploying correctly. I resolved this by ensuring the `.gitmodules` file was properly configured:

```ini
       [submodule "themes/papermod"]
           path = themes/papermod
           url = https://github.com/adityatelange/hugo-PaperMod.git
```


### Adding Functionality {#adding-functionality}

**\*** Adding Search:
    I added a search page to the site by creating a `search.md` file in the content directory. I made sure the front matter was correctly formatted:

```yaml
       ---
       title: "Search"
       layout: "search"
       url: "/search"
       summary: "search"
       placeholder: "placeholder text in search input box"
       ---
```

**\*** Enhancing the Footer:
    Customizing the footer required editing the theme's configuration and files in the `themes/papermod` directory.
