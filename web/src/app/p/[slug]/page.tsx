import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { comments, planNotes, planVotes, products, profiles, reviews, screenshots } from "@/db/schema";
import { currentProfile } from "@/auth";
import { AXES, categoryName, stageName } from "@/lib/categories";
import { getT } from "@/lib/lang";
import { fmtDate, fromNow, rating } from "@/lib/format";
import { rankProducts } from "@/lib/rank";
import { faviconFor, hostOf } from "@/lib/slug";
import { Avatar } from "@/components/Avatar";
import { Stars } from "@/components/Stars";
import { Thumb } from "@/components/ProductRow";
import { ShareButtons } from "@/components/ShareButtons";
import { CommentThread } from "@/components/CommentThread";
import { ReviewForm } from "@/components/ReviewForm";
import { DesignSystem } from "@/components/DesignSystem";
import { Gallery } from "@/components/Gallery";
import { ReviewSummary } from "@/components/ReviewSummary";
import { Icon } from "@/components/Icon";
import { ShotUploader } from "@/components/ShotUploader";
import { PlanMap } from "@/components/PlanMap";
import { label as topicLabel, topicById } from "@/lib/planmap";
import { uploadsEnabled } from "@/lib/upload";
import { extractNotes, parseDesignMd } from "@/lib/designmd";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ node?: string }> };

async function load(slug: string) {
  return db.query.products.findFirst({ where: and(eq(products.slug, slug), eq(products.published, true)) });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) notFound(); // here, so the response carries a real 404 before the page shell streams
  return {
    title: p.name,
    description: p.tagline,
    openGraph: { title: `${p.name} | Sidex`, description: p.tagline, images: p.logoUrl ? [p.logoUrl] : undefined },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();
  const T = await getT();
  const L = T.lang;

  const [me, owner, shots, revs, coms] = await Promise.all([
    currentProfile(),
    p.ownerId ? db.query.profiles.findFirst({ where: eq(profiles.id, p.ownerId) }) : Promise.resolve(null),
    db.query.screenshots.findMany({ where: eq(screenshots.productId, p.id), orderBy: asc(screenshots.sort) }),
    db.query.reviews.findMany({ where: eq(reviews.productId, p.id), orderBy: desc(reviews.createdAt) }),
    db.query.comments.findMany({ where: eq(comments.productId, p.id), orderBy: asc(comments.createdAt) }),
  ]);
  const authorIds = [...new Set([...revs.map((r) => r.authorId), ...coms.map((c) => c.authorId)])];
  const authors = authorIds.length ? await db.query.profiles.findMany({ where: inArray(profiles.id, authorIds) }) : [];
  const byId = Object.fromEntries(authors.map((a) => [a.id, a]));

  const isOwner = !!me && me.id === p.ownerId;
  const notes = await db.select({ nodeId: planNotes.nodeId, body: planNotes.body }).from(planNotes).where(eq(planNotes.productId, p.id));
  const voteRows = await db.select({ nodeId: planVotes.nodeId, voterId: planVotes.voterId, value: planVotes.value }).from(planVotes).where(eq(planVotes.productId, p.id));
  const votes: Record<string, { up: number; down: number; mine: number }> = {};
  for (const v of voteRows) {
    const e = (votes[v.nodeId] ??= { up: 0, down: 0, mine: 0 });
    if (v.value > 0) e.up++; else e.down++;
    if (me && v.voterId === me.id) e.mine = v.value;
  }
  const initialNode = ((await searchParams).node || "").slice(0, 200);
  const myReview = me ? revs.find((r) => r.authorId === me.id) : undefined;
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: revs.filter((r) => r.stars === s).length }));
  const axisAvg = AXES.map((a) => { const v = revs.length ? revs.reduce((s, r) => s + r[a.key], 0) / revs.length : 0; return { key: a.key, label: T(a.name), v, pct: (v / 5) * 100 }; });
  const tagline = L === "en" && p.taglineEn ? p.taglineEn : p.tagline;
  const description = L === "en" && p.descriptionEn ? p.descriptionEn : p.description;
  const detail = L === "en" && p.detailEn ? p.detailEn : p.detail;

  const similar = (await rankProducts({ scope: "all" }))
    .filter((r) => r.id !== p.id && r.categories.some((c) => p.categories.includes(c)))
    .slice(0, 3);
  const rankAll = await rankProducts({ scope: "all", category: p.categories[0] });
  const myRank = rankAll.findIndex((r) => r.id === p.id) + 1;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const design = parseDesignMd(p.designMd);
  const pinned = coms.find((c) => c.pinned && !c.parentId);
  const tops = coms.filter((c) => !c.parentId && c.id !== pinned?.id);
  const ordered = pinned ? [pinned, ...tops] : tops;

  return (
    <main className="container">
      <article>
        <div className="product__top">
          <Thumb p={p} className="product__logo" />
          <div>
            <h1 className="h1 product__name">{p.name}</h1>
            <p className="lead product__tagline">{tagline}</p>
            <div className="product__stats">
              <Stars value={p.ratingAvg} count={p.reviewCount} label={T("reviews_n")} />
              <span className="row__dot">·</span>
              <span className="meta">{T("comments_n")} {p.commentCount}</span>
              {notes.length > 0 && (<><span className="row__dot">·</span><span className="meta">{T("plan_n")} {notes.length}</span></>)}
              {myRank > 0 && p.reviewCount + p.commentCount > 0 && (<><span className="row__dot">·</span><span className="meta">{L === "en" ? `#${myRank} in ${categoryName(p.categories[0], L)}` : `${categoryName(p.categories[0], L)} ${myRank}위`}</span></>)}
              <span className="row__dot">·</span>
              <span className="meta">{fmtDate(p.createdAt)} {T("registered")}</span>
            </div>
            <div className="product__chips">
              {p.categories.map((c) => <Link key={c} className="chip" href={`/c/${c}`}>{categoryName(c, L)}</Link>)}
              {p.topics.map((t) => { const hit = topicById(t); return hit ? <Link key={t} className="chip chip--topic" href={`/t/${t}`}>{topicLabel(hit.node, L)}</Link> : null; })}
              <span className="chip">{stageName(p.stage, L)}</span>
            </div>
          </div>
          <div className="product__actions">
            <a className="btn btn--cta btn--lg" href={p.url} target="_blank" rel="noopener">{T("visit")}<Icon name="external" /></a>
            <a className="btn" href="#reviews">{myReview ? T("edit_review") : T("write_review")}</a>
            <ShareButtons url={`${site}/p/${p.slug}`} title={`${p.name} | Sidex`} />
          </div>
        </div>

        {isOwner && notes.length < 3 && (
          <div className="nudge">
            <div>
              <p className="nudge__title">{T("nudge_title")}</p>
              <p className="help">{T("nudge_body")}</p>
            </div>
            <div className="nudge__right">
              <span className="nudge__dots" aria-label={`${notes.length} / 3`}>{[0, 1, 2].map((i) => <i key={i} className={i < notes.length ? "is-on" : ""} />)}</span>
              <a className="btn btn--solid btn--sm" href="#plan">{T("nudge_cta")}</a>
            </div>
          </div>
        )}
        <div className="product__body">
          <div>
            <section className="section">
              <h2 className="eyebrow">{T("overview")}</h2>
              <div className="overview">
                {(p.why || p.source !== "curated") && <div><h3 className="h3">{T("why")}</h3><p className="prose">{p.why || "-"}</p></div>}
                <div><h3 className="h3">{T("what")}</h3><p className="prose">{description || "-"}</p></div>
              </div>
            </section>

            {(detail || shots.length > 0 || isOwner) && (
              <section className="section">
                <h2 className="eyebrow">{T("detail")}</h2>
                {detail && <p className="prose">{detail}</p>}
                {shots.length > 0 && <Gallery shots={shots} name={p.name} />}
                {isOwner && <ShotUploader productId={p.id} shots={shots.map((s) => ({ id: s.id, url: s.url, title: s.title }))} uploads={uploadsEnabled()} />}
              </section>
            )}

            <section className="section" id="plan">
              <h2 className="eyebrow">{T("plan_title")}</h2>
              <PlanMap productId={p.id} name={p.name} categories={p.categories} notes={Object.fromEntries(notes.map((x) => [x.nodeId, x.body]))} isOwner={isOwner} ownerName={owner?.displayName || p.makerName} logoUrl={p.logoUrl || faviconFor(p.url)} aiOn={Boolean(process.env.ANTHROPIC_API_KEY)} votes={votes} canVote={!!me && !isOwner} loggedIn={!!me} initialNode={initialNode} />
            </section>

            {p.source !== "curated" && (
              <section className="section">
                <h2 className="eyebrow">{T("build_notes")}</h2>
                <div className="overview">
                  <div className="kv">
                    <div><span>{T("stack")}</span><span>{p.stack || "-"}</span></div>
                    <div><span>{T("tools")}</span><span>{p.tools || "-"}</span></div>
                    <div><span>{T("build_days")}</span><span>{p.buildDays != null ? `${p.buildDays}${T("days")}` : "-"}</span></div>
                    <div><span>{T("team")}</span><span>{p.teamSize != null ? `${p.teamSize}${T("people")}` : "-"}</span></div>
                  </div>
                  <div className="kv">
                    <div><span>{T("palette")}</span><span className="swatches" aria-label={p.dna?.palette.join(", ")}>{p.dna?.palette.length ? p.dna.palette.map((c) => <i key={c} style={{ background: c }} title={c} />) : "-"}</span></div>
                    <div><span>{T("fonts")}</span><span>{p.dna?.fonts.length ? p.dna.fonts.join(", ") : "-"}</span></div>
                    <div><span>{T("measured_at")}</span><span>{p.dna ? p.dna.measuredAt : "-"}</span></div>
                    <div><span>{T("address")}</span><span>{hostOf(p.url)}</span></div>
                  </div>
                </div>
              </section>
            )}

            {design && (
              <section className="section">
                <h2 className="eyebrow">{T("design_system")}</h2>
                <DesignSystem name={p.name} tokens={design.tokens} notes={extractNotes(design.body)} raw={design.raw} />
              </section>
            )}


            <section className="section" id="comments">
              <div className="section__head">
                <h2 className="eyebrow">{T("comments")} {p.commentCount}</h2>
              </div>
              <CommentThread
                productId={p.id}
                ownerId={p.ownerId}
                me={me ? { id: me.id, handle: me.handle, displayName: me.displayName, avatarUrl: me.avatarUrl } : null}
                items={ordered.map((c) => ({
                  ...c,
                  createdAt: c.createdAt.toISOString(),
                  author: byId[c.authorId] ? { handle: byId[c.authorId].handle, displayName: byId[c.authorId].displayName, avatarUrl: byId[c.authorId].avatarUrl } : null,
                  replies: coms.filter((r) => r.parentId === c.id).map((r) => ({
                    ...r,
                    createdAt: r.createdAt.toISOString(),
                    author: byId[r.authorId] ? { handle: byId[r.authorId].handle, displayName: byId[r.authorId].displayName, avatarUrl: byId[r.authorId].avatarUrl } : null,
                  })),
                }))}
              />
            </section>

            <section className="section" id="reviews">
              <div className="section__head">
                <h2 className="eyebrow">{T("reviews")} {p.reviewCount}</h2>
              </div>
              {revs.length > 0 && <ReviewSummary avg={p.ratingAvg} count={revs.length} dist={dist} axes={axisAvg} countLabel={`${T("reviews_n")} ${revs.length}${T("reviews_count_suffix")}`} />}
              {isOwner ? (
                <p className="help">{T("owner_no_review")}</p>
              ) : me ? (
                <ReviewForm productId={p.id} mine={myReview ? { stars: myReview.stars, good: myReview.good, bad: myReview.bad, ux: myReview.ux, polish: myReview.polish, design: myReview.design, originality: myReview.originality } : null} />
              ) : (
                <p className="help">{T("review_login_a")}<Link href={`/login?next=/p/${p.slug}`} style={{ textDecoration: "underline" }}>{T("comment_login_b")}</Link>{T("review_login_c")}</p>
              )}
              <div style={{ marginTop: 20 }}>
                {revs.map((r) => {
                  const a = byId[r.authorId];
                  return (
                    <article key={r.id} className="review">
                      <div className="review__head">
                        <span className="stars"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.9 4.1 4.5.5-3.3 3.1.9 4.4L8 11.4l-4 2.2.9-4.4L1.6 6.1l4.5-.5z" /></svg>{r.stars}</span>
                        <span className="meta">{a ? <Link href={`/u/${a.handle}`}>{a.displayName}</Link> : T("left_member")} · {fromNow(r.createdAt, L)}</span>
                      </div>
                      <div className="review__pn">
                        <div><strong>{T("good")}</strong><p>{r.good}</p></div>
                        <div><strong>{T("bad")}</strong><p>{r.bad}</p></div>
                      </div>
                      <div className="axes">{AXES.map((x) => <span key={x.key} className="axis"><span>{T(x.name)}</span><i><b style={{ width: `${r[x.key] * 20}%` }} /></i><b>{r[x.key]}</b></span>)}</div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="side">
            <section>
              <div className="section__head" style={{ marginBottom: 12 }}>
                <h2 className="eyebrow">{T("maker")}</h2>
                {owner && <Link className="meta" href={`/u/${owner.handle}`}>{T("view_profile")}</Link>}
              </div>
              {owner ? (
                <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 12, alignItems: "center" }}>
                  <Avatar profile={owner} size="lg" />
                  <div>
                    <p style={{ color: "var(--fg)", fontWeight: 600 }}>{owner.displayName}</p>
                    <p className="meta">@{owner.handle}</p>
                  </div>
                  {owner.bio && <p className="help" style={{ gridColumn: "1 / -1" }}>{owner.bio}</p>}
                  {owner.linkUrl && <a className="meta" style={{ gridColumn: "1 / -1", textDecoration: "underline" }} href={owner.linkUrl} target="_blank" rel="noopener">{hostOf(owner.linkUrl)} ↗</a>}
                </div>
              ) : p.makerName ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <p style={{ color: "var(--fg)", fontWeight: 600 }}>{p.makerName}</p>
                  {(p.makerDetail || p.makerDetailEn) && <p className="help">{L === "en" && p.makerDetailEn ? p.makerDetailEn : p.makerDetail}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
                    {p.makerUrl && <a className="meta" style={{ textDecoration: "underline" }} href={p.makerUrl} target="_blank" rel="noopener">{hostOf(p.makerUrl)} ↗</a>}
                  </div>
                </div>
              ) : (
                <p className="help">-</p>
              )}
            </section>
            <section>
              <h2 className="eyebrow">{T("similar")}</h2>
              {similar.length ? (
                <ul className="similar">
                  {similar.map((r) => (
                    <li key={r.id}>
                      <Link href={`/p/${r.slug}`}><img className="thumb" src={r.logoUrl || faviconFor(r.url)} alt="" referrerPolicy="no-referrer" /></Link>
                      <div><Link className="name" href={`/p/${r.slug}`}>{r.name}</Link><span className="sub">{L === "en" && r.taglineEn ? r.taglineEn : r.tagline}</span></div>
                      <span className="cnt">{T("reviews_n")} {r.reviews} · {T("comments_n")} {r.comments}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="help">{T("similar_empty")} <Link href={`/c/${p.categories[0]}`} style={{ textDecoration: "underline" }}>{categoryName(p.categories[0], L)} {T("ranking_of")}</Link></p>
              )}
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
