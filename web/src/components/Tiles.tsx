/* Image-first tiles for the top of a ranking: first screen, name with rank, counts; tagline shows on hover. */
import Link from "next/link";
import Image from "next/image";
import type { RankRow } from "@/lib/rank";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { Thumb } from "./ProductRow";

export function Tiles({ items, shots, lang }: { items: RankRow[]; shots: Record<number, string>; lang: Lang }) {
  return (
    <ol className="tiles">
      {items.map((r, i) => {
        const shot = shots[r.id];
        return (
          <li key={r.id} className="tile">
            <Link href={`/p/${r.slug}`} aria-label={`${i + 1}. ${r.name}, ${t(lang, "reviews_n")} ${r.reviews}, ${t(lang, "comments_n")} ${r.comments}`}>
              <div className="tile__img">
                {shot ? (
                  <Image src={shot} alt="" width={1440} height={900} sizes="400px" unoptimized={/^https?:/.test(shot) && !/vercel-storage\.com/.test(shot)} />
                ) : (
                  <div className="tile__blank"><Thumb p={r} /></div>
                )}
              </div>
              <div className="tile__cap">
                <span className="tile__name"><span className="tile__num num">{String(i + 1).padStart(2, "0")}</span>{r.name}</span>
                <span className="tile__meta num">{t(lang, "reviews_n")} {r.reviews} · {t(lang, "comments_n")} {r.comments}</span>
              </div>
              <p className="tile__tag">{lang === "en" && r.taglineEn ? r.taglineEn : r.tagline}</p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
