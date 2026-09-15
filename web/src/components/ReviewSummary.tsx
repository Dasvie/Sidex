/* Review summary, App Store style: the average with a star row, the 5-to-1 distribution,
   and the four axes as bars. Server-renderable; every number comes from the review rows. */
import { STAR } from "./Stars";

type Props = {
  avg: number; // x10
  count: number;
  dist: { s: number; n: number }[];
  axes: { key: string; label: string; v: number; pct: number }[];
  countLabel: string;
};

function StarRow({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 50) * 100));
  const row = (cls: string) => (
    <span className={cls}>
      {[0, 1, 2, 3, 4].map((i) => <svg key={i} viewBox="0 0 16 16"><path d={STAR} /></svg>)}
    </span>
  );
  return (
    <span className="starrow" aria-hidden="true">
      {row("starrow__base")}
      <span className="starrow__fill" style={{ width: `${pct}%` }}>{row("")}</span>
    </span>
  );
}

export function ReviewSummary({ avg, count, dist, axes, countLabel }: Props) {
  const max = Math.max(1, ...dist.map((d) => d.n));
  const distPct = dist.map((d) => ({ ...d, pct: (d.n / max) * 100 }));
  return (
    <div className="summary">
      <div className="summary__avg">
        <span className="summary__big">{(avg / 10).toFixed(1)}</span>
        <StarRow value={avg} />
        <span className="summary__count">{countLabel}</span>
      </div>
      <div className="summary__dist" role="list">
        {distPct.map((d) => (
          <div key={d.s} role="listitem" aria-label={`${d.s}: ${d.n}`}>
            <span>{d.s}</span>
            <i><b style={{ width: `${d.pct}%` }} /></i>
            <span>{d.n}</span>
          </div>
        ))}
      </div>
      <div className="summary__axes" role="list">
        {axes.map((a) => (
          <div key={a.key} role="listitem" aria-label={`${a.label}: ${a.v.toFixed(1)}`}>
            <span>{a.label}</span>
            <i><b style={{ width: `${a.pct}%` }} /></i>
            <b>{a.v.toFixed(1)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
