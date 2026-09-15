import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { comments, planNotes, products, profiles, reviews } from "@/db/schema";
import { currentProfile } from "@/auth";
import { fmtDate, fromNow } from "@/lib/format";
import { hostOf } from "@/lib/slug";
import { rankProducts } from "@/lib/rank";
import { getT } from "@/lib/lang";
import { Avatar } from "@/components/Avatar";
import { ProductRow } from "@/components/ProductRow";
import { nodePath } from "@/lib/planmap";
import { ProfileForm } from "@/components/ProfileForm";
import { DeleteProduct } from "@/components/DeleteProduct";
import { uploadsEnabled } from "@/lib/upload";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const p = await db.query.profiles.findFirst({ where: eq(profiles.handle, handle) });
  return { title: p ? `${p.displayName} (@${p.handle})` : "Sidex" };
}

export default async function ProfilePage({ params }: Props) {
  const { handle } = await params;
  const p = await db.query.profiles.findFirst({ where: eq(profiles.handle, handle) });
  if (!p) notFound();
  const T = await getT();
  const me = await currentProfile();
  const mine = me?.id === p.id;
  const [made, myReviews, myComments] = await Promise.all([
    rankProducts({ scope: "all", ownerId: p.id }),
    db.query.reviews.findMany({ where: eq(reviews.authorId, p.id), orderBy: desc(reviews.createdAt), limit: 20 }),
    db.query.comments.findMany({ where: eq(comments.authorId, p.id), orderBy: desc(comments.createdAt), limit: 20 }),
  ]);
  const madeIds = made.map((r) => r.id);
  const myNotes = madeIds.length ? await db.select({ productId: planNotes.productId, nodeId: planNotes.nodeId, body: planNotes.body, updatedAt: planNotes.updatedAt }).from(planNotes).where(inArray(planNotes.productId, madeIds)).orderBy(desc(planNotes.updatedAt)).limit(200) : [];
  const madeById = Object.fromEntries(made.map((r) => [r.id, r]));
  const pids = [...new Set([...myReviews.map((r) => r.productId), ...myComments.map((c) => c.productId)])];
  const prods = pids.length ? await db.query.products.findMany({ where: inArray(products.id, pids), columns: { id: true, slug: true, name: true } }) : [];
  const pById = Object.fromEntries(prods.map((x) => [x.id, x]));
  const myTopIds = myComments.filter((c) => !c.parentId).map((c) => c.id);
  const repliesToMe = myTopIds.length ? await db.query.comments.findMany({ where: inArray(comments.parentId, myTopIds), orderBy: desc(comments.createdAt), limit: 20 }) : [];

  return (
    <main className="container">
      <section className="profile__head">
        <Avatar profile={p} size="xl" />
        <div>
          <h1 className="h2 profile__name">{p.displayName}</h1>
          <div className="profile__stats meta">
            <span>@{p.handle}</span>
            <span>{T("products_made")} {made.length}</span>
            <span>{T("reviews_n")} {myReviews.length}</span>
            <span>{T("comments_n")} {myComments.length}</span>
            <span>{T("plan_n")} {myNotes.length}</span>
            <span>{fmtDate(p.createdAt)} {T("joined")}</span>
          </div>
          {p.bio && <p style={{ marginTop: 10, maxWidth: "60ch" }}>{p.bio}</p>}
          {p.linkUrl && <a className="meta" style={{ display: "inline-block", marginTop: 6, textDecoration: "underline" }} href={p.linkUrl} target="_blank" rel="noopener">{hostOf(p.linkUrl)} ↗</a>}
        </div>
      </section>

      <div className="layout">
        <div>
          <section className="section" id="products">
            <div className="section__head"><h2 className="eyebrow">{T("made")}</h2>{mine && <Link className="meta" href="/submit">{T("submit")}</Link>}</div>
            {made.length ? <ol className="rows">{made.map((r) => <ProductRow key={r.id} r={r} />)}</ol> : <p className="help">{T("no_products")}</p>}
          </section>
          {myNotes.length > 0 && (
            <section className="section">
              <h2 className="eyebrow">{T("recent_notes")}</h2>
              <ul className="notes">
                {myNotes.slice(0, 6).map((n) => (
                  <li key={n.productId + n.nodeId}>
                    <Link href={`/p/${madeById[n.productId]?.slug}?node=${encodeURIComponent(n.nodeId)}#plan`}>
                      <span className="notes__where">{madeById[n.productId]?.name} · {nodePath(n.nodeId, T.lang)}</span>
                      <span className="notes__body">{n.body}</span>
                    </Link>
                    <span className="num">{fromNow(n.updatedAt, T.lang)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {myReviews.length > 0 && (
            <section className="section">
              <h2 className="eyebrow">{T("my_reviews")}</h2>
              <ul className="side__list">
                {myReviews.map((r) => <li key={r.id}><Link href={`/p/${pById[r.productId]?.slug}#reviews`}>{pById[r.productId]?.name} · {T("rating")} {r.stars}</Link><span className="num">{fromNow(r.createdAt, T.lang)}</span></li>)}
              </ul>
            </section>
          )}
          {mine && repliesToMe.length > 0 && (
            <section className="section">
              <h2 className="eyebrow">{T("replies_to_me")}</h2>
              <ul className="side__list">
                {repliesToMe.map((c) => <li key={c.id}><Link href={`/p/${pById[c.productId]?.slug || ""}#comments`}>{c.body.slice(0, 60)}</Link><span className="num">{fromNow(c.createdAt, T.lang)}</span></li>)}
              </ul>
            </section>
          )}
        </div>
        <aside className="side">
          {mine && made.length > 0 && (
            <section id="manage">
              <h2 className="eyebrow">{T("manage_products")}</h2>
              <ul className="manage">
                {made.map((r) => (
                  <li key={r.id}>
                    <Link href={`/p/${r.slug}`}>{r.name}</Link>
                    <DeleteProduct id={r.id} name={r.name} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {mine && (
            <section id="edit">
              <h2 className="eyebrow">{T("profile_edit")}</h2>
              <ProfileForm me={{ displayName: p.displayName, bio: p.bio, linkUrl: p.linkUrl, avatarUrl: p.avatarUrl }} uploads={uploadsEnabled()} />
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
