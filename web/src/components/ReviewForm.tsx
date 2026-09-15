"use client";
import { useActionState, useState } from "react";
import { addReview, type ReviewState } from "@/actions/review";
import { AXES } from "@/lib/categories";
import { STAR } from "./Stars";
import { useT } from "./LangProvider";

type Mine = { stars: number; good: string; bad: string; ux: number; polish: number; design: number; originality: number } | null;

function StarPick({ name, value, onChange, label }: { name: string; value: number; onChange: (v: number) => void; label: string }) {
  return (
    <span className="starpick" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>
          <input type="radio" id={`${name}-${n}`} name={name} value={n} checked={value === n} onChange={() => onChange(n)} />
          <label htmlFor={`${name}-${n}`} className={n <= value ? "on" : ""} aria-label={String(n)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d={STAR} /></svg>
          </label>
        </span>
      ))}
    </span>
  );
}

export function ReviewForm({ productId, mine }: { productId: number; mine: Mine }) {
  const T = useT();
  const [state, action, pending] = useActionState<ReviewState, FormData>(addReview, {});
  const [stars, setStars] = useState(mine?.stars ?? 0);
  const [axes, setAxes] = useState<Record<string, number>>({ ux: mine?.ux ?? 0, polish: mine?.polish ?? 0, design: mine?.design ?? 0, originality: mine?.originality ?? 0 });
  const [open, setOpen] = useState(!!mine);
  if (!open) return <button className="btn" type="button" onClick={() => setOpen(true)}>{T("write_review")}</button>;
  return (
    <form action={action} className="card form" style={{ padding: 20 }} data-pending={pending || undefined}>
      <fieldset disabled={pending} style={{ display: "grid", gap: 16 }}>
      <input type="hidden" name="productId" value={productId} />
      <div className="field">
        <span className="label">{T("stars")}</span>
        <StarPick name="stars" value={stars} onChange={setStars} label={T("stars")} />
      </div>
      <div className="review__pn">
        <div className="field">
          <label className="label" htmlFor="r-good">{T("good")}</label>
          <textarea className="textarea" id="r-good" name="good" rows={3} maxLength={1000} defaultValue={mine?.good} required />
        </div>
        <div className="field">
          <label className="label" htmlFor="r-bad">{T("bad")}</label>
          <textarea className="textarea" id="r-bad" name="bad" rows={3} maxLength={1000} defaultValue={mine?.bad} required />
        </div>
      </div>
      <div className="review__pn">
        {AXES.map((a) => (
          <div key={a.key} className="field" style={{ gridTemplateColumns: "88px 1fr", alignItems: "center", display: "grid" }}>
            <span className="label">{T(a.name)}</span>
            <StarPick name={a.key} value={axes[a.key]} onChange={(v) => setAxes((s) => ({ ...s, [a.key]: v }))} label={T(a.name)} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
        {state.error && <span className="error" style={{ marginRight: "auto" }}>{state.error}</span>}
        {state.ok && <span className="flash" style={{ marginRight: "auto" }} role="status">{T("saved")}</span>}
        <button className="btn btn--cta" type="submit" disabled={pending || !stars || Object.values(axes).some((v) => !v)} aria-busy={pending}>{pending && <i className="spin" aria-hidden="true" />}{mine ? T("update_review") : T("save_review")}</button>
      </div>
      <p className="help">{T("review_help")}</p>
      </fieldset>
    </form>
  );
}
