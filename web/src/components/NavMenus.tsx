"use client";
/* Product Hunt-style mega menus:
   hover opens on a desktop pointer (160ms grace on leave), click toggles everywhere,
   Escape and outside clicks close, ArrowDown from a trigger moves into the panel. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useT } from "./LangProvider";

export type MenuLink = { href: string; label: string; num?: string };
type Props = {
  trending: MenuLink[];
  categories: MenuLink[];
  categoryTop: MenuLink[];
};

const CHEVRON = (
  <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
);

function useHoverable() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (min-width: 900px)");
    const set = () => setOk(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return ok;
}

function Item({ id, label, open, onToggle, children }: { id: string; label: string; open: boolean; onToggle: (v?: boolean) => void; children: React.ReactNode }) {
  const hoverable = useHoverable();
  const timer = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="nav__item"
      ref={ref}
      onMouseEnter={() => { if (!hoverable) return; if (timer.current) window.clearTimeout(timer.current); onToggle(true); }}
      onMouseLeave={() => { if (!hoverable) return; timer.current = window.setTimeout(() => onToggle(false), 160); }}
      onKeyDown={(e) => {
        if (e.key === "Escape") { onToggle(false); (ref.current?.querySelector(".nav__trigger") as HTMLElement | null)?.focus(); }
        if (e.key === "ArrowDown" && (e.target as HTMLElement).classList.contains("nav__trigger")) {
          onToggle(true);
          const first = ref.current?.querySelector(".mega a") as HTMLElement | null;
          if (first) { e.preventDefault(); first.focus(); }
        }
      }}
    >
      <button type="button" className="nav__trigger" aria-expanded={open} aria-controls={id} onClick={() => (hoverable ? onToggle(true) : onToggle())}>
        {label}{CHEVRON}
      </button>
      <div className="mega" id={id} hidden={!open}>{children}</div>
    </div>
  );
}

export function NavMenus({ trending, categories, categoryTop }: Props) {
  const T = useT();
  const [open, setOpen] = useState<"products" | "categories" | null>(null);
  const [burger, setBurger] = useState(false);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest("[data-nav]")) setOpen(null); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);
  const toggle = (k: "products" | "categories") => (v?: boolean) => setOpen((cur) => (v == null ? (cur === k ? null : k) : v ? k : cur === k ? null : cur));

  return (
    <>
      <button type="button" className="burger" aria-expanded={burger} aria-controls="nav" aria-label={T("menu")} onClick={() => setBurger((b) => !b)}>
        <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
      </button>
      <nav className={"nav" + (burger ? " is-open" : "")} id="nav" aria-label={T("nav_ranking")} data-nav>
        <Item id="mega-products" label={T("nav_products")} open={open === "products"} onToggle={toggle("products")}>
          <div className="mega__col">
            <p className="mega__title">{T("nav_ranking")}</p>
            <ul className="mega__list">
              <li><Link href="/">{T("nav_this_month")}</Link></li>
              <li><Link href="/?scope=all">{T("nav_all_time")}</Link></li>
            </ul>
          </div>
          <div className="mega__col">
            <p className="mega__title">{T("nav_trending")}</p>
            <ul className="mega__list">
              {trending.length ? trending.map((l) => (
                <li key={l.href}><Link href={l.href}><span>{l.label}</span>{l.num && <span className="num">{l.num}</span>}</Link></li>
              )) : <li><Link href="/submit">{T("nav_be_first")}</Link></li>}
            </ul>
          </div>
        </Item>
        <Item id="mega-categories" label={T("nav_categories")} open={open === "categories"} onToggle={toggle("categories")}>
          <div className="mega__col">
            <p className="mega__title">{T("nav_categories")}</p>
            <ul className="mega__list">
              {categories.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
            <ul className="mega__list mega__more"><li><Link href="/c">{T("nav_all_categories")}</Link></li></ul>
          </div>
          <div className="mega__col">
            <p className="mega__title">{T("nav_category_top")}</p>
            <ul className="mega__list">
              {categoryTop.length ? categoryTop.map((l) => (
                <li key={l.href + l.label}><Link href={l.href}><span>{l.label}</span>{l.num && <span className="num">{l.num}</span>}</Link></li>
              )) : <li><Link href="/c">{T("nav_none_yet")}</Link></li>}
            </ul>
          </div>
        </Item>
      </nav>
    </>
  );
}
