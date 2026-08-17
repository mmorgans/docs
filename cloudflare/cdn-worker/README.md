# cdn.mor-gan.com Worker

This read-only Cloudflare Worker serves objects from the `files` R2 bucket and
returns a small custom HTML page for missing keys. It is routed over the bucket's
existing `cdn.mor-gan.com` custom domain.

Run `npm test` before deploying with `npm run deploy`. Valid object responses
preserve stored HTTP metadata, ETags, conditional requests, `HEAD`, and byte
ranges. Missing responses retain the HTTP `404` status and are not cached.
