import Link from "next/link";
import { rankProducts, type RankScope } from "@/lib/rank";
import { CATEGORIES, categoryName } from "@/lib/categories";
import { getT } from "@/lib/lang";
import { ProductRow } from "@/components/ProductRow";
import { HeroOrbs } from "@/components/HeroOrbs";
import { DevEvents } from "@/components/DevEvents";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  const T = await getT();
  const sp = await searchParams;
  const scope: RankScope = sp.scope === "all" ? "all" : "month";
  const items = await rankProducts({ scope });
  const all = scope === "all" ? items : await rankProducts({ scope: "all" });
  const topByCat = CATEGORIES.map((c) => ({ c, top: all.find((r) => r.categories.includes(c.slug)) }));

  return (
    <main className="container">
      <section className="hero hero--home">
        <HeroOrbs />
        <h1 className="h1 hero__title">{scope === "all" ? T("home_all") : T("home_month")}</h1>
      </section>

      <div className="layout">
        <div>
          <nav className="cats" aria-label={T("categories")}>
            <Link href="/" aria-current="page">{T("all")}</Link>
            {CATEGORIES.map((c) => <Link key={c.slug} href={`/c/${c.slug}`}>{categoryName(c.slug, T.lang)}</Link>)}
          </nav>
          <div className="feed__head">
            <p className="meta"><strong style={{ color: "var(--fg)" }}>{scope === "all" ? T("scope_all") : T("scope_month")}</strong>{items.length ? ` · ${items.length}${T("count_suffix")}` : ""}</p>
            <Link className="btn btn--sm" href={scope === "all" ? "/" : "/?scope=all"} aria-pressed={scope === "all"}>
              {scope === "all" ? T("see_this_month") : T("see_all_time")}
            </Link>
          </div>
          {items.length ? (
            <ol className="rows">{items.map((r) => <ProductRow key={r.id} r={r} />)}</ol>
          ) : (
            <p className="empty">{T("empty_month")} {T("empty_month_or")} <Link href="/?scope=all">{T("empty_month_all")}</Link>, <Link href="/submit">{T("empty_month_submit")}</Link>{T("empty_month_end")}</p>
          )}
        </div>

        <aside className="side">
          <section>
            <h2 className="eyebrow">{T("cat_top")}</h2>
            <ul className="side__list">
              {topByCat.map(({ c, top }) => (
                <li key={c.slug}>
                  <Link href={top ? `/p/${top.slug}` : `/c/${c.slug}`}>{categoryName(c.slug, T.lang)}{top ? ` · ${top.name}` : ""}</Link>
                  <span className="num">{top ? `${T("reviews_n")} ${top.reviews} · ${T("comments_n")} ${top.comments}` : "-"}</span>
                </li>
              ))}
            </ul>
          </section>
          <DevEvents />
        </aside>
      </div>
    </main>
  );
}
