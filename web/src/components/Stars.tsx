export const STAR = "M8 1.5l1.9 4.1 4.5.5-3.3 3.1.9 4.4L8 11.4l-4 2.2.9-4.4L1.6 6.1l4.5-.5z";

export function Stars({ value, count, label }: { value: number; count?: number; label?: string }) {
  if (!value) return <span className="meta">-</span>;
  return (
    <span className="stars">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d={STAR} /></svg>
      <span className="num">{(value / 10).toFixed(1)}</span>
      {count != null && <span className="meta" style={{ fontWeight: 400 }}>{label ?? "리뷰"} {count}</span>}
    </span>
  );
}
