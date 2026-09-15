import { t, type Key, type Lang } from "./i18n";

export const CATEGORIES = [
  { slug: "engineering", key: "c_engineering" },
  { slug: "llm", key: "c_llm" },
  { slug: "productivity", key: "c_productivity" },
  { slug: "marketing", key: "c_marketing" },
  { slug: "design", key: "c_design" },
  { slug: "social", key: "c_social" },
  { slug: "finance", key: "c_finance" },
  { slug: "agents", key: "c_agents" },
  { slug: "etc", key: "c_etc" },
] as const satisfies readonly { slug: string; key: Key }[];

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const STAGE_KEYS: Record<string, Key> = { idea: "stage_idea", prototype: "stage_prototype", launched: "stage_launched" };

export const AXES = [
  { key: "ux", name: "ax_ux" },
  { key: "polish", name: "ax_polish" },
  { key: "design", name: "ax_design" },
  { key: "originality", name: "ax_originality" },
] as const satisfies readonly { key: string; name: Key }[];

export function categoryName(slug: string, lang: Lang = "ko") {
  const c = CATEGORIES.find((x) => x.slug === slug) ?? CATEGORIES[CATEGORIES.length - 1];
  return t(lang, c.key);
}

export function stageName(stage: string, lang: Lang = "ko") {
  return t(lang, STAGE_KEYS[stage] ?? "stage_launched");
}

export function isCategory(slug: string): slug is CategorySlug {
  return CATEGORIES.some((c) => c.slug === slug);
}
