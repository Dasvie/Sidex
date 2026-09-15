"use server";
/* Screens are added on the product page by its maker, after the product exists. Up to 6. */
import { revalidatePath } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, screenshots } from "@/db/schema";
import { currentProfile } from "@/auth";
import { uploadImage } from "@/lib/upload";

export type ShotState = { error?: string; ok?: boolean };

async function ownedProduct(fd: FormData) {
  const me = await currentProfile();
  if (!me) return { error: "로그인 후에 할 수 있어요." };
  const productId = Number(fd.get("productId"));
  const p = await db.query.products.findFirst({ where: eq(products.id, productId), columns: { id: true, slug: true, ownerId: true } });
  if (!p || p.ownerId !== me.id) return { error: "내 프로덕트에만 올릴 수 있어요." };
  return { p };
}

export async function addScreenshots(_prev: ShotState, fd: FormData): Promise<ShotState> {
  const got = await ownedProduct(fd);
  if ("error" in got) return { error: got.error };
  const { p } = got;
  const have = await db.select({ id: screenshots.id }).from(screenshots).where(eq(screenshots.productId, p.id)).orderBy(asc(screenshots.sort));
  const room = 6 - have.length;
  if (room <= 0) return { error: "화면은 6장까지예요. 지우고 다시 올려 주세요." };
  const files = fd.getAll("shots").filter((f): f is File => f instanceof File && f.size > 0).slice(0, room);
  if (!files.length) return { error: "이미지를 골라 주세요." };
  const titles = fd.getAll("shotTitle").map(String);
  const rows = [];
  try {
    for (let i = 0; i < files.length; i++) {
      rows.push({ productId: p.id, url: await uploadImage(files[i], "shot"), title: (titles[i] || "").trim().slice(0, 60), caption: "", sort: have.length + i });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "이미지를 올리지 못했어요." };
  }
  await db.insert(screenshots).values(rows);
  revalidatePath(`/p/${p.slug}`);
  return { ok: true };
}

export async function removeScreenshot(_prev: ShotState, fd: FormData): Promise<ShotState> {
  const got = await ownedProduct(fd);
  if ("error" in got) return { error: got.error };
  const { p } = got;
  const id = Number(fd.get("id"));
  await db.delete(screenshots).where(and(eq(screenshots.id, id), eq(screenshots.productId, p.id)));
  revalidatePath(`/p/${p.slug}`);
  return { ok: true };
}
