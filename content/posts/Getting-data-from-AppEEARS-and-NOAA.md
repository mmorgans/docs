+++
title = "Getting data from AppEEARS and NOAA"
date = 2024-08-13T11:37:00-05:00
tags = ["rgee"]
draft = false
+++

## Data types (link to method of gathering) {#data-types--link-to-method-of-gathering}

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


## Sites {#sites}

Data was gathered from multiple sites, sorted with a RegionName, SiteName, and Pit. It's important that the Pit is unique.

**Note**: Although the majority of data sources were the same, there are sites where alternate sources were used. See footnotes.

| RegionName            | SiteName        | Pit          |
|-----------------------|-----------------|--------------|
| Calhoun               | R7              | R7P2         |
| Calhoun               | R2              | R2P1         |
| Calhoun               | R7              | R7P1         |
| Calhoun               | R8              | R8P1         |
| Calhoun               | R8              | R8P2.5       |
| Calhoun               | R8              | R8P2         |
| Calhoun               | R1              | R1C2         |
| Calhoun               | R1              | R1C3         |
| Calhoun               | R2              | R2H1         |
| Calhoun               | R7              | R7H1         |
| Calhoun               | R7              | R7H2         |
| Calhoun               | R8              | R8H1         |
| Calhoun               | R8              | R8H2.5       |
| Calhoun               | R8              | R8H2         |
| Luquillo[^fn:1]       | ElVerde         | ElVerdeM     |
| Luquillo[^fn:1]       | ElVerde         | ElVerdeR     |
| Luquillo[^fn:1]       | ElVerde         | ElVerdeT     |
| Luquillo[^fn:2]       | Icacos          | IcacosM      |
| Luquillo[^fn:2]       | Icacos          | IcacosR      |
| Luquillo[^fn:2]       | Icacos          | IcacosT      |
| Catalina[^fn:3]       | MixedCon        | MC_M         |
| Catalina[^fn:3]       | MixedCon        | MC_R         |
| Catalina[^fn:3]       | MixedCon        | MC_T         |
| Catalina[^fn:3]       | BigelowDesert   | B2D_M        |
| Catalina[^fn:3]       | BigelowDesert   | B2D_R        |
| Catalina[^fn:3]       | BigelowDesert   | B2D_T        |
| ReynoldsCr[^fn:4]     | NorthBasalt     | NB_R         |
| ReynoldsCr[^fn:4]     | NorthBasalt     | NB_T         |
| ReynoldsCr[^fn:4]     | NorthLoess      | NL_T         |
| ReynoldsCr[^fn:4]     | SWBasalt        | SWB_M        |
| ReynoldsCr[^fn:4]     | SWBasalt        | SWB_T        |
| ReynoldsCr[^fn:4]     | SWLoess         | SWL_T        |
| SouthernSierra[^fn:5] | SJER            | SJER_M       |
| SouthernSierra[^fn:5] | SJER            | SJER_R       |
| SouthernSierra[^fn:5] | SJER            | SJER_T       |
| DukeFarm              | DukeFarm        | DFPasture    |
| EKS                   | Ottawa          | EKSAgri      |
| EKS                   | Welda           | EKSNative    |
| EKS                   | Welda           | EKSPostAg    |
| KNZ                   | KNZ             | KNZNative    |
| KNZ                   | KNZ             | KNZAgri      |
| KNZ                   | KNZ             | KNZPostAg    |
| HAY                   | HAY             | HAYNative    |
| HAY                   | HAY             | HAYAgri      |
| HAY                   | HAY             | HAYPostAg    |
| TRB                   | TRB             | TRBNative    |
| TRB                   | TRB             | TRBAgri      |
| TRB                   | TRB             | TRBAgriIrrig |
| TRB                   | TRB             | TRBPostAg    |
| FRESCC                | CC1             | CC1_2020     |
| FRESCC                | CC2             | CC2_2020     |
| FRESCC                | CC2             | CC2_2022     |
| FRESCC                | CC3             | CC3_2021     |
| FRESCC                | CC3             | CC3_2022     |
| FRESCC                | CC4             | CC4_2021     |
| FRESCC                | CC5             | CC5_2021     |
| Konza                 | GrassyToe       | GrToeN01B    |
| Konza                 | WoodyToe        | WdToeN04D    |
| Konza                 | GrassyBackslope | GrBackslN01B |
| Konza                 | WoodyBackslope  | WdBackslN04D |
| Konza                 | GrassySummit    | GrSummN01B   |
| Konza                 | WoodySummit     | WdSummN04D   |
| HJAndrews[^fn:6]      | WS01            | NF_Y_A       |
| HJAndrews[^fn:6]      | WS01            | SF_Y_A       |
| HJAndrews[^fn:6]      | WS02            | NF_O_A       |
| HJAndrews[^fn:6]      | WS02            | SF_O_A       |
| HJAndrews[^fn:6]      | WS03            | NF_O_A       |
| HJAndrews[^fn:6]      | WS03            | NF_Y_A       |
| HJAndrews[^fn:6]      | WS03            | SF_O_A       |
| HJAndrews[^fn:6]      | WS03            | SF_Y_A       |
| Alps                  | Glacier         | Alps1        |
| Alps                  | GlacierRidge    | Alps2        |
| Alps                  | Limestone       | Alps3        |
| Alps                  | Gneiss          | Alps5        |
| Alps                  | Alluvial        | Alps6        |
| NH                    | ThompsonPasture | NH_TP        |
| NH                    | ThompsonForest  | NH_TF        |
| NH                    | OrganicPasture  | NH_OP        |
| NH                    | OrganicForest   | NH_OF        |
| SouthernSierra[^fn:7] | Providence      | PROV304_R    |
| SouthernSierra[^fn:7] | Providence      | PROV304_M    |
| SouthernSierra[^fn:7] | Providence      | PROV304_T    |
| RCEW                  | RCEW_OC         | RCEW_OC      |
| RCEW                  | RCEW_OJ         | RCEW_OJ      |
| RCEW                  | RCEW_OS         | RCEW_OS      |
| RCEW                  | RCEW_YC         | RCEW_YC      |
| RCEW                  | RCEW_YJ         | RCEW_YJ      |
| RCEW                  | RCEW_YS         | RCEW_YS      |


## Process {#process}


### MAT {#mat}

Gathered mainly from [NCEI at NOAA](https://www.ncei.noaa.gov/maps/annual/).

-   Turn on the "Annual Normals (2006-2020)" map layer, and disable the "Global Summary of the Year" layer.
-   Put coords into floating search box, and find a station near enough to the site to be relevant.
-   Click the wrench on "Annual Normals (2006-2020)", and use the rectangle tool to make a box around the station, just enough to select it.
-   Select the station in the menu that appears on the left side of the page, and add to cart.
-   In the new tab, click "Show List" under the "Data Types" text field.
-   Type, filter, and select both "Annual average temperature mean" and "Annual precipitation totals"
-   In the downloaded .csv, precip is labeled as ANN-PRCP-NORMAL, and temperature is labeled as ANN-TAVG-NORMAL.


### MAP {#map}

Gathered mainly from [NCEI at NOAA](https://www.ncei.noaa.gov/maps/annual/).

-   Turn on the "Annual Normals (2006-2020)" map layer, and disable the "Global Summary of the Year" layer.
-   Put coords into floating search box, and find a station near enough to the site to be relevant.
-   Click the wrench on "Annual Normals (2006-2020)", and use the rectangle tool to make a box around the station, just enough to select it.
-   Select the station in the menu that appears on the left side of the page, and add to cart.
-   In the new tab, click "Show List" under the "Data Types" text field.
-   Type, filter, and select both "Annual average temperature mean" and "Annual precipitation totals"
-   In the downloaded .csv, precip is labeled as ANN-PRCP-NORMAL, and temperature is labeled as ANN-TAVG-NORMAL.


### NPP {#npp}

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


### PET {#pet}

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


### AET, ET {#aet-et}

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


### DI {#di}

-   DI and EP are calculated with PET and MAP products.
-   PET / MAP


### EP {#ep}

-   EP and DI are calculated with PET and MAP products.
-   1 - (PET / MAP)


### GPP {#gpp}

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


## Initial .csv setup {#initial-dot-csv-setup}

-   Before you begin, we will need to edit the excel file that AppEEARS gives us.
    -   Keep only the needed columns: ID, Category, Latitude, Longitude, Date and GPP - Note that the actual GPP column is labeled something like "MOD17A2HGF_061_Gpp_500m"
        -   There are many extra columns that you will need to delete.
        -   Rename the GPP column to "GPP"
-   Create a new column called "Year". The goal is to have this column show the year in YYYY format for every sample.
    -   In the first cell (Should be E2 or F2), enter "=YEAR(D2)", where D2 refers to your date column. Change the cell type to "General" - you should see a year in YYYY format.
    -   Extend this formula down to fill in the whole Year column.
    -   Copy the whole column, and then Edit &gt; Paste Special..., and select Values. This replaces the formula dependent cells with ones that show the year in plain text.
-   The list of columns should now be ID, Category, Latitude, Longitude, Date, Year, GPP.
-   In the script, "GPP all sites.csv" refers to the downloaded .csv - you will need to either rename your file or change this to change the call in the file to point to the correct location.

<!--listend-->

```R
  library(dplyr)


gpp_data <- read.csv("GPP all sites.csv")

gpp_data <- gpp_data %>% filter(Year != 2005)

yearly_gpp <- gpp_data %>%
  group_by(ID, Category, Year) %>%
  summarize(total_GPP = sum(GPP, na.rm = TRUE), .groups = "drop")

average_gpp <- yearly_gpp %>%
  group_by(ID, Category) %>%
  summarize(average_GPP = mean(total_GPP, na.rm = TRUE), .groups = "drop")

write.csv(average_gpp, "average gpp.csv", row.names = FALSE)
```

[^fn:1]: Precipitation and temperature data for El Verde pits were gathered from [Luquillo LTER](https://luquillo.lter.network/long-term-datasets/); "[Field Station Air temperature from automatic sensor](https://portal.edirepository.org/nis/mapbrowse?scope=knb-lter-luq&identifier=184&revision=185265)" and "[Rainfall at El Verde Field Station](https://portal.edirepository.org/nis/mapbrowse?scope=knb-lter-luq&identifier=14&revision=470060)", from 2010-2023. MAT data is viewable and automatically averaged with the "Explore data" button, but MAP data needs to be downloaded, manually added and averaged.
[^fn:2]: Temperature data from the El Verde site was used. Precipitation data was pulled from [NCEI at NOAA](https://www.ncei.noaa.gov/maps/annual/).
[^fn:3]: Precipitation and temperature data for MC and B2D pits were gathered from Oregon State University's PRISM climate data base.
[^fn:4]: Precipitation and temperature data for NorthBasalt and NorthLoess pits were gathered from [Warming Alters Hydrologic Heterogeneity: Simulated Climate Sensitivity of Hydrology-Based Microrefugia in the Snow-to-Rain Transition Zone](https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2018WR023063), Table 1. NL_T is associated with Aspen, and all other pits were associated with Low sage.
[^fn:5]: Precipitation and temperature data were gathered from [Hydroshare](https://www.hydroshare.org/resource/d915275953c94b298b00872d98559e64/), from 2010-2018. Data is taken hourly, so it was summed and averaged across years. Data from 2018 was excluded from the precipitation average because it was erroneous. For temperature, TACTUAL was used in the average.
[^fn:6]: Precipitation and temperature data for HJAndrews pits were gathered from [Oregon State University](https://andrewsforest.oregonstate.edu/sites/default/files/lter/pubs/webdocs/reports/decomp/study_areas.htm#:~:text=elevation%20mixed%20conifer.-,The%20climate%20is%20characterized%20by%20cold%2C%20snowy%20winters%20and%20warm,1778%20mm%20(70%20inches).).
[^fn:7]: Precipitation and temperature data from [Hydroshare](https://www.hydroshare.org/resource/10664457c48342fa8b1e046ea740cd9c/), from 2008-2018. Data is taken hourly, so it was summed and averaged across years. For temperature, TACTUAL was used in the average.
