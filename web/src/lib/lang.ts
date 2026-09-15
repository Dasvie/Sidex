/* Server side of the language choice: a cookie, read in Server Components and layout. */
import { cookies } from "next/headers";
import { isLang, t, type Key, type Lang } from "./i18n";

export const LANG_COOKIE = "sidex-lang";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : "ko";
}

/** Server-component helper: `const T = await getT(); T("login")` */
export async function getT() {
  const lang = await getLang();
  return Object.assign((key: Key, vars?: Record<string, string | number>) => t(lang, key, vars), { lang });
}
