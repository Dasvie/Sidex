import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, categoryName, isCategory } from "@/lib/categories";
import { rankProducts, type RankScope } from "@/lib/rank";
import { getT } from "@/lib/lang";
import { ProductRow } from "@/components/ProductRow";
import { Tiles } from "@/components/Tiles";
import { SectionHead } from "@/components/SectionHead";
import { label, topicsOf } from "@/lib/planmap";
import { db } from "@/db";
import { screenshots } from "@/db/schema";
import { asc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ scope?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategory(slug)) notFound();
  const T = await getT();
  return { title: `${categoryName(slug, T.lang)} ${T("ranking_of")}` };
}

export default async function Category({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!isCategory(slug)) notFound();
  const T = await getT();
  const sp = await searchParams;
  const scope: RankScope = sp.scope === "all" ? "all" : "month";
  const items = await rankProducts({ scope, category: slug });
  const top = items.slice(0, 3);
  const shots: Record<number, string> = {};
  if (top.length) {
    const rows = await db.select({ productId: screenshots.productId, url: screenshots.url }).from(screenshots).where(inArray(screenshots.productId, top.map((r) => r.id))).orderBy(asc(screenshots.sort));
    for (const r of rows) if (!shots[r.productId]) shots[r.productId] = r.url;
  }
  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">{T("category")}</p>
        <h1 className="h1">{categoryName(slug, T.lang)}</h1>
      </section>
      <nav className="cats" aria-label={T("categories")}>
        <Link href="/">{T("all")}</Link>
        {CATEGORIES.map((c) => <Link key={c.slug} href={`/c/${c.slug}`} aria-current={c.slug === slug ? "page" : undefined}>{categoryName(c.slug, T.lang)}</Link>)}
      </nav>
      <div className="topics" aria-label={T("topic_title")}>
        {topicsOf(slug).map((t) => <Link key={t.id} className="chip chip--topic" href={`/t/${t.id}`}>{label(t.node, T.lang)}</Link>)}
      </div>
      {top.length > 0 && (
        <>
          <SectionHead pill={scope === "all" ? T("scope_all") : T("scope_month")} title={T("cat_top3")} href="/c" link={T("nav_all_categories")} />
          <Tiles items={top} shots={shots} lang={T.lang} />
        </>
      )}
      <div className="feed__head">
        <p className="meta"><strong style={{ color: "var(--fg)" }}>{scope === "all" ? T("scope_all") : T("scope_month")}</strong>{items.length ? ` · ${items.length}${T("count_suffix")}` : ""}</p>
        <Link className="btn btn--sm" href={scope === "all" ? `/c/${slug}` : `/c/${slug}?scope=all`}>{scope === "all" ? T("see_this_month") : T("see_all_time")}</Link>
      </div>
      {items.length ? (
        <ol className="rows">{items.map((r, i) => <ProductRow key={r.id} r={r} idx={i + 1} />)}</ol>
      ) : (
        <p className="empty">{T("cat_empty")} {T("cat_empty_hint")} <Link href="/submit">{T("cat_submit")}</Link></p>
      )}
    </main>
  );
}
