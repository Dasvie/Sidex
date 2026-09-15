/* Ranking. No date rank: a product from March competes with one from today.
   score = reviews × 3 + comments × 1 + replies × 0.5
   The builder's own comments never count. Stars never count either: a two-star review
   is still someone who used the thing and wrote about it. */
import { and, eq, gte, isNull, isNotNull, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { comments, products, reviews } from "@/db/schema";
import { unstable_cache, updateTag } from "next/cache";
import { scoreOf } from "./score";

export type RankRow = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  taglineEn: string;
  url: string;
  logoUrl: string;
  stage: string;
  categories: string[];
  topics: string[];
  source: string;
  ownerId: string | null;
  ownerHandle: string | null;
  ownerName: string | null;
  makerName: string;
  ratingAvg: number;
  notes: number;
  reviews: number;
  comments: number;
  replies: number;
  score: number;
  lastReviewAt: Date | null;
};

export type RankScope = "month" | "all";

export type RankOpts = { scope?: RankScope; category?: string; ownerId?: string; limit?: number; q?: string; topic?: string };

async function rankProductsRaw(opts: RankOpts = {}) {
  const scope = opts.scope ?? "month";
  const since = scope === "month" ? new Date(Date.now() - 30 * 86400000) : null;

  // Per-product counts inside the scope. Comments by the owner are excluded in SQL, not in JS,
  // so the numbers on the row are the numbers the sort used.
  const rev = db
    .select({
      productId: reviews.productId,
      n: sql<number>`count(*)::int`.as("rev_n"),
      last: sql<Date>`max(${reviews.createdAt})`.as("rev_last"),
    })
    .from(reviews)
    .where(since ? gte(reviews.createdAt, since) : undefined)
    .groupBy(reviews.productId)
    .as("rev");

  const com = db
    .select({
      productId: comments.productId,
      top: sql<number>`count(*) filter (where ${comments.parentId} is null)::int`.as("com_top"),
      rep: sql<number>`count(*) filter (where ${comments.parentId} is not null)::int`.as("com_rep"),
    })
    .from(comments)
    .innerJoin(products, eq(products.id, comments.productId))
    .where(
      and(
        since ? gte(comments.createdAt, since) : undefined,
        sql`(${products.ownerId} is null or ${comments.authorId} <> ${products.ownerId})`,
      ),
    )
    .groupBy(comments.productId)
    .as("com");

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      tagline: products.tagline,
      taglineEn: products.taglineEn,
      url: products.url,
      logoUrl: products.logoUrl,
      stage: products.stage,
      categories: products.categories,
      topics: products.topics,
      source: products.source,
      ownerId: products.ownerId,
      ownerHandle: sql<string | null>`(select handle from profile where profile.id = ${products.ownerId})`,
      ownerName: sql<string | null>`(select display_name from profile where profile.id = ${products.ownerId})`,
      makerName: products.makerName,
      ratingAvg: products.ratingAvg,
      notes: sql<number>`(select count(*)::int from plan_note where plan_note.product_id = ${products.id})`,
      reviews: sql<number>`coalesce(${rev.n}, 0)`,
      comments: sql<number>`coalesce(${com.top}, 0)`,
      replies: sql<number>`coalesce(${com.rep}, 0)`,
      lastReviewAt: rev.last,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(rev, eq(rev.productId, products.id))
    .leftJoin(com, eq(com.productId, products.id))
    .where(
      and(
        eq(products.published, true),
        opts.category ? sql`${opts.category} = any(${products.categories})` : undefined,
        opts.topic ? sql`${opts.topic} = any(${products.topics})` : undefined,
        opts.q ? sql`(${products.name} ilike ${"%" + opts.q + "%"} or ${products.tagline} ilike ${"%" + opts.q + "%"} or ${products.taglineEn} ilike ${"%" + opts.q + "%"})` : undefined,
        opts.ownerId ? eq(products.ownerId, opts.ownerId) : undefined,
      ),
    );

  const ranked: RankRow[] = rows.map((r) => ({
    ...r,
    notes: Number(r.notes),
    reviews: Number(r.reviews),
    comments: Number(r.comments),
    replies: Number(r.replies),
    score: scoreOf({ reviews: Number(r.reviews), comments: Number(r.comments), replies: Number(r.replies) }),
    lastReviewAt: r.lastReviewAt ? new Date(r.lastReviewAt) : null,
  }));

  // Ties: the one reviewed more recently, then the newer registration. The only place time is used.
  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const la = a.lastReviewAt?.getTime() ?? 0, lb = b.lastReviewAt?.getTime() ?? 0;
    if (lb !== la) return lb - la;
    return rows.find((x) => x.id === b.id)!.createdAt.getTime() - rows.find((x) => x.id === a.id)!.createdAt.getTime();
  });

  return opts.limit ? ranked.slice(0, opts.limit) : ranked;
}

/* Cached for a minute and tagged; every review/comment write calls bumpRank(). Dates come back
   as strings through the cache, so nothing outside this file relies on them being Date objects. */
export const rankProducts = unstable_cache(rankProductsRaw, ["rank-products"], { tags: ["rank"], revalidate: 60 }) as typeof rankProductsRaw;
/* updateTag, not revalidateTag: a write must be visible on the very next request (revalidateTag
   would serve one more stale copy while refreshing in the background). */
export function bumpRank() {
  updateTag("rank");
}

/** Rewrites the aggregate columns of one product. Called after every review/comment write. */
export async function refreshAggregates(productId: number) {
  const p = await db.query.products.findFirst({ where: eq(products.id, productId), columns: { ownerId: true } });
  const [r] = await db
    .select({ n: sql<number>`count(*)::int`, avg: sql<number>`coalesce(round(avg(${reviews.stars}) * 10), 0)::int` })
    .from(reviews)
    .where(eq(reviews.productId, productId));
  const notOwner = p?.ownerId ? ne(comments.authorId, p.ownerId) : undefined;
  const [c] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(comments)
    .where(and(eq(comments.productId, productId), isNull(comments.parentId), notOwner));
  const [rp] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(comments)
    .where(and(eq(comments.productId, productId), isNotNull(comments.parentId), notOwner));
  await db
    .update(products)
    .set({ reviewCount: Number(r.n), ratingAvg: Number(r.avg), commentCount: Number(c.n), replyCount: Number(rp.n) })
    .where(eq(products.id, productId));
}
