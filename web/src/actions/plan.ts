"use server";
/* Planning-map notes and votes.
   savePlanNote: the maker writes an answer at a node; an empty body removes it (and its votes).
   votePlanNote: a signed-in reader who is not the maker agrees (+1) or disagrees (-1) with a note;
   the same vote again withdraws it. Votes never touch the ranking. */
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { planNotes, planVotes, products } from "@/db/schema";
import { currentProfile } from "@/auth";
import { bumpRank } from "@/lib/rank";

export type PlanState = { error?: string; ok?: boolean; nodeId?: string };

const NODE = /^(f|d:[a-z]+)(\/[a-z0-9-]+){0,6}$/;
const Form = z.object({
  productId: z.coerce.number().int().positive(),
  nodeId: z.string().regex(NODE),
  body: z.string().max(2000),
});

export async function savePlanNote(_prev: PlanState, fd: FormData): Promise<PlanState> {
  const me = await currentProfile();
  if (!me) return { error: "로그인 후에 할 수 있어요." };
  const parsed = Form.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) return { error: "저장할 수 없는 값이에요." };
  const { productId, nodeId } = parsed.data;
  const body = parsed.data.body.trim();
  const p = await db.query.products.findFirst({ where: eq(products.id, productId), columns: { slug: true, ownerId: true } });
  if (!p || p.ownerId !== me.id) return { error: "내 프로덕트에만 적을 수 있어요." };
  if (body) {
    await db
      .insert(planNotes)
      .values({ productId, nodeId, body })
      .onConflictDoUpdate({ target: [planNotes.productId, planNotes.nodeId], set: { body, updatedAt: sql`now()` } });
  } else {
    await db.delete(planNotes).where(and(eq(planNotes.productId, productId), eq(planNotes.nodeId, nodeId)));
    await db.delete(planVotes).where(and(eq(planVotes.productId, productId), eq(planVotes.nodeId, nodeId)));
  }
  bumpRank(); // the note count rides on the ranking rows
  revalidatePath(`/p/${p.slug}`);
  revalidatePath(`/u`);
  return { ok: true, nodeId };
}

const Vote = z.object({
  productId: z.coerce.number().int().positive(),
  nodeId: z.string().regex(NODE),
  value: z.coerce.number().refine((v) => v === 1 || v === -1),
});

export async function votePlanNote(_prev: PlanState, fd: FormData): Promise<PlanState> {
  const me = await currentProfile();
  if (!me) return { error: "로그인 후에 할 수 있어요." };
  const parsed = Vote.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) return { error: "저장할 수 없는 값이에요." };
  const { productId, nodeId, value } = parsed.data;
  const p = await db.query.products.findFirst({ where: eq(products.id, productId), columns: { slug: true, ownerId: true } });
  if (!p) return { error: "없는 프로덕트예요." };
  if (p.ownerId === me.id) return { error: "내 기록에는 표를 던질 수 없어요." };
  const note = await db.query.planNotes.findFirst({ where: and(eq(planNotes.productId, productId), eq(planNotes.nodeId, nodeId)), columns: { id: true } });
  if (!note) return { error: "기록이 없는 노드예요." };
  const mine = await db.query.planVotes.findFirst({ where: and(eq(planVotes.productId, productId), eq(planVotes.nodeId, nodeId), eq(planVotes.voterId, me.id)) });
  if (mine && mine.value === value) await db.delete(planVotes).where(eq(planVotes.id, mine.id));
  else if (mine) await db.update(planVotes).set({ value }).where(eq(planVotes.id, mine.id));
  else await db.insert(planVotes).values({ productId, nodeId, voterId: me.id, value });
  revalidatePath(`/p/${p.slug}`);
  return { ok: true, nodeId };
}
