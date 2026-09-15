import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractNotes, parseDesignMd } from "../src/lib/designmd";

const notion = parseDesignMd(readFileSync(join(__dirname, "../src/db/design/notion.md"), "utf8"))!;

test("front matter tokens are parsed", () => {
  assert.equal(notion.tokens.colors.primary, "#0075de");
  assert.equal(notion.tokens.typography["display-1"].fontSize, "64px");
  assert.equal(notion.tokens.rounded.full, "9999px");
});

test("colour notes come from the body bullets, one per token", () => {
  const n = extractNotes(notion.body);
  assert.equal(n.colors.primary.label, "Notion Blue");
  assert.match(n.colors.primary.note, /structural accent/);
  assert.equal(n.colors["accent-purple"].label, "Sticker Purple");
  assert.equal(n.colors["accent-purple"].note, "");
});

test("type samples take the quoted example from the hierarchy table", () => {
  const n = extractNotes(notion.body);
  assert.equal(n.typeSamples["display-1"], "Meet the night shift");
  assert.equal(n.typeSamples["heading-1"], "Plans and features");
});

test("tables under elevation and breakpoints are read row by row", () => {
  const n = extractNotes(notion.body);
  assert.equal(n.elevation.length, 3);
  assert.equal(n.breakpoints.length, 4);
  assert.equal(n.breakpoints[0][0], "Wide");
});

test("em dashes never survive into a note", () => {
  const n = extractNotes(notion.body);
  const all = [...Object.values(n.colors).map((c) => c.note), ...Object.values(n.components).map((c) => c.note), n.spacingNote, n.typeIntro];
  for (const s of all) assert.ok(!s.includes("—"), s);
});

test("an empty file yields nothing", () => {
  assert.equal(parseDesignMd(""), null);
});
