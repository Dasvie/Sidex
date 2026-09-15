"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useT } from "./LangProvider";

export function SearchBox() {
  const T = useT();
  const router = useRouter();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        ref.current?.focus();
        ref.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const v = q.trim();
        if (v) router.push(`/search?q=${encodeURIComponent(v)}`);
      }}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="7.2" cy="7.2" r="4.4" /><path d="m10.7 10.7 2.8 2.8" /></svg>
      <input ref={ref} id="q" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={T("search")} aria-label={T("search_label")} autoComplete="off" />
      <kbd className="search__kbd" aria-hidden="true">Ctrl K</kbd>
    </form>
  );
}
