"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isLang } from "@/lib/i18n";
import { LANG_COOKIE } from "@/lib/lang";

export async function setLang(fd: FormData) {
  const v = String(fd.get("lang") || "");
  if (!isLang(v)) return;
  (await cookies()).set(LANG_COOKIE, v, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
}
