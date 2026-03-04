# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Hugo-based documentation site (https://docs.mor-gan.com) using the PaperMod theme. Content is authored in Org-mode format and auto-exported to Markdown via Emacs org-hugo.

## Build & Development Commands

**Local development server:**
```bash
hugo server -D
```

**Production build check:**
```bash
hugo --gc --minify
```

**Image optimization:**
```bash
./scripts/optimize-images.sh
```
- Generates `.webp` sidecars for images in `static/images/`
- Override quality: `WEBP_QUALITY=78 ./scripts/optimize-images.sh`
- Requires `cwebp` (install via `brew install webp`)

## Content Workflow

### Org-mode to Markdown Export

Content lives in `content-org/all-posts.org` as a single Org file with multiple posts. Each post is a top-level heading with properties:

```org
* DONE Post Title :tag1:tag2:
CLOSED: [2024-08-13 Tue 11:37]
:PROPERTIES:
:EXPORT_FILE_NAME: post-filename
:END:
```

- `.dir-locals.el` enables `org-hugo-auto-export-mode` in the `content-org/` directory
- When editing in Emacs, posts auto-export to `content/posts/*.md` on save
- Export creates individual Markdown files with front matter
- If not using Emacs with org-hugo, manually export or edit Markdown files directly in `content/posts/`

### Manual Markdown Authoring

Can also create/edit files directly in `content/posts/*.md` bypassing the Org workflow.

## Image Handling

Images are stored in `static/images/` (typically `static/images/egm4/`).

### WebP Auto-Serving

The site automatically serves `.webp` versions when available:

1. **Standard Markdown images** - `layouts/_default/_markup/render-image.html` wraps images in `<picture>` elements with WebP sources
2. **Screenshot shortcode** - `layouts/shortcodes/screenshot.html` provides enhanced image display:

```markdown
{{< screenshot src="/images/egm4/main-interface.png" alt="Description" caption="Caption text" >}}
```

Both approaches check for matching `.webp` sidecars (e.g., `main-interface.webp` for `main-interface.png`) and serve them automatically via `<picture>` elements.

## Site Configuration

- **Config:** `hugo.yaml` - PaperMod theme with dark mode default, search enabled (Fuse.js), edit links to GitHub
- **Theme:** PaperMod (Git submodule in `themes/papermod/`)
- **Custom layouts:** `layouts/` override theme defaults
  - Custom image render hook for WebP support
  - Custom screenshot shortcode with linking and captions
  - Custom footer and head extensions

## CI/CD

GitHub Actions (`.github/workflows/hugo.yml`) runs `hugo --gc --minify` on PRs and pushes to `main`. Uses Hugo 0.148.2 extended.

## Architecture Notes

**Content structure:**
- `content/posts/*.md` - Generated from Org or manually authored
- `content/search.md` - Search page
- `static/images/` - Images with optional `.webp` sidecars
- `public/` - Built site (not committed)

**Key customizations:**
- WebP optimization pipeline via script + automatic serving via custom render hooks
- Org-mode single-file workflow with auto-export
- Screenshot shortcode with automatic WebP detection and optional linking

**Theme overrides:**
- `layouts/_default/_markup/render-image.html` - Custom image rendering
- `layouts/shortcodes/screenshot.html` - Screenshot component
- `layouts/partials/` - Footer and head extensions
