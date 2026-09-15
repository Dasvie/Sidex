"use server";
import { revalidatePath } from "next/cache";
import { bumpRank } from "@/lib/rank";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { comments, products } from "@/db/schema";
import { currentProfile } from "@/auth";
import { refreshAggregates } from "@/lib/rank";

export type CommentState = { error?: string; ok?: boolean };

export async function addComment(_prev: CommentState, fd: FormData): Promise<CommentState> {
  const me = await currentProfile();
  if (!me) return { error: "논평은 로그인 후에 남길 수 있습니다." };
  const productId = Number(fd.get("productId"));
  const parentRaw = fd.get("parentId");
  const parentId = parentRaw ? Number(parentRaw) : null;
  const body = String(fd.get("body") || "").trim();
  if (!body) return { error: "내용을 적어 주세요." };
  if (body.length > 2000) return { error: "2000자까지 쓸 수 있습니다." };

  const p = await db.query.products.findFirst({ where: eq(products.id, productId), columns: { id: true, slug: true } });
  if (!p) return { error: "프로덕트를 찾을 수 없습니다." };
  if (parentId) {
    // replies stay one level deep: a reply to a reply attaches to the same parent
    const parent = await db.query.comments.findFirst({ where: and(eq(comments.id, parentId), eq(comments.productId, p.id)) });
    if (!parent) return { error: "답글을 달 논평이 없습니다." };
  }
  await db.insert(comments).values({ productId: p.id, authorId: me.id, parentId, body });
  await refreshAggregates(p.id);
  bumpRank();
  revalidatePath(`/p/${p.slug}`);
  revalidatePath("/");
  return { ok: true };
}

/** The builder pins one top-level comment; pinning another unpins the previous. */
export async function pinComment(commentId: number) {
  const me = await currentProfile();
  if (!me) return;
  const c = await db.query.comments.findFirst({ where: eq(comments.id, commentId) });
  if (!c || c.parentId) return;
  const p = await db.query.products.findFirst({ where: eq(products.id, c.productId), columns: { ownerId: true, slug: true } });
  if (!p || p.ownerId !== me.id) return;
  await db.update(comments).set({ pinned: false }).where(and(eq(comments.productId, c.productId), isNull(comments.parentId)));
  if (!c.pinned) await db.update(comments).set({ pinned: true }).where(eq(comments.id, c.id));
  revalidatePath(`/p/${p.slug}`);
}
