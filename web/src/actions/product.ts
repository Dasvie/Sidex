"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";
import { currentProfile } from "@/auth";
import { isCategory } from "@/lib/categories";
import { topicById } from "@/lib/planmap";
import { measureDna } from "@/lib/dna";
import { bumpRank } from "@/lib/rank";
import { slugify } from "@/lib/slug";
import { uploadImage } from "@/lib/upload";

export type SubmitState = { error?: string; field?: string };
export type DeleteState = { error?: string };

const Form = z.object({
  url: z.string().trim().url("https://로 시작하는 주소를 넣어 주세요.").max(300),
  name: z.string().trim().min(1, "서비스명을 넣어 주세요.").max(60),
  tagline: z.string().trim().min(1, "한 줄 소개를 넣어 주세요.").max(120),
  why: z.string().trim().max(1000).default(""),
  description: z.string().trim().max(2000).default(""),
  detail: z.string().trim().max(4000).default(""),
  stage: z.enum(["idea", "prototype", "launched"]),
  stack: z.string().trim().max(120).default(""),
  tools: z.string().trim().max(120).default(""),
  buildDays: z.coerce.number().int().min(0).max(3650).optional(),
  teamSize: z.coerce.number().int().min(1).max(999).optional(),
  designMd: z.string().max(80000).default(""),
});

async function freeSlug(base: string) {
  let slug = slugify(base) || "product";
  for (let i = 0; i < 20; i++) {
    const hit = await db.query.products.findFirst({ where: eq(products.slug, slug), columns: { id: true } });
    if (!hit) return slug;
    slug = `${slugify(base).slice(0, 34)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

export async function submitProduct(_prev: SubmitState, fd: FormData): Promise<SubmitState> {
  const me = await currentProfile();
  if (!me) return { error: "등록은 로그인 후에 할 수 있어요." };

  const raw = Object.fromEntries(fd.entries());
  const parsed = Form.safeParse({
    ...raw,
    buildDays: raw.buildDays === "" ? undefined : raw.buildDays,
    teamSize: raw.teamSize === "" ? undefined : raw.teamSize,
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue.message, field: String(issue.path[0] ?? "") };
  }
  const cats = fd.getAll("categories").map(String).filter(isCategory).slice(0, 3);
  if (!cats.length) return { error: "카테고리를 하나 이상 골라 주세요.", field: "categories" };
  const topics = [...new Set(fd.getAll("topics").map(String))].filter((t) => { const hit = topicById(t); return hit && (cats as string[]).includes(hit.cat); }).slice(0, 5);

  const d = parsed.data;
  let logoUrl = "";
  const logo = fd.get("logo");
  try {
    if (logo instanceof File && logo.size > 0) logoUrl = await uploadImage(logo, "logo");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "이미지를 올리지 못했어요.", field: "logo" };
  }

  const slug = await freeSlug(d.name);
  const dna = await measureDna(d.url);
  const [row] = await db
    .insert(products)
    .values({
      slug, name: d.name, tagline: d.tagline, url: d.url, logoUrl, why: d.why, description: d.description, detail: d.detail,
      stage: d.stage, categories: cats, topics, ownerId: me.id, source: "member",
      stack: d.stack, tools: d.tools, buildDays: d.buildDays ?? null, teamSize: d.teamSize ?? null, dna,
      designMd: d.designMd.replace(/\r\n/g, "\n").trim(),
    })
    .returning({ id: products.id });

  bumpRank();
  revalidatePath("/");
  redirect(`/p/${slug}`);
}

/* Removes one of the maker's own products. Screens, reviews, comments, planning notes and votes
   go with it through the foreign keys; images stay in storage. */
export async function deleteProduct(_prev: DeleteState, fd: FormData): Promise<DeleteState> {
  const me = await currentProfile();
  if (!me) return { error: "로그인 후에 할 수 있어요." };
  const id = Number(fd.get("productId"));
  const p = await db.query.products.findFirst({ where: eq(products.id, id), columns: { slug: true, ownerId: true } });
  if (!p || p.ownerId !== me.id) return { error: "내 프로덕트만 지울 수 있어요." };
  await db.delete(products).where(eq(products.id, id));
  bumpRank();
  revalidatePath("/");
  revalidatePath(`/u/${me.handle}`);
  redirect(`/u/${me.handle}`);
}
