const NOT_FOUND_ART = String.raw`
             .          *                 .
    *                              .
                          _..._         *
         .              .:::::::.
                       :::::::::::
                   *    ':::::::'      .
                          ':'
              /\                    /\
         /\  /  \    /\      /\  /  \  /\
     ___/  \/    \__/  \_/\_/  \/    \/  \___
    /                [ 404 ]                 \
   /__________________________________________\
`;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function notFound(pathname) {
  const safePath = escapeHtml(pathname);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f4f1e8;
      color: #24231f;
      font: 16px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    main { width: min(42rem, calc(100% - 2rem)); }
    pre {
      margin: 0 0 1.5rem;
      color: #526b4d;
      font-size: clamp(.62rem, 2.25vw, .95rem);
      line-height: 1.08;
      white-space: pre;
    }
    p { margin: .45rem 0; overflow-wrap: anywhere; }
    a { color: inherit; text-underline-offset: .2em; }
    @media (prefers-color-scheme: dark) {
      body { background: #1d1e1b; color: #e8e4d8; }
      pre { color: #9fbc96; }
    }
  </style>
</head>
<body>
  <main>
    <pre aria-hidden="true">${NOT_FOUND_ART}</pre>
    <p>nothing here: <code>${safePath}</code></p>
    <p><a href="https://mor-gan.com/">return to mor-gan.com</a></p>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function objectResponse(request, object) {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("ETag", object.httpEtag);
  headers.set("X-Content-Type-Options", "nosniff");

  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "public, max-age=3600");
  }

  if (request.method === "HEAD") {
    headers.set("Content-Length", String(object.size));
    return new Response(null, { status: 200, headers });
  }

  if (!("body" in object)) {
    const notModified = request.headers.has("If-None-Match") ||
      request.headers.has("If-Modified-Since");
    return new Response(null, {
      status: notModified ? 304 : 412,
      headers,
    });
  }

  let status = 200;
  if (request.headers.has("Range") && object.range) {
    const start = object.range.offset;
    const length = object.range.length;
    headers.set("Content-Range", `bytes ${start}-${start + length - 1}/${object.size}`);
    headers.set("Content-Length", String(length));
    status = 206;
  } else {
    headers.set("Content-Length", String(object.size));
  }

  return new Response(request.method === "HEAD" ? null : object.body, {
    status,
    headers,
  });
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed\n", {
        status: 405,
        headers: {
          "Allow": "GET, HEAD",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const url = new URL(request.url);
    let key;
    let displayPath;
    try {
      displayPath = decodeURIComponent(url.pathname);
      key = displayPath.slice(1);
    } catch {
      return notFound(url.pathname);
    }

    if (!key) {
      return notFound(url.pathname);
    }

    if (request.method === "HEAD") {
      const object = await env.FILES.head(key);
      return object === null ? notFound(displayPath) : objectResponse(request, object);
    }

    const object = await env.FILES.get(key, {
      onlyIf: request.headers,
      range: request.headers,
    });

    if (object === null) {
      return notFound(displayPath);
    }

    return objectResponse(request, object);
  },
};
