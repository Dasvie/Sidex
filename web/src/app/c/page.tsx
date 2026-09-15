import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, categoryName } from "@/lib/categories";
import { rankProducts } from "@/lib/rank";
import { label, topicsOf } from "@/lib/planmap";
import { getT } from "@/lib/lang";
import { faviconFor } from "@/lib/slug";

export async function generateMetadata(): Promise<Metadata> {
  const T = await getT();
  return { title: T("categories") };
}
export const dynamic = "force-dynamic";

export default async function Categories() {
  const T = await getT();
  const all = await rankProducts({ scope: "all" });
  return (
    <main className="container">
      <section className="hero">
        <h1 className="h1">{T("categories")}</h1>
      </section>
      <div className="layout" style={{ gridTemplateColumns: "1fr" }}>
        {CATEGORIES.map((c) => {
          const top = all.filter((r) => r.categories.includes(c.slug)).slice(0, 3);
          return (
            <section key={c.slug} className="section">
              <div className="section__head">
                <h2 className="h3"><Link href={`/c/${c.slug}`}>{categoryName(c.slug, T.lang)}</Link></h2>
                <Link className="meta" href={`/c/${c.slug}`}>{T("see_all")}</Link>
              </div>
              <div className="topics topics--tight">
                {topicsOf(c.slug).map((t) => <Link key={t.id} className="chip chip--topic" href={`/t/${t.id}`}>{label(t.node, T.lang)}</Link>)}
              </div>
              {top.length ? (
                <ul className="similar">
                  {top.map((r) => (
                    <li key={r.id}>
                      <Link href={`/p/${r.slug}`}><img className="thumb" src={r.logoUrl || faviconFor(r.url)} alt="" referrerPolicy="no-referrer" /></Link>
                      <div><Link className="name" href={`/p/${r.slug}`}>{r.name}</Link><span className="sub">{T.lang === "en" && r.taglineEn ? r.taglineEn : r.tagline}</span></div>
                      <span className="cnt">{T("reviews_n")} {r.reviews} · {T("comments_n")} {r.comments}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="help">{T("cat_empty")} <Link href="/submit" style={{ textDecoration: "underline" }}>{T("cat_submit")}</Link></p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
