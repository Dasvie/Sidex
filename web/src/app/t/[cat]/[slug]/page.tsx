/* Topic hub: every product that picked this planning-map topic. Title, the topic's own keywords
   as the one-line description, a strip of the leading logos, ranking rows, pagination. */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categoryName, isCategory } from "@/lib/categories";
import { rankProducts } from "@/lib/rank";
import { getT } from "@/lib/lang";
import { label, topicById } from "@/lib/planmap";
import { ProductRow, Thumb } from "@/components/ProductRow";

export const dynamic = "force-dynamic";
const PAGE = 15;

type Props = { params: Promise<{ cat: string; slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat, slug } = await params;
  const T = await getT();
  const topic = topicById(`${cat}/${slug}`);
  if (!topic || !isCategory(cat)) notFound();
  return { title: `${label(topic.node, T.lang)} · ${categoryName(topic.cat, T.lang)}` };
}

export default async function TopicHub({ params, searchParams }: Props) {
  const { cat, slug } = await params;
  const id = `${cat}/${slug}`;
  const topic = topicById(id);
  if (!topic || !isCategory(cat)) notFound();
  const T = await getT();
  const L = T.lang;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const sorted = await rankProducts({ scope: "all", topic: id });
  const all = sorted;
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const items = sorted.slice((page - 1) * PAGE, page * PAGE);
  const keywords = topic.node.children ?? [];
  const href = (q: Record<string, string>) => `/t/${cat}/${slug}?${new URLSearchParams(q)}`;

  return (
    <main className="container">
      <section className="hero topic">
        <p className="eyebrow"><Link href={`/c/${cat}`}>{categoryName(cat, L)}</Link> · {T("topic_title")}</p>
        <h1 className="h1">{label(topic.node, L)}</h1>
        {keywords.length > 0 && <p className="lead topic__lead">{keywords.map((k) => label(k, L)).join(" · ")}</p>}
        {all.length > 0 && (
          <div className="topic__logos" aria-label={T("topic_leading")}>
            {all.slice(0, 6).map((r) => <Link key={r.id} href={`/p/${r.slug}`} title={r.name}><Thumb p={r} className="topic__logo" /></Link>)}
            <span className="meta">{T("topic_count", { n: all.length })}</span>
          </div>
        )}
      </section>

      <div className="feed__head">
        <p className="meta">{sorted.length ? T("topic_showing", { a: (page - 1) * PAGE + 1, b: Math.min(page * PAGE, sorted.length), n: sorted.length }) : ""}</p>
        <Link className="meta" href={`/c/${cat}`}>{categoryName(cat, L)} {T("ranking_of")}</Link>
      </div>
      {items.length ? (
        <ol className="rows">{items.map((r, i) => <ProductRow key={r.id} r={r} idx={(page - 1) * PAGE + i + 1} />)}</ol>
      ) : (
        <p className="empty">{T("topic_empty")} <Link href="/submit">{T("cat_submit")}</Link></p>
      )}
      {pages > 1 && (
        <nav className="pager" aria-label={T("topic_pages")}>
          {page > 1 && <Link className="btn btn--sm" href={href({ page: String(page - 1) })}>{T("prev")}</Link>}
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} className={"pager__n" + (n === page ? " is-on" : "")} href={href({ page: String(n) })} aria-current={n === page ? "page" : undefined}>{n}</Link>
          ))}
          {page < pages && <Link className="btn btn--sm" href={href({ page: String(page + 1) })}>{T("next")}</Link>}
        </nav>
      )}
    </main>
  );
}
