/* DESIGN.md reader. The file is YAML front matter (tokens) + a markdown body.
   parse() returns the token tree, the raw body, and the body as HTML with every
   `{group.token}` reference resolved to its value so the prose can be read without the table. */
import { parse as parseYaml } from "yaml";
import { marked } from "marked";

export type TypeToken = { fontFamily?: string; fontSize?: string; fontWeight?: string | number; lineHeight?: string | number; letterSpacing?: string };
export type ComponentToken = Record<string, string>;
export type DesignTokens = {
  name?: string;
  description?: string;
  colors: Record<string, string>;
  typography: Record<string, TypeToken>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
  components: Record<string, ComponentToken>;
};
export type DesignDoc = { tokens: DesignTokens; body: string; bodyHtml: string; raw: string };

const EMPTY: DesignTokens = { colors: {}, typography: {}, rounded: {}, spacing: {}, components: {} };

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Resolves "{colors.primary}" against the token tree; returns the raw string if unknown. */
export function resolve(tokens: DesignTokens, ref: string): string {
  const m = /^\{([\w-]+)\.([\w-]+)\}$/.exec(String(ref).trim());
  if (!m) return String(ref);
  const group = (tokens as unknown as Record<string, Record<string, unknown>>)[m[1]];
  const v = group?.[m[2]];
  if (v == null) return ref;
  return typeof v === "object" ? JSON.stringify(v) : String(v);
}

function refToHtml(tokens: DesignTokens, whole: string, group: string, key: string) {
  const g = (tokens as unknown as Record<string, Record<string, unknown>>)[group];
  const v = g?.[key];
  if (v == null) return `<code>${esc(whole)}</code>`;
  if (group === "colors" && typeof v === "string")
    return `<span class="dm-ref"><i class="dm-swatch" style="background:${esc(v)}"></i>${esc(key)} <code>${esc(v)}</code></span>`;
  if (typeof v === "object") {
    const t = v as TypeToken;
    const s = [t.fontSize, t.fontWeight, t.fontFamily].filter(Boolean).join(" / ");
    return `<span class="dm-ref">${esc(group)}.${esc(key)}${s ? ` <code>${esc(s)}</code>` : ""}</span>`;
  }
  return `<span class="dm-ref">${esc(group)}.${esc(key)} <code>${esc(String(v))}</code></span>`;
}

export function parseDesignMd(raw: string): DesignDoc | null {
  if (!raw || !raw.trim()) return null;
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  let tokens: DesignTokens = { ...EMPTY };
  let body = raw;
  if (m) {
    try {
      const fm = parseYaml(m[1]) as Partial<DesignTokens> | null;
      tokens = { ...EMPTY, ...(fm || {}) } as DesignTokens;
    } catch {}
    body = m[2];
  }
  // {group.token} references become readable inline chips; everything else is plain markdown
  const withRefs = body.replace(/`?\{([\w-]+)\.([\w-]+)\}`?/g, (whole, g, k) => refToHtml(tokens, whole, g, k));
  const bodyHtml = marked.parse(withRefs, { async: false, gfm: true }) as string;
  return { tokens, body, bodyHtml, raw };
}

/* ---------- Notes pulled out of the markdown body for the preview ----------
   The body is prose; the preview only needs the sentence attached to each token. Nothing
   below invents copy: every string is lifted from the file, trimmed to its first clause. */
export type ColorNote = { label: string; note: string };
export type ComponentNote = { title: string; label: string; note: string };
export type TableRow = string[];
export type DesignNotes = {
  colors: Record<string, ColorNote>;
  typeSamples: Record<string, string>;
  typeIntro: string;
  components: Record<string, ComponentNote>;
  spacingNote: string;
  radiusUse: Record<string, string>;
  elevation: TableRow[];
  breakpoints: TableRow[];
  touch: string;
  collapse: string;
};

/** Markdown inline → plain text. `{group.token}` refs become the token name. */
function plain(s: string) {
  return s
    .replace(/`?\{[\w-]+\.([\w-]+)\}`?/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+—\s+/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}
function firstClause(s: string, max = 110) {
  const t = plain(s).replace(/^[\s—:,-]+/, "");
  const m = /^(.+?[.!?])(\s|$)/.exec(t);
  const out = m && m[1].length >= 12 ? m[1] : t;
  if (out.length <= max) return out;
  const cut = out.slice(0, max).replace(/[,;:\s]+\S*$/, "");
  return cut + "…";
}
function sentences(s: string, n: number) {
  const parts = s.match(/[^.!?]+[.!?]+(\s|$)/g);
  return parts ? parts.slice(0, n).join("").trim() : s;
}
function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
function section(body: string, heading: RegExp) {
  const lines = body.split("\n");
  const i = lines.findIndex((l) => heading.test(l));
  if (i < 0) return "";
  const level = (/^(#+)/.exec(lines[i])?.[1].length) ?? 2;
  const out: string[] = [];
  for (let j = i + 1; j < lines.length; j++) {
    const m = /^(#+)\s/.exec(lines[j]);
    if (m && m[1].length <= level) break;
    out.push(lines[j]);
  }
  return out.join("\n");
}
function table(md: string): TableRow[] {
  const rows = md.split("\n").filter((l) => /^\|/.test(l.trim()));
  return rows
    .slice(2)
    .map((r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .filter((r) => r.some(Boolean));
}
function firstParagraph(md: string) {
  const block = md.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !/^[#|>]/.test(p)) || "";
  return block.split("\n").map((l) => l.replace(/^- /, "")).join(" ");
}

export function extractNotes(body: string): DesignNotes {
  const colors: Record<string, ColorNote> = {};
  for (const line of body.split("\n")) {
    if (!line.startsWith("- ") || !line.includes("{colors.")) continue;
    const groups = [...line.matchAll(/\*\*([^*]+)\*\*[ \t]*\(([^)]*?\{colors\.[^)]*)\)/g)];
    if (!groups.length) continue;
    const last = groups[groups.length - 1];
    const tail = line.slice((last.index ?? 0) + last[0].length).replace(/^[ \t]*:?[ \t]*/, "");
    const note = tail ? cap(firstClause(tail)) : "";
    for (const g of groups) {
      const label = g[1].trim();
      for (const k of g[2].matchAll(/\{colors\.([\w-]+)\}/g)) if (!colors[k[1]]) colors[k[1]] = { label, note: groups.length === 1 ? note : "" };
    }
  }

  const typeSamples: Record<string, string> = {};
  for (const r of table(section(body, /^###\s+Hierarchy/))) {
    const key = /\{typography\.([\w-]+)\}/.exec(r[0])?.[1];
    const use = r[r.length - 1] || "";
    if (!key) continue;
    const q = /[“"]([^”"]{3,})[”"]/.exec(use);
    typeSamples[key] = q ? q[1] : plain(use);
  }
  const typeIntro = sentences(plain(firstParagraph(section(body, /^###\s+Font Family/))), 2);

  const components: Record<string, ComponentNote> = {};
  const compBody = section(body, /^##\s+Components/);
  for (const m of compBody.matchAll(/^\*\*`([\w-]+)`\*\*\s*(?:—\s*(.*))?$\n((?:^- .*\n?)*)/gm)) {
    const key = m[1];
    if (key.startsWith("ex-")) continue;
    const head = m[2] || "";
    const q = /[“"(]([^”")]{2,40})[”")]/.exec(head);
    const label = q ? q[1].replace(/^["“]|["”]$/g, "") : "";
    const bullets = m[3].split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
    let title = plain(head.replace(/\s*\(.*?\)\s*$/, "")) || key;
    // a heading that is a whole sentence is a description, not a name
    if (title.length > 44) { bullets.unshift(title); title = key; }
    components[key] = { title, label, note: bullets.length ? cap(firstClause(bullets.join(" "), 150)) : "" };
  }

  const spacingMd = section(body, /^###\s+Spacing System/);
  const spacingNote = plain(
    spacingMd.split("\n").filter((l) => l.startsWith("- ") && !/Tokens/i.test(l)).map((l) => l.slice(2)).join(" "),
  );

  const radiusUse: Record<string, string> = {};
  for (const r of table(section(body, /^###\s+Border Radius/))) {
    const key = /\{rounded\.([\w-]+)\}/.exec(r[0])?.[1];
    if (key) radiusUse[key] = plain(r[r.length - 1] || "");
  }

  const elevation = table(section(body, /^##\s+Elevation/)).map((r) => r.map(plain));
  const breakpoints = table(section(body, /^####?\s+Breakpoints/)).map((r) => r.map(plain));
  const touch = plain(firstParagraph(section(body, /^####?\s+Touch Targets/)));
  const collapse = plain(firstParagraph(section(body, /^####?\s+Collapsing/)));

  return { colors, typeSamples, typeIntro, components, spacingNote, radiusUse, elevation, breakpoints, touch, collapse };
}
