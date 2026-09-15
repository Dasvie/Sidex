"use client";
/* The home hero's one detail: two pastel orbs that drift on their own (CSS) and lean a few
   pixels toward the pointer. No React state per frame; the pointer writes two CSS variables. */
import { useEffect, useRef } from "react";

export function HeroOrbs() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    const host = el.parentElement || el;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="orbs" ref={ref} aria-hidden="true">
      <div className="orb orb--peach hero__orb" />
      <div className="orb orb--sky hero__orb hero__orb--2" />
    </div>
  );
}
