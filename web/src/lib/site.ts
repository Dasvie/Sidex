/* Reads what a site says about itself: <title> / og:title, meta description, icon.
   Used by the submit form to draft the name and one-liner; the submitter edits from there.
   Only public hosts are fetched (see guard.ts); results are cached for five minutes. */
import { faviconFor } from "./slug";
import { publicUrl } from "./guard";

export type SiteRead = { title: string; description: string; favicon: string };

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const cache = new Map<string, { at: number; v: SiteRead | null }>();
const TTL = 5 * 60_000;

function meta(html: string, ...names: string[]) {
  for (const n of names) {
    const re = new RegExp(`<meta[^>]+(?:property|name)=["']${n}["'][^>]*content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${n}["']`, "i");
    const m = re.exec(html);
    const v = (m?.[1] ?? m?.[2] ?? "").trim();
    if (v) return decode(v);
  }
  return "";
}
function decode(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/** Pure part: pulls title, description and icon out of an HTML document. */
export function parseSite(html: string, base: string): SiteRead {
  const title = meta(html, "og:title", "twitter:title") || decode(/<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1] ?? "");
  const description = meta(html, "description", "og:description", "twitter:description");
  const icon = /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i.exec(html)?.[1];
  let favicon = "";
  if (icon) {
    try { favicon = new URL(icon, base).toString(); } catch {}
  }
  return { title: title.slice(0, 60), description: description.slice(0, 120), favicon: favicon || faviconFor(base) };
}

export async function readSite(url: string): Promise<SiteRead | null> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL) return hit.v;
  const u = await publicUrl(url);
  if (!u) return null;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  let out: SiteRead | null = null;
  try {
    const res = await fetch(u, { headers: { "user-agent": UA, accept: "text/html", "accept-language": "ko-KR,ko;q=0.9,en;q=0.8" }, signal: ctl.signal, redirect: "follow" });
    if (res.ok) out = parseSite((await res.text()).slice(0, 512 * 1024), res.url || u.toString());
  } catch {
    out = null;
  } finally {
    clearTimeout(timer);
  }
  cache.set(url, { at: Date.now(), v: out });
  if (cache.size > 500) for (const [k, v] of cache) if (Date.now() - v.at >= TTL) cache.delete(k);
  return out;
}
