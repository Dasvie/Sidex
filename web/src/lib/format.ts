import { t, type Lang } from "./i18n";

export function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const x = new Date(d);
  if (isNaN(x.getTime())) return "";
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, "0")}.${String(x.getDate()).padStart(2, "0")}`;
}

export function fromNow(d: Date | string | null | undefined, lang: Lang = "ko") {
  if (!d) return "";
  const x = new Date(d);
  if (isNaN(x.getTime())) return "";
  const min = Math.floor((Date.now() - x.getTime()) / 60000);
  if (min < 1) return t(lang, "just_now");
  if (min < 60) return t(lang, "min_ago", { n: min });
  if (min < 1440) return t(lang, "hour_ago", { n: Math.floor(min / 60) });
  if (min < 10080) return t(lang, "day_ago", { n: Math.floor(min / 1440) });
  return fmtDate(x);
}

export function rating(x10: number) {
  return x10 ? (x10 / 10).toFixed(1) : "";
}

export function initials(name: string) {
  const s = String(name || "").trim();
  return s ? s.slice(0, 1).toUpperCase() : "·";
}
