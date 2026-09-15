"use client";
import { useActionState, useState } from "react";
import { updateProfile, type ProfileState } from "@/actions/profile";
import { useT } from "./LangProvider";

export function ProfileForm({ me, uploads }: { me: { displayName: string; bio: string; linkUrl: string; avatarUrl: string }; uploads: boolean }) {
  const T = useT();
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {});
  const [preview, setPreview] = useState(me.avatarUrl);
  const [cleared, setCleared] = useState(false);
  return (
    <form action={action} encType="multipart/form-data" style={{ display: "grid", gap: 14 }}>
      <div className="field">
        <span className="label" id="p-photo-label">{T("photo")}</span>
        <div className="pick">
          <div className="pick__preview" style={{ borderRadius: "50%" }} aria-hidden="true">{preview && !cleared && <img src={preview} alt="" referrerPolicy="no-referrer" />}</div>
          <label className="btn btn--sm" htmlFor="p-photo">{T("pick_photo")}
            <input id="p-photo" name="photo" type="file" accept="image/png,image/jpeg,image/webp" className="visually-hidden" aria-labelledby="p-photo-label" disabled={!uploads}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) { setPreview(URL.createObjectURL(f)); setCleared(false); } }} />
          </label>
          {(preview && !cleared) && <button className="btn btn--ghost btn--sm" type="button" onClick={() => setCleared(true)}>{T("clear")}</button>}
          <input type="hidden" name="clearPhoto" value={cleared ? "1" : ""} />
        </div>
        {!uploads && <p className="help">{T("uploads_off_photo")}</p>}
      </div>
      <div className="field"><label className="label" htmlFor="p-name">{T("name")}</label><input className="input" id="p-name" name="displayName" defaultValue={me.displayName} maxLength={40} required /></div>
      <div className="field"><label className="label" htmlFor="p-bio">{T("bio")}</label><input className="input" id="p-bio" name="bio" defaultValue={me.bio} maxLength={200} /></div>
      <div className="field"><label className="label" htmlFor="p-link">{T("link")}</label><input className="input" id="p-link" name="linkUrl" type="url" defaultValue={me.linkUrl} placeholder="https://" maxLength={300} /></div>
      {state.error && <p className="error">{state.error}</p>}
      {state.ok && <p className="ok">{T("saved")}</p>}
      <button className="btn btn--solid" type="submit" disabled={pending}>{T("save")}</button>
    </form>
  );
}
