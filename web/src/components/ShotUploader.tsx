"use client";
/* Maker-only panel under the gallery: add up to six screens, remove one. */
import { useActionState, useState } from "react";
import { addScreenshots, removeScreenshot, type ShotState } from "@/actions/screenshot";
import { useT } from "./LangProvider";
import { Icon } from "./Icon";

type Shot = { id: number; url: string; title: string };

function Remove({ productId, shot }: { productId: number; shot: Shot }) {
  const T = useT();
  const [, action, pending] = useActionState<ShotState, FormData>(removeScreenshot, {});
  return (
    <form action={action} className="up__row">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="id" value={shot.id} />
      <img src={shot.url} alt="" />
      <span>{shot.title || "-"}</span>
      <button type="submit" className="btn btn--ghost btn--sm" disabled={pending}>{T("up_remove")}</button>
    </form>
  );
}

export function ShotUploader({ productId, shots, uploads }: { productId: number; shots: Shot[]; uploads: boolean }) {
  const T = useT();
  const [state, action, pending] = useActionState<ShotState, FormData>(addScreenshots, {});
  const [picked, setPicked] = useState<string[]>([]);
  const room = 6 - shots.length;
  return (
    <div className="up">
      {shots.length > 0 && <div className="up__list">{shots.map((s) => <Remove key={s.id} productId={productId} shot={s} />)}</div>}
      {room > 0 && (
        <form action={action} encType="multipart/form-data" className="up__form form" data-pending={pending || undefined} key={state.ok ? Date.now() : "f"}>
          <input type="hidden" name="productId" value={productId} />
          <label className="btn" htmlFor="up-shots"><Icon name="external" />{T("up_pick")}
            <input id="up-shots" name="shots" type="file" accept="image/png,image/jpeg,image/webp" multiple className="visually-hidden" disabled={!uploads}
              onChange={(e) => setPicked(Array.from(e.target.files || []).slice(0, room).map((f) => URL.createObjectURL(f)))} />
          </label>
          {picked.length > 0 && (
            <div className="shots">
              {picked.map((src, i) => (
                <div key={src} className="shots__item">
                  <img src={src} alt="" />
                  <input className="input" name="shotTitle" placeholder={T("shot_title", { n: i + 1 })} maxLength={60} />
                </div>
              ))}
            </div>
          )}
          <div className="up__foot">
            <span className="help">{uploads ? T("up_shots_help", { n: room }) : T("uploads_off_photo")}</span>
            {state.error && <span className="error">{state.error}</span>}
            {state.ok && <span className="flash" role="status">{T("up_done")}</span>}
            {picked.length > 0 && <button type="submit" className="btn btn--solid btn--sm" disabled={pending || !uploads} aria-busy={pending}>{pending && <i className="spin" aria-hidden="true" />}{T("up_shots")}</button>}
          </div>
        </form>
      )}
    </div>
  );
}
