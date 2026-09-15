"use client";
/* Screenshot carousel: a scroll-snap track, arrows at the sides, dots below. Native scrolling
   does the work (touch, trackpad, keyboard); the buttons and dots only call scrollTo. */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useT } from "./LangProvider";
import { Icon } from "./Icon";

type Shot = { id: number; url: string; title: string; caption: string };

export function Gallery({ shots, name }: { shots: Shot[]; name: string }) {
  const T = useT();
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
      setAt(Math.min(shots.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [shots.length]);

  function go(i: number) {
    const el = track.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  return (
    <div className="gallery">
      <div className="gallery__view">
        <div className="gallery__track" ref={track} tabIndex={0} aria-label={T("screens")}>
          {shots.map((s, i) => (
            <figure key={s.id} className="gallery__item" aria-hidden={i !== at} inert={i !== at}>
              <Image src={s.url} alt={s.title || `${name} ${T("screen_alt")}`} width={1440} height={900} sizes="(min-width: 900px) 640px, 100vw" priority={i === 0} unoptimized={/^https?:/.test(s.url) && !/vercel-storage\.com/.test(s.url)} />
              {(s.title || s.caption) && <figcaption><b>{s.title}</b>{s.caption}</figcaption>}
            </figure>
          ))}
        </div>
        {shots.length > 1 && (
          <>
            <button type="button" className="gallery__arrow gallery__arrow--prev" onClick={() => go(at - 1)} disabled={at === 0} aria-label={T("prev")}><Icon name="arrowLeft" size={18} /></button>
            <button type="button" className="gallery__arrow gallery__arrow--next" onClick={() => go(at + 1)} disabled={at === shots.length - 1} aria-label={T("next")}><Icon name="arrowRight" size={18} /></button>
          </>
        )}
      </div>
      {shots.length > 1 && (
        <div className="gallery__dots" role="tablist">
          {shots.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === at} aria-label={`${i + 1} / ${shots.length}`} className={"gallery__dot" + (i === at ? " is-on" : "")} onClick={() => go(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
