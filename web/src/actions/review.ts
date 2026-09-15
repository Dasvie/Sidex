"use server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { currentProfile } from "@/auth";
import { bumpRank, refreshAggregates } from "@/lib/rank";

export type ReviewState = { error?: string; ok?: boolean };

const Axis = z.coerce.number().int().min(1).max(5);
const Form = z.object({
  productId: z.coerce.number().int(),
  stars: Axis,
  good: z.string().trim().min(10, "좋은 점을 열 글자 이상 적어 주세요.").max(1000),
  bad: z.string().trim().min(10, "아쉬운 점을 열 글자 이상 적어 주세요.").max(1000),
  ux: Axis, polish: Axis, design: Axis, originality: Axis,
});

export async function addReview(_prev: ReviewState, fd: FormData): Promise<ReviewState> {
  const me = await currentProfile();
  if (!me) return { error: "리뷰는 로그인 후에 쓸 수 있습니다." };
  const parsed = Form.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const p = await db.query.products.findFirst({ where: eq(products.id, d.productId), columns: { id: true, slug: true, ownerId: true } });
  if (!p) return { error: "프로덕트를 찾을 수 없습니다." };
  if (p.ownerId === me.id) return { error: "자기 프로덕트에는 리뷰를 쓸 수 없습니다. 논평으로 답해 주세요." };

  const mine = await db.query.reviews.findFirst({ where: and(eq(reviews.productId, p.id), eq(reviews.authorId, me.id)) });
  const values = { stars: d.stars, good: d.good, bad: d.bad, ux: d.ux, polish: d.polish, design: d.design, originality: d.originality };
  if (mine) await db.update(reviews).set(values).where(eq(reviews.id, mine.id));
  else await db.insert(reviews).values({ ...values, productId: p.id, authorId: me.id });

  await refreshAggregates(p.id);
  bumpRank();
  revalidatePath(`/p/${p.slug}`);
  revalidatePath("/");
  return { ok: true };
}
