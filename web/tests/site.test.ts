import test from "node:test";
import assert from "node:assert/strict";
import { parseSite } from "../src/lib/site";

test("og:title wins over <title>, description and icon resolve", () => {
  const html = `<html><head><title>Fallback</title>
    <meta property="og:title" content="Linear &amp; friends">
    <meta name="description" content="Purpose-built for planning.">
    <link rel="icon" href="/favicon.ico?v=2"></head></html>`;
  const r = parseSite(html, "https://linear.app/");
  assert.equal(r.title, "Linear & friends");
  assert.equal(r.description, "Purpose-built for planning.");
  assert.equal(r.favicon, "https://linear.app/favicon.ico?v=2");
});

test("falls back to <title> and a favicon service when tags are missing", () => {
  const r = parseSite("<html><head><title>  Plain   site </title></head></html>", "https://example.com/x");
  assert.equal(r.title, "Plain site");
  assert.equal(r.description, "");
  assert.match(r.favicon, /example\.com/);
});

test("content before the name attribute is still read", () => {
  const r = parseSite(`<meta content="Reversed order" name="description">`, "https://a.b/");
  assert.equal(r.description, "Reversed order");
});

test("long values are cut to the field limits", () => {
  const r = parseSite(`<title>${"x".repeat(200)}</title><meta name="description" content="${"y".repeat(300)}">`, "https://a.b/");
  assert.equal(r.title.length, 60);
  assert.equal(r.description.length, 120);
});
