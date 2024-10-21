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
-   In the script, "appears.csv" refers to the downloaded .csv - you will need to either rename your file or change this to change the call in the file to point to the correct location.

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
