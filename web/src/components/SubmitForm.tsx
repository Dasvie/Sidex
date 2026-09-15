"use client";
/* Submit flow: one address first. The page reads the site's own title, description and icon,
   drafts the row the way it will look in the ranking, and the submitter corrects it.
   Step 1 (name, one-liner, categories) is enough to publish; step 2 folds the rest away.
   Screens are added on the product page after it exists. Logged-out visitors get the whole
   draft experience and log in at the last step. */
import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { submitProduct, type SubmitState } from "@/actions/product";
import { CATEGORIES, categoryName } from "@/lib/categories";
import { label, topicsOf } from "@/lib/planmap";
import { faviconFor } from "@/lib/slug";
import { useT } from "./LangProvider";
import { Icon } from "./Icon";

type Read = { title: string; description: string; favicon: string };
type Props = { uploads: boolean; loggedIn: boolean; myName: string };

const CHEVRON = <svg className="chev" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>;

export function SubmitForm({ uploads, loggedIn, myName }: Props) {
  const T = useT();
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitProduct, {});
  const [url, setUrl] = useState("");
  const [read, setRead] = useState<Read | null>(null);
  const [reading, setReading] = useState<"idle" | "busy" | "fail" | "done">("idle");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const topicOptions = picked.flatMap((c) => topicsOf(c));
  const [logo, setLogo] = useState("");
  const touched = useRef({ name: false, tagline: false });
  const err = (f: string) => (state.field === f ? <p className="error">{state.error}</p> : null);

  // read the address 600ms after typing stops
  useEffect(() => {
    if (!/^https?:\/\/\S+\.\S{2,}/.test(url)) { setRead(null); setReading("idle"); return; }
    const id = setTimeout(async () => {
      setReading("busy");
      try {
        const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error();
        const r = (await res.json()) as Read;
        setRead(r);
        setReading("done");
        if (!touched.current.name && r.title) setName(r.title);
        if (!touched.current.tagline && r.description) setTagline(r.description);
      } catch {
        setRead(null);
        setReading("fail");
      }
    }, 600);
    return () => clearTimeout(id);
  }, [url]);

  const thumb = logo || read?.favicon || (url ? faviconFor(url) : "");
  const validUrl = /^https?:\/\/\S+\.\S{2,}/.test(url);

  return (
    <form action={action} className="submit form" encType="multipart/form-data" data-pending={pending || undefined}>
      {/* step 1 */}
      <div className="shead shead--step">
        <div><span className="pill">1</span><h2 className="shead__title">{T("s_step1")}</h2></div>
      </div>
      <div className="field">
        <label className="label" htmlFor="f-url">{T("f_url")}</label>
        <div className="urlbox">
          <input className="input" id="f-url" name="url" type="url" placeholder="https://" maxLength={300} inputMode="url" autoComplete="url" spellCheck={false} required value={url} onChange={(e) => setUrl(e.target.value.trim())} />
          {reading === "busy" && <span className="urlbox__state"><i className="spin" aria-hidden="true" />{T("s_reading")}</span>}
        </div>
        {err("url")}
        <p className="help">{reading === "fail" ? T("s_read_fail") : reading === "done" ? T("s_read_from") : T("f_url_help")}</p>
      </div>

      {/* the row as it will appear in the ranking */}
      <div className="preview" aria-live="polite">
        <p className="preview__label">{T("s_preview")}</p>
        <div className="row row--static">
          {thumb ? <img className="thumb" src={thumb} alt="" referrerPolicy="no-referrer" /> : <span className="thumb thumb--initial" aria-hidden="true">{(name || "?").slice(0, 1)}</span>}
          <div>
            <p className="row__title">{name || "-"}</p>
            <p className="row__tagline">{tagline || "-"}</p>
            <p className="row__meta">
              {picked.length ? picked.map((c, i) => <span key={c}>{i > 0 && <span className="row__dot">· </span>}{categoryName(c, T.lang)}</span>) : <span>-</span>}
              <span className="row__dot">·</span>
              <span>{myName || "-"}</span>
            </p>
          </div>
          <div className="row__counts">
            <span className="count">-<small>{T("rating")}</small></span>
            <span className="count">0<small>{T("reviews_n")}</small></span>
            <span className="count">0<small>{T("comments_n")}</small></span>
            <span className="count">0<small>{T("plan_n")}</small></span>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="f-name">{T("f_name")}</label>
        <input className="input" id="f-name" name="name" type="text" maxLength={60} required value={name} onChange={(e) => { touched.current.name = true; setName(e.target.value); }} />
        {err("name")}
      </div>
      <div className="field">
        <label className="label" htmlFor="f-tagline">{T("f_tagline")}</label>
        <input className="input" id="f-tagline" name="tagline" type="text" maxLength={120} required value={tagline} onChange={(e) => { touched.current.tagline = true; setTagline(e.target.value); }} />
        {err("tagline")}
      </div>
      <fieldset className="field">
        <legend className="label">{T("f_categories")}<small>{T("f_categories_max")}</small></legend>
        <div className="choice">
          {CATEGORIES.map((c) => {
            const on = picked.includes(c.slug);
            const full = picked.length >= 3 && !on;
            return (
              <label key={c.slug}>
                <input type="checkbox" name="categories" value={c.slug} checked={on} disabled={full}
                  onChange={(e) => setPicked((s) => (e.target.checked ? [...s, c.slug] : s.filter((x) => x !== c.slug)))} />
                <span className="chip" style={full ? { opacity: 0.4 } : undefined}>{categoryName(c.slug, T.lang)}</span>
              </label>
            );
          })}
        </div>
        {err("categories")}
      </fieldset>
      {topicOptions.length > 0 && (
        <fieldset className="field">
          <legend className="label">{T("f_topics")}<small>{T("f_topics_max")}</small></legend>
          <div className="choice">
            {topicOptions.map(({ id, node }) => {
              const on = topics.includes(id);
              const full = topics.length >= 5 && !on;
              return (
                <label key={id}>
                  <input type="checkbox" name="topics" value={id} checked={on} disabled={full}
                    onChange={(e) => setTopics((s) => (e.target.checked ? [...s, id] : s.filter((x) => x !== id)))} />
                  <span className="chip" style={full ? { opacity: 0.4 } : undefined}>{label(node, T.lang)}</span>
                </label>
              );
            })}
          </div>
          <p className="help">{T("f_topics_help")}</p>
        </fieldset>
      )}

      {/* step 2 */}
      <details className="more">
        <summary>
          <span><span className="pill">2</span> {T("s_step2")}<small>{T("optional")}</small></span>
          {CHEVRON}
        </summary>
        <p className="help" style={{ marginBottom: 20 }}>{T("s_step2_hint")}</p>

        <div className="field">
          <span className="label" id="f-logo-label">{T("f_logo")}</span>
          <div className="pick">
            <div className="pick__preview" aria-hidden="true">{(logo || read?.favicon) && <img src={logo || read!.favicon} alt="" referrerPolicy="no-referrer" />}</div>
            <label className="btn" htmlFor="f-logo">{T("pick_image")}
              <input id="f-logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp" className="visually-hidden" aria-labelledby="f-logo-label" disabled={!uploads}
                onChange={(e) => { const f = e.target.files?.[0]; setLogo(f ? URL.createObjectURL(f) : ""); }} />
            </label>
          </div>
          <p className="help">{uploads ? T("s_logo_help") : T("uploads_off_logo")}</p>
          {err("logo")}
        </div>
        <fieldset className="field">
          <legend className="label">{T("f_stage")}</legend>
          <div className="choice">
            {([["launched", T("stage_launched")], ["prototype", T("stage_prototype")], ["idea", T("stage_idea")]] as const).map(([v, n], i) => (
              <label key={v}><input type="radio" name="stage" value={v} defaultChecked={i === 0} /><span className="chip">{n}</span></label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label className="label" htmlFor="f-why">{T("why")}</label>
          <textarea className="textarea" id="f-why" name="why" rows={3} maxLength={1000} />
          {err("why")}
        </div>
        <div className="field">
          <label className="label" htmlFor="f-description">{T("what")}</label>
          <textarea className="textarea" id="f-description" name="description" rows={4} maxLength={2000} />
          {err("description")}
        </div>
        <div className="field">
          <label className="label" htmlFor="f-detail">{T("f_detail")}</label>
          <textarea className="textarea" id="f-detail" name="detail" rows={5} maxLength={4000} />
        </div>
        <fieldset className="field">
          <legend className="label">{T("f_build")}</legend>
          <div className="review__pn">
            <div className="field"><label className="label" htmlFor="f-stack">{T("stack")}</label><input className="input" id="f-stack" name="stack" maxLength={120} placeholder={T("f_stack_ph")} /></div>
            <div className="field"><label className="label" htmlFor="f-tools">{T("tools")}</label><input className="input" id="f-tools" name="tools" maxLength={120} placeholder={T("f_tools_ph")} /></div>
            <div className="field"><label className="label" htmlFor="f-days">{T("build_days")}<small>{T("days").trim()}</small></label><input className="input" id="f-days" name="buildDays" type="number" min={0} max={3650} inputMode="numeric" /></div>
            <div className="field"><label className="label" htmlFor="f-team">{T("f_team")}</label><input className="input" id="f-team" name="teamSize" type="number" min={1} max={999} inputMode="numeric" /></div>
          </div>
        </fieldset>
        <div className="field">
          <label className="label" htmlFor="f-design">{T("f_design")}</label>
          <textarea className="textarea" id="f-design" name="designMd" rows={6} maxLength={80000} spellCheck={false} style={{ fontSize: 13 }} />
          <p className="help">{T("f_design_help")}</p>
        </div>
        <p className="help" style={{ marginTop: 20 }}>{T("s_shots_later")}</p>
      </details>

      {state.error && !state.field && <p className="error" style={{ marginTop: 20 }}>{state.error}</p>}
      <div className="submit__foot">
        {loggedIn ? (
          <button className="btn btn--cta btn--lg" type="submit" disabled={pending} aria-busy={pending}>{pending && <i className="spin" aria-hidden="true" />}{pending ? T("submitting") : T("submit_btn")}</button>
        ) : (
          <Link className="btn btn--cta btn--lg" href="/login?next=/submit">{T("s_login_submit")}<Icon name="arrowRight" /></Link>
        )}
        {validUrl && name && tagline && picked.length > 0 && <span className="help">{T("s_ready")}</span>}
      </div>
    </form>
  );
}
