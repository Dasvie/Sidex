"use client";
import { createContext, useContext } from "react";
import { t, type Key, type Lang } from "@/lib/i18n";

const Ctx = createContext<Lang>("ko");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** Client-component helper: `const T = useT(); T("login")` */
export function useT() {
  const lang = useContext(Ctx);
  return Object.assign((key: Key, vars?: Record<string, string | number>) => t(lang, key, vars), { lang });
}
