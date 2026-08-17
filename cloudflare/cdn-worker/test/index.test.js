import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.js";

function storedObject(body = "hello") {
  return {
    body,
    httpEtag: '"abc123"',
    range: undefined,
    size: body.length,
    writeHttpMetadata(headers) {
      headers.set("Content-Type", "text/plain");
    },
  };
}

function environment(result) {
  return {
    FILES: {
      async get() {
        return result;
      },
      async head() {
        return result;
      },
    },
  };
}

test("returns the custom page and a real 404 for missing keys", async () => {
  const response = await worker.fetch(
    new Request("https://cdn.mor-gan.com/picarro"),
    environment(null),
  );

  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(await response.text(), /nothing here: <code>\/picarro<\/code>/);
});

test("escapes the requested path before placing it in HTML", async () => {
  const response = await worker.fetch(
    new Request("https://cdn.mor-gan.com/%3Cscript%3E"),
    environment(null),
  );

  const body = await response.text();
  assert.doesNotMatch(body, /<script>/);
  assert.match(body, /&lt;script&gt;/);
});

test("streams an existing object with its metadata", async () => {
  const response = await worker.fetch(
    new Request("https://cdn.mor-gan.com/example.txt"),
    environment(storedObject()),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("etag"), '"abc123"');
  assert.equal(response.headers.get("accept-ranges"), "bytes");
  assert.equal(await response.text(), "hello");
});

test("serves HEAD without an object body", async () => {
  const response = await worker.fetch(
    new Request("https://cdn.mor-gan.com/example.txt", { method: "HEAD" }),
    environment(storedObject()),
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-length"), "5");
  assert.equal(await response.text(), "");
});

test("returns partial-content headers for an R2 range", async () => {
  const object = storedObject("ell");
  object.size = 5;
  object.range = { offset: 1, length: 3 };

  const response = await worker.fetch(
    new Request("https://cdn.mor-gan.com/example.txt", {
      headers: { Range: "bytes=1-3" },
    }),
    environment(object),
  );

  assert.equal(response.status, 206);
  assert.equal(response.headers.get("content-range"), "bytes 1-3/5");
  assert.equal(response.headers.get("content-length"), "3");
});

test("does not expose write operations", async () => {
  const response = await worker.fetch(
    new Request("https://cdn.mor-gan.com/example.txt", { method: "DELETE" }),
    environment(storedObject()),
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});
