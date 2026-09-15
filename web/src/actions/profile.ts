"use server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { currentProfile } from "@/auth";
import { uploadImage } from "@/lib/upload";

export type ProfileState = { error?: string; ok?: boolean };

const Form = z.object({
  displayName: z.string().trim().min(1, "이름을 넣어 주세요.").max(40),
  bio: z.string().trim().max(200).default(""),
  linkUrl: z.union([z.literal(""), z.string().trim().url("https://로 시작하는 주소여야 합니다.")]).default(""),
});

export async function updateProfile(_prev: ProfileState, fd: FormData): Promise<ProfileState> {
  const me = await currentProfile();
  if (!me) return { error: "로그인이 필요합니다." };
  const parsed = Form.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  let avatarUrl = me.avatarUrl;
  const photo = fd.get("photo");
  try {
    if (photo instanceof File && photo.size > 0) avatarUrl = await uploadImage(photo, "avatar");
    if (fd.get("clearPhoto") === "1") avatarUrl = "";
  } catch (e) {
    return { error: e instanceof Error ? e.message : "사진을 올리지 못했습니다." };
  }
  await db.update(profiles).set({ ...parsed.data, avatarUrl }).where(eq(profiles.id, me.id));
  revalidatePath(`/u/${me.handle}`);
  revalidatePath("/", "layout");
  return { ok: true };
}
