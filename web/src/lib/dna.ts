/* Design DNA, measured, never guessed.
   Fetches the page and its stylesheets, then counts what the CSS actually declares:
   the font families it names and the hex colours it uses most. Anything the CSS does
   not say (type scale, layout) is not reported. The record carries the date it was taken. */
import type { Dna } from "@/db/schema";

// A browser-shaped UA: several sites answer bots with a challenge page and no CSS.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 SidexBot/1.0";
const MAX_BYTES = 2_500_000; // modern marketing pages inline a lot of CSS
const MAX_SHEETS = 60; // code-split sites ship dozens of small files; the total is capped below
const MAX_CSS_TOTAL = 3_000_000;
const GENERIC = new Set(["inherit", "initial", "unset", "sans-serif", "serif", "monospace", "system-ui", "ui-sans-serif", "ui-monospace", "ui-serif", "cursive", "fantasy", "emoji", "math"]);
const SYSTEM = new Set(["-apple-system", "blinkmacsystemfont", "segoe ui", "roboto", "helvetica neue", "helvetica", "arial", "apple sd gothic neo", "malgun gothic", "noto sans", "noto color emoji", "apple color emoji", "segoe ui emoji", "segoe ui symbol"]);

async function get(url: string, accept: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept }, signal: ctrl.signal, redirect: "follow" });
    if (!r.ok) return "";
    const buf = await r.arrayBuffer();
    return new TextDecoder("utf-8", { fatal: false }).decode(buf.slice(0, MAX_BYTES));
  } catch {
    return "";
  } finally {
    clearTimeout(t);
  }
}

function firstFamily(list: string) {
  return list.split(",")[0].trim().replace(/^["']|["']$/g, "").replace(/\s*!important/i, "");
}

function fontsOf(css: string) {
  const tally = new Map<string, number>();
  const add = (first: string, w: number) => {
    const key = first.toLowerCase();
    if (!first || key.startsWith("var(") || GENERIC.has(key) || SYSTEM.has(key)) return;
    tally.set(first, (tally.get(first) || 0) + w);
  };
  const re = /font-family\s*:\s*([^;}{]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) add(firstFamily(m[1]), 1);
  // Sites built on design tokens name the face once, in a custom property, and reference it
  // everywhere with var(). Count those definitions so the token-based sites are not blank.
  const tok = /(--[\w-]*font[\w-]*)\s*:\s*([^;}{]+)/gi;
  while ((m = tok.exec(css))) {
    if (/feature|variation|size|weight|style|smooth|display|stretch|kerning|synthesis/i.test(m[1])) continue;
    const v = firstFamily(m[2]);
    // sizes, weights and line-heights also carry "font" in their token names
    if (/^[\d.]|^var\(|^normal|^bold|^(lighter|bolder)|\d(px|rem|em|%)/i.test(v) || !/[a-z]{3}/i.test(v)) continue;
    add(v, 2);
  }
  // @font-face declares the faces the site ships; count those too
  const ff = /@font-face\s*{[^}]*font-family\s*:\s*["']?([^;"'}]+)/gi;
  while ((m = ff.exec(css))) {
    const name = m[1].trim();
    if (name) tally.set(name, (tally.get(name) || 0) + 3);
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n);
}

function paletteOf(css: string) {
  const tally = new Map<string, number>();
  const bump = (hex: string) => tally.set(hex, (tally.get(hex) || 0) + 1);
  const re = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    let h = m[1].toLowerCase();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    bump("#" + h);
  }
  // rgb()/rgba() with a solid alpha count as the same colour
  const rgb = /rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*(?:[,/]\s*(1|1\.0|100%)\s*)?\)/gi;
  while ((m = rgb.exec(css))) {
    const [r, g, b] = [m[1], m[2], m[3]].map((n) => Math.min(255, Number(n)));
    bump("#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join(""));
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c);
}

export async function measureDna(url: string): Promise<Dna | null> {
  const html = await get(url, "text/html");
  if (!html) return null;
  let css = "";
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) css += m[1] + "\n";
  const hrefs = [...html.matchAll(/<link[^>]+rel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi)]
    .map((m) => /href=["']([^"']+)["']/i.exec(m[0])?.[1])
    .filter((h): h is string => !!h)
    .slice(0, MAX_SHEETS);
  for (const h of hrefs) {
    if (css.length > MAX_CSS_TOTAL) break;
    try {
      css += (await get(new URL(h, url).toString(), "text/css")) + "\n";
    } catch {}
  }
  const fonts = fontsOf(css);
  const palette = paletteOf(css);
  if (!fonts.length && !palette.length) return null;
  return { fonts, palette, measuredAt: new Date().toISOString().slice(0, 10) };
}
