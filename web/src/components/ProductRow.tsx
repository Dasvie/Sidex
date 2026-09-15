"use client";
import Link from "next/link";
import type { RankRow } from "@/lib/rank";
import { categoryName, stageName } from "@/lib/categories";
import { useT } from "./LangProvider";
import { rating, initials } from "@/lib/format";
import { faviconFor } from "@/lib/slug";
import { highlight } from "@/lib/highlight";

export function Thumb({ p, className }: { p: { name: string; logoUrl: string; url: string }; className?: string }) {
  const src = p.logoUrl || faviconFor(p.url);
  if (src) return <img className={"thumb " + (className || "")} src={src} alt="" loading="lazy" referrerPolicy="no-referrer" />;
  return <span className={"thumb thumb--initial " + (className || "")} aria-hidden="true">{initials(p.name)}</span>;
}

export function ProductRow({ r, idx, q }: { r: RankRow; idx?: number; q?: string }) {
  const T = useT();
  const tagline = T.lang === "en" && r.taglineEn ? r.taglineEn : r.tagline;
  return (
    <li className={"row" + (idx != null ? " row--indexed" : "")}>
      {idx != null && <span className="row__idx num" aria-hidden="true">{String(idx).padStart(2, "0")}</span>}
      <Link href={`/p/${r.slug}`} tabIndex={-1} aria-hidden="true"><Thumb p={r} /></Link>
      <div>
        <h3 className="row__title">
          <Link href={`/p/${r.slug}`}>{highlight(r.name, q)}</Link>
          {r.stage !== "launched" && <span className="row__stage">{stageName(r.stage, T.lang)}</span>}
        </h3>
        <p className="row__tagline">{highlight(tagline, q)}</p>
        <div className="row__meta">
          {r.categories.map((c, i) => (
            <span key={c}>
              {i > 0 && <span className="row__dot">· </span>}
              <Link href={`/c/${c}`}>{categoryName(c, T.lang)}</Link>
            </span>
          ))}
          <span className="row__dot">·</span>
          {r.ownerHandle ? (
            <Link className="by" href={`/u/${r.ownerHandle}`}>{r.ownerName || r.ownerHandle}</Link>
          ) : (
            <span>{r.makerName || "-"}</span>
          )}
        </div>
      </div>
      <div className="row__counts">
        <span className="count count--rating" aria-label={`${T("rating")} ${rating(r.ratingAvg) || "-"}`}>{rating(r.ratingAvg) || "-"}<small>{T("rating")}</small></span>
        <span className="count" aria-label={`${T("reviews_n")} ${r.reviews}`}>{r.reviews}<small>{T("reviews_n")}</small></span>
        <span className="count" aria-label={`${T("comments_n")} ${r.comments}`}>{r.comments}<small>{T("comments_n")}</small></span>
        <span className={"count" + (r.notes ? " count--plan" : "")} aria-label={`${T("plan_n")} ${r.notes}`}>{r.notes}<small>{T("plan_n")}</small></span>
      </div>
    </li>
  );
}
