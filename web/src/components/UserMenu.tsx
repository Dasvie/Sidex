"use client";
/* Signed-in menu: avatar top right, menu opens on hover (desktop
   pointer) or click, closes on Escape, outside click, or leaving it for 160ms. */
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar } from "./Avatar";
import { useT } from "./LangProvider";

type Me = { handle: string; displayName: string; avatarUrl: string };

export function UserMenu({ me, logout }: { me: Me; logout: ReactNode }) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const timer = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (min-width: 900px)");
    const set = () => setHoverable(mq.matches);
    set();
    mq.addEventListener("change", set);
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", onDoc);
    return () => { mq.removeEventListener("change", set); document.removeEventListener("click", onDoc); };
  }, []);

  return (
    <div
      className="user"
      ref={ref}
      onMouseEnter={() => { if (!hoverable) return; if (timer.current) window.clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { if (!hoverable) return; timer.current = window.setTimeout(() => setOpen(false), 160); }}
      onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false); (ref.current?.querySelector(".user__btn") as HTMLElement | null)?.focus(); } }}
    >
      <button type="button" className="user__btn" aria-haspopup="true" aria-expanded={open} aria-controls="user-menu" aria-label={T("my_menu")} onClick={() => setOpen((v) => (hoverable ? true : !v))}>
        <Avatar profile={me} />
      </button>
      <div className="user__menu" id="user-menu" hidden={!open}>
        <div className="user__head">
          <Avatar profile={me} size="lg" />
          <div><strong>{me.displayName}</strong><span>@{me.handle}</span></div>
        </div>
        <ul className="user__list">
          <li><Link href={`/u/${me.handle}`} onClick={() => setOpen(false)}>{T("my_profile")}</Link></li>
          <li><Link href="/submit" onClick={() => setOpen(false)}>{T("submit")}</Link></li>
          <li><Link href={`/u/${me.handle}#edit`} onClick={() => setOpen(false)}>{T("profile_edit")}</Link></li>
        </ul>
        <div className="user__out">{logout}</div>
      </div>
    </div>
  );
}
