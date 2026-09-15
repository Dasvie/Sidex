export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .slice(0, 40);
}

/** Handle from an email or name: lowercase, [a-z0-9_], 3..30 chars. */
export function deriveHandle(seed: string) {
  let h = String(seed || "").split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  if (h.length < 3) h = (h || "builder") + "_" + Math.random().toString(36).slice(2, 5);
  return h.slice(0, 30);
}

export function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Google's favicon service: a real image for every registered URL, no upload needed. */
export function faviconFor(url: string, size = 128) {
  const host = hostOf(url);
  return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=${size}` : "";
}
