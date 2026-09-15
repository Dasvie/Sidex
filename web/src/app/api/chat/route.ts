/* Sidex assistant. Answers from two things only: the published catalogue (read from the DB
   on every call) and the site's own rules. Off unless ANTHROPIC_API_KEY is set; the widget is
   not rendered in that case, so this route only ever sees real traffic. */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { CATEGORIES, categoryName, stageName } from "@/lib/categories";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

function clean(input: unknown): Msg[] {
  if (!Array.isArray(input)) return [];
  const out: Msg[] = [];
  for (const m of input) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
    const content = m.content.trim().slice(0, 2000);
    if (!content) continue;
    if (out.length && out[out.length - 1].role === m.role) continue; // Anthropic wants alternating turns
    out.push({ role: m.role, content });
  }
  while (out.length && out[0].role !== "user") out.shift();
  return out.slice(-12);
}

async function catalogue(lang: Lang) {
  const rows = await db
    .select({
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      taglineEn: products.taglineEn,
      url: products.url,
      stage: products.stage,
      categories: products.categories,
      makerName: products.makerName,
      reviews: products.reviewCount,
      comments: products.commentCount,
    })
    .from(products)
    .where(eq(products.published, true));
  return rows
    .map((r) => {
      const cats = r.categories.map((c) => categoryName(c, lang)).join(", ");
      const line = lang === "en" && r.taglineEn ? r.taglineEn : r.tagline;
      return `- ${r.name} (/p/${r.slug}): ${line}. ${cats}. ${stageName(r.stage, lang)}. ${r.url}. reviews ${r.reviews}, comments ${r.comments}.${r.makerName ? ` maker: ${r.makerName}` : ""}`;
    })
    .join("\n");
}

function system(lang: Lang, list: string) {
  const cats = CATEGORIES.map((c) => `${categoryName(c.slug, lang)} (/c/${c.slug})`).join(", ");
  return [
    "You are the Sidex assistant. Sidex is a Korean catalogue where developers and vibe coders register the products they built; ranking is decided by reviews and comments.",
    "Facts about Sidex:",
    "- Ranking score = reviews × 3 + comments × 1 + replies × 0.5. No date ranking, no upvotes, stars are not counted, the maker's own comments are not counted.",
    "- Registering a product: /submit. Needs login with Google, Kakao or Naver. Browsing needs no login.",
    "- A review needs a star rating, four axes (usability, polish, design, originality), a good point and a bad point. One review per person per product. Makers cannot review their own product. Replies to comments are one level deep.",
    `- Categories: ${cats}. Rankings by category: /c. Search: /search?q=...`,
    "- Notion, Figma and Linear are worked examples Sidex introduces itself, not member submissions.",
    "Catalogue (everything currently published):",
    list || "(empty)",
    "Rules: answer only from the facts and catalogue above; if something is not there, say you don't know. Keep answers short (a few sentences). Refer to pages by their path exactly as written, e.g. /p/notion. No markdown, no bullet symbols, no headings.",
    lang === "en" ? "Answer in English unless the user writes in Korean." : "Answer in Korean unless the user writes in English. Use short 해요체.",
  ].join("\n");
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "off" }, { status: 503 });
  let body: { messages?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const lang: Lang = body.lang === "en" ? "en" : "ko";
  const messages = clean(body.messages);
  if (!messages.length) return NextResponse.json({ error: "empty" }, { status: 400 });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 600, system: system(lang, await catalogue(lang)), messages }),
  });
  if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text || "").join("").trim();
  return NextResponse.json({ text });
}
