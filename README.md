# docs

Documentation site source for [docs.mor-gan.com](https://docs.mor-gan.com).

## Local development

```bash
hugo server -D
```

## Build check

```bash
hugo --gc --minify
```

## Image optimization

Generate `.webp` sidecars for images in `static/images`:

```bash
./scripts/optimize-images.sh
```

Optional quality override:

```bash
WEBP_QUALITY=78 ./scripts/optimize-images.sh
```

Standard Markdown/Org-exported images automatically use matching `.webp` sidecars when available via `layouts/_default/_markup/render-image.html`.

## Screenshot shortcode

Use this in Markdown posts:

```markdown
{{< screenshot src="/images/egm4/main-interface.png" alt="open-egm4 main interface" caption="Main interface" >}}
```

If a matching `.webp` exists (`/images/egm4/main-interface.webp`), it is served automatically via `<picture>`.

## CI

GitHub Actions runs a Hugo build on pull requests and pushes to `main` (`.github/workflows/hugo.yml`).
