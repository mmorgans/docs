+++
title = "Creating this website"
draft = true
+++

## Introduction {#introduction}

This document details the steps I followed to create my website using Hugo, Cloudflare Pages, and associated tools. It includes setting up a static site generator, configuring themes, deploying to Cloudflare Pages, and troubleshooting common issues.


## Prerequisites {#prerequisites}

Before starting, ensure you have the following installed on your system:

-   `Hugo`
-   `Git`
-   A GitHub account for version control
-   A Cloudflare account for deployment


## Setting Up Hugo {#setting-up-hugo}


### Install Hugo: {#install-hugo}

Hugo is a fast, modern static site generator. I installed it using Homebrew:

```bash
       brew install hugo
```


### Create a New Hugo Site: {#create-a-new-hugo-site}

I initialized a new Hugo site by running the following command:

```bash
       hugo new site mysite
```


### Choose and Install a Theme: {#choose-and-install-a-theme}

I opted for the `PaperMod` theme, which offers a clean and modern look:

```bash
       git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/papermod
```

After adding the theme, I configured the site by editing the `hugo.toml` file to use the `PaperMod` theme.


## Building and Previewing the Site {#building-and-previewing-the-site}


### Build the Site Locally: {#build-the-site-locally}

To build and preview the site locally, I used the following command:

```bash
       hugo server -D
```

This command starts a local server where I could view my site at `http://localhost:1313`.


### Customizing the Site: {#customizing-the-site}

I customized various aspects of the site, including the footer, search functionality, and more, by editing the relevant files in the `themes/papermod` directory.


## Deploying to Cloudflare Pages {#deploying-to-cloudflare-pages}


### Set Up Cloudflare Pages: {#set-up-cloudflare-pages}

I configured Cloudflare Pages to deploy the site directly from my GitHub repository. I connected my repository to Cloudflare Pages and set the build command to:

```bash
       hugo
```

The output directory was set to `public`.


### Troubleshooting Deployment Issues: {#troubleshooting-deployment-issues}

One issue I encountered was related to submodules not deploying correctly. I resolved this by ensuring the `.gitmodules` file was properly configured:

```ini
       [submodule "themes/papermod"]
           path = themes/papermod
           url = https://github.com/adityatelange/hugo-PaperMod.git
```


## Adding Functionality {#adding-functionality}


### Adding Search: {#adding-search}

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


### Enhancing the Footer: {#enhancing-the-footer}

Customizing the footer required editing the theme's configuration and files in the `themes/papermod` directory.
