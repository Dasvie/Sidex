import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, categoryName, isCategory } from "@/lib/categories";
import { rankProducts } from "@/lib/rank";
import { getT } from "@/lib/lang";
import { ProductRow } from "@/components/ProductRow";
import { label as topicLabel, topicById } from "@/lib/planmap";

export async function generateMetadata(): Promise<Metadata> {
  const T = await getT();
  return { title: T("search") };
}
export const dynamic = "force-dynamic";

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string; topic?: string; category?: string }> }) {
  const T = await getT();
  const sp = await searchParams;
  const q = (sp.q || "").trim().slice(0, 80);
  const topic = topicById((sp.topic || "").trim().slice(0, 80));
  const topicId = topic ? (sp.topic || "").trim() : "";
  const needle = q.toLowerCase();
  const category = isCategory(sp.category || "") ? sp.category : "";
  const hits = q || topic ? await rankProducts({ scope: "all", q: q || undefined, topic: topicId || undefined, category: category || undefined }) : [];
  const present = [...new Set(hits.flatMap((r) => r.categories))];
  const cats = CATEGORIES.filter((c) => needle && (categoryName(c.slug, "ko").toLowerCase().includes(needle) || categoryName(c.slug, "en").toLowerCase().includes(needle) || c.slug.includes(needle)));
  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">{topic ? T("topic_title") : T("search")}</p>
        <h1 className="h1">{topic ? topicLabel(topic.node, T.lang) : q ? `"${q}"` : T("search_title_empty")}</h1>
        {topic && <p className="lead"><Link href={`/t/${topicId}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{categoryName(topic.cat, T.lang)} · {T("topic_hub_link")}</Link>{q ? ` · "${q}"` : ""}</p>}
      </section>
      {cats.length > 0 && (
        <div className="product__chips" style={{ marginBottom: 16 }}>
          {cats.map((c) => <Link key={c.slug} className="chip" href={`/c/${c.slug}`}>{categoryName(c.slug, T.lang)}</Link>)}
        </div>
      )}
      {(present.length > 1 || category) && (
        <nav className="cats" aria-label={T("categories")}>
          <Link href={`/search?${new URLSearchParams({ ...(q ? { q } : {}), ...(topicId ? { topic: topicId } : {}) })}`} aria-current={category ? undefined : "page"}>{T("all")}</Link>
          {CATEGORIES.filter((c) => present.includes(c.slug) || c.slug === category).map((c) => (
            <Link key={c.slug} href={`/search?${new URLSearchParams({ ...(q ? { q } : {}), ...(topicId ? { topic: topicId } : {}), category: c.slug })}`} aria-current={c.slug === category ? "page" : undefined}>{categoryName(c.slug, T.lang)}</Link>
          ))}
        </nav>
      )}
      {(q || topic) && !hits.length && !cats.length && <p className="empty">{T("search_none")}</p>}
      {hits.length > 0 && <ol className="rows">{hits.map((r) => <ProductRow key={r.id} r={r} q={q} />)}</ol>}
    </main>
  );
}
