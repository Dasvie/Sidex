"use client";
/* DESIGN.md viewer. Preview = numbered token sheets drawn on the product's own canvas
   (palette, type scale, buttons, surfaces, forms, spacing, radius, elevation, responsive),
   the same reading order getdesign.md uses. Every value and every sentence comes from the
   file; sections whose data is missing are skipped and the numbering closes the gap.
   Everything is set in Pretendard: proprietary faces named in the file are not loaded. */
import { useState, type CSSProperties, type ReactNode } from "react";
import type { ComponentToken, DesignNotes, DesignTokens, TypeToken } from "@/lib/designmd";
import { useT } from "./LangProvider";

type Props = { name: string; tokens: DesignTokens; notes: DesignNotes; raw: string };

const REF = /^\{([\w-]+)\.([\w-]+)\}$/;

function val(tokens: DesignTokens, ref: string | undefined): string {
  if (!ref) return "";
  const m = REF.exec(ref.trim());
  if (!m) return ref;
  const g = (tokens as unknown as Record<string, Record<string, unknown>>)[m[1]];
  const v = g?.[m[2]];
  return v == null || typeof v === "object" ? "" : String(v);
}
function typeOf(tokens: DesignTokens, ref: string | undefined): TypeToken | undefined {
  const m = ref && REF.exec(ref.trim());
  return m && m[1] === "typography" ? tokens.typography[m[2]] : undefined;
}
function typeStyle(t?: TypeToken, cap?: number): CSSProperties {
  if (!t) return {};
  const px = parseFloat(String(t.fontSize || ""));
  const capped = Boolean(cap && px > cap);
  const size = capped ? `clamp(${Math.round(cap! * 0.62)}px, 7vw, ${cap}px)` : t.fontSize;
  const ls = parseFloat(String(t.letterSpacing ?? ""));
  const letterSpacing = capped && !Number.isNaN(ls) ? `${(ls * (cap! / px)).toFixed(2)}px` : t.letterSpacing;
  return { fontSize: size, fontWeight: t.fontWeight as number, lineHeight: t.lineHeight as number, letterSpacing };
}
function colorOf(tokens: DesignTokens, ...names: RegExp[]) {
  const keys = Object.keys(tokens.colors);
  for (const re of names) {
    const k = keys.find((x) => re.test(x));
    if (k) return tokens.colors[k];
  }
  return "";
}
function isDark(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 128;
}
function headingStyle(t?: TypeToken) {
  return t && parseFloat(String(t.fontSize)) >= 18 ? typeStyle(t, 22) : undefined;
}
function sizeLine(t: TypeToken) {
  return [t.fontSize, t.fontWeight, t.lineHeight, t.letterSpacing].filter((x) => x != null && x !== "").join(" / ");
}
function radiusNum(v: string) {
  const n = parseFloat(v);
  return Number.isNaN(n) ? v : n >= 999 ? "∞" : String(n);
}
function sameColor(a: string, b: string) {
  return a.replace(/\s/g, "").toLowerCase() === b.replace(/\s/g, "").toLowerCase();
}

/* Brand palette the sheets are drawn with: canvas, ink, muted, hairline, surface, primary. */
function brandOf(tokens: DesignTokens) {
  const canvas = colorOf(tokens, /^canvas$/, /^background$/, /^surface$/) || "#ffffff";
  const dark = isDark(canvas);
  const ink = colorOf(tokens, /^ink$/, /^on-canvas$/, /^foreground$/, /^text$/) || (dark ? "#f5f5f5" : "#111111");
  const muted = colorOf(tokens, /^ink-muted$/, /^ink-secondary$/, /^text-muted$/, /muted/, /secondary-text/) || `color-mix(in srgb, ${ink} 62%, ${canvas})`;
  const hairline = colorOf(tokens, /^hairline$/, /^border$/, /hairline/, /border/, /line/) || `color-mix(in srgb, ${ink} 14%, ${canvas})`;
  const surface = colorOf(tokens, /^surface-1$/, /^surface$/, /^card$/, /^canvas-soft$/) || canvas;
  const primary = colorOf(tokens, /^primary$/, /^accent$/, /^brand$/) || ink;
  return { canvas, dark, ink, muted, hairline, surface, primary };
}
type Brand = ReturnType<typeof brandOf>;

/* Component chrome from its token block. Missing keys fall back to the brand surface so a
   white-on-white card still reads (a hairline appears whenever the fill equals the canvas). */
function chrome(tokens: DesignTokens, b: Brand, c: ComponentToken, cap: number, defaults: CSSProperties): CSSProperties {
  const bg = val(tokens, c.backgroundColor);
  const fg = val(tokens, c.textColor);
  const out: CSSProperties = {
    ...defaults,
    background: bg || defaults.background,
    color: fg || defaults.color,
    borderRadius: val(tokens, c.rounded) || defaults.borderRadius,
    padding: c.padding || defaults.padding,
    ...typeStyle(typeOf(tokens, c.typography), cap),
  };
  const fill = String(out.background || "");
  const flat = !fill || sameColor(fill, b.canvas) || sameColor(fill, b.surface) || /transparent|rgba\([^)]*,\s*0?\.[0-2]\d*\)/.test(fill);
  if (c.borderColor) out.border = `1px solid ${val(tokens, c.borderColor)}`;
  else if (flat) out.border = `1px solid ${b.hairline}`;
  if (c.shadow || c.boxShadow) out.boxShadow = c.shadow || c.boxShadow;
  return out;
}

const IS_STATE = /-(pressed|hover|hovered|focus|focused|active|disabled|selected)$/;
const IS_BUTTON = /button|btn|badge|pill|chip|tag|link/;
const IS_FORM = /input|textarea|field|select|search|checkbox|switch|toggle/;

type Sec = { kind: "foundations" | "components" | "responsive"; title: string; intro?: string; body: ReactNode };

export function DesignSystem({ name, tokens, notes, raw }: Props) {
  const T = useT();
  const [tab, setTab] = useState<"preview" | "md">("preview");
  const [copied, setCopied] = useState(false);
  const b = brandOf(tokens);

  const colors = Object.entries(tokens.colors);
  const types = Object.entries(tokens.typography);
  const comps = Object.entries(tokens.components).filter(([k]) => !k.startsWith("ex-") && !IS_STATE.test(k));
  const buttons = comps.filter(([k]) => IS_BUTTON.test(k) && !IS_FORM.test(k) && !/icon/.test(k));
  const forms = comps.filter(([k]) => IS_FORM.test(k));
  const surfaces = comps.filter(([k, c]) => !IS_BUTTON.test(k) && !IS_FORM.test(k) && (c.backgroundColor || c.textColor));
  const spacing = Object.entries(tokens.spacing);
  const rounded = Object.entries(tokens.rounded);
  const largest = types.slice().sort((x, y) => parseFloat(String(y[1].fontSize)) - parseFloat(String(x[1].fontSize)))[0]?.[0];
  const buttonType = tokens.typography.button || tokens.typography["button-md"] || tokens.typography["body-sm"] || tokens.typography.body;
  const bpWidths = Array.from(new Set(notes.breakpoints.flatMap((r) => (r[1] || "").match(/\d{3,4}/g) || []).map(Number)))
    .filter((n) => n >= 320 && n <= 2560)
    .sort((x, y) => x - y)
    .slice(0, 6);

  const sections: (Sec | false)[] = [
    colors.length > 0 && {
      kind: "foundations",
      title: T("ds_colors"),
      body: (
        <div className="ds-grid">
          {colors.map(([k, v]) => {
            const n = notes.colors[k];
            return (
              <div key={k} className="ds-swatch">
                <div className="ds-swatch__fill" style={{ background: v }} />
                <div className="ds-swatch__meta">
                  <p className="ds-swatch__name">{k}</p>
                  <p className="ds-mono">{v}</p>
                  {n && <p className="ds-swatch__role">{n.note || n.label}</p>}
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    types.length > 0 && {
      kind: "foundations",
      title: T("ds_type"),
      intro: [notes.typeIntro, T("ds_type_note")].filter(Boolean).join(" "),
      body: (
        <div className="ds-types">
          {types.map(([k, t]) => (
            <div key={k} className="ds-type">
              <div className="ds-type__meta"><span>{k}</span><span className="ds-mono">{sizeLine(t)}</span></div>
              <div className="ds-type__sample" style={typeStyle(t, 56)}>{k === largest ? name : notes.typeSamples[k] || name}</div>
            </div>
          ))}
        </div>
      ),
    },
    buttons.length > 0 && {
      kind: "components",
      title: T("ds_buttons"),
      body: (
        <div className="ds-cards">
          {buttons.map(([k, c]) => {
            const n = notes.components[k];
            const small = !/^button|btn/.test(k);
            const r = val(tokens, c.rounded);
            const style = chrome(tokens, b, c, small ? 12 : 16, {
              background: b.surface,
              color: b.ink,
              borderRadius: r || "8px",
              padding: small ? "4px 10px" : "0 22px",
              height: small ? undefined : 44,
              ...typeStyle(small ? tokens.typography.eyebrow || tokens.typography.caption : buttonType, 16),
            });
            return (
              <div key={k} className="ds-card">
                <span className="ds-label">{k}{r ? ` · ${r}` : ""}</span>
                <span className="ds-btn" style={style}>{n?.label || k}</span>
                {n?.note && <p className="ds-note">{n.note}</p>}
              </div>
            );
          })}
        </div>
      ),
    },
    surfaces.length > 0 && {
      kind: "components",
      title: T("ds_surfaces"),
      body: (
        <div className="ds-cards">
          {surfaces.map(([k, c]) => {
            const n = notes.components[k];
            const { fontSize, fontWeight, lineHeight, letterSpacing, ...style } = chrome(tokens, b, c, 18, { background: b.surface, color: b.ink, borderRadius: val(tokens, "{rounded.lg}") || "12px", padding: 24 });
            void fontSize; void fontWeight; void lineHeight; void letterSpacing;
            return (
              <div key={k} className="ds-surface" style={style}>
                <span className="ds-label ds-label--inherit">{k}</span>
                {n && n.title !== k && <h4 className="ds-surface__title" style={headingStyle(typeOf(tokens, c.typography))}>{n.title}</h4>}
                {n?.note && <p className="ds-surface__note">{n.note}</p>}
              </div>
            );
          })}
        </div>
      ),
    },
    forms.length > 0 && {
      kind: "components",
      title: T("ds_forms"),
      body: (
        <div className="ds-cards">
          {forms.map(([k, c]) => {
            const n = notes.components[k];
            const r = val(tokens, c.rounded);
            const style = chrome(tokens, b, c, 16, { background: b.surface, color: b.ink, borderRadius: r || "6px", padding: "12px 14px" });
            const area = /textarea|message|multi/.test(k);
            return (
              <div key={k} className="ds-card">
                <span className="ds-label">{k}{r ? ` · ${r}` : ""}</span>
                {area ? (
                  <textarea className="ds-input" style={style} rows={3} readOnly placeholder={T("ds_input_text")} aria-label={k} />
                ) : (
                  <input className="ds-input" style={style} readOnly placeholder={T("ds_input_email")} aria-label={k} />
                )}
                {n?.note && <p className="ds-note">{n.note}</p>}
              </div>
            );
          })}
        </div>
      ),
    },
    spacing.length > 0 && {
      kind: "foundations",
      title: T("ds_spacing"),
      intro: notes.spacingNote,
      body: (
        <div className="ds-row">
          {spacing.map(([k, v]) => (
            <div key={k} className="ds-space">
              <div className="ds-space__box" style={{ width: Math.max(16, parseFloat(v) * 2 || 16), background: b.primary }} />
              <div className="ds-mono ds-center">{k}<br />{v}</div>
            </div>
          ))}
        </div>
      ),
    },
    rounded.length > 0 && {
      kind: "foundations",
      title: T("ds_rounded"),
      body: (
        <div className="ds-row">
          {rounded.map(([k, v]) => (
            <div key={k} className="ds-radius">
              <div className="ds-radius__box" style={{ borderRadius: v, borderColor: b.ink }}>{radiusNum(v)}</div>
              <div className="ds-mono ds-center">{k}<br />{v}</div>
              {notes.radiusUse[k] && <p className="ds-note ds-center">{notes.radiusUse[k]}</p>}
            </div>
          ))}
        </div>
      ),
    },
    notes.elevation.length > 0 && {
      kind: "foundations",
      title: T("ds_elevation"),
      body: (
        <div className="ds-cards">
          {notes.elevation.map((r, i) => {
            const treatment = r[1] || "";
            const fillKey = /(surface-\d|canvas-soft|surface-soft)/.exec(treatment)?.[1];
            const style: CSSProperties = {
              background: (fillKey && tokens.colors[fillKey]) || b.surface,
              color: b.ink,
              borderRadius: val(tokens, "{rounded.lg}") || "12px",
              border: /no border/i.test(treatment) ? "1px solid transparent" : `1px solid ${b.hairline}`,
            };
            if (/shadow|stack|elevat|lift/i.test(treatment) && !/no shadow/i.test(treatment)) style.boxShadow = i >= 2 ? "0 16px 40px rgba(0,0,0,.16)" : "0 8px 24px rgba(0,0,0,.10)";
            return (
              <div key={i} className="ds-elev" style={style}>
                <p className="ds-elev__level">{T("ds_level")} {r[0].replace(/,\s*/, " · ")}</p>
                <p className="ds-note">{treatment}</p>
                {r[2] && <p className="ds-note">{r[2]}</p>}
              </div>
            );
          })}
        </div>
      ),
    },
    notes.breakpoints.length > 0 && {
      kind: "responsive",
      title: T("ds_responsive"),
      body: (
        <>
          <div className="ds-tablewrap">
            <table className="ds-table">
              <thead><tr><th>{T("ds_bp_name")}</th><th>{T("ds_bp_width")}</th><th>{T("ds_bp_changes")}</th></tr></thead>
              <tbody>{notes.breakpoints.map((r, i) => <tr key={i}><td>{r[0]}</td><td className="ds-mono">{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
            </table>
          </div>
          {bpWidths.length > 1 && (
            <div className="ds-ladder">
              {bpWidths.map((w) => <div key={w} className="ds-device ds-mono" style={{ width: Math.round(50 + ((w - 320) / (1920 - 320)) * 230) }}>{w}</div>)}
            </div>
          )}
          {(notes.touch || notes.collapse) && (
            <p className="ds-p">
              {notes.touch && <><b>{T("ds_touch")}</b> {notes.touch} </>}
              {notes.collapse && <><b>{T("ds_collapse")}</b> {notes.collapse}</>}
            </p>
          )}
        </>
      ),
    },
  ];
  const live = sections.filter((s): s is Sec => Boolean(s));
  const kindLabel = { foundations: T("ds_k_foundations"), components: T("ds_k_components"), responsive: T("ds_k_responsive") };
  const frame = { background: b.canvas, color: b.ink, "--ds-ink": b.ink, "--ds-muted": b.muted, "--ds-hair": b.hairline, "--ds-surface": b.surface, "--ds-shadow": b.dark ? "0 12px 32px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.08)" } as CSSProperties;

  return (
    <div className="dm">
      <div className="dm-bar">
        <div className="dm-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "preview"} className={"chip" + (tab === "preview" ? " chip--on" : "")} onClick={() => setTab("preview")}>{T("ds_preview")}</button>
          <button role="tab" aria-selected={tab === "md"} className={"chip" + (tab === "md" ? " chip--on" : "")} onClick={() => setTab("md")}>{T("ds_raw")}</button>
        </div>
        <button
          className="btn btn--sm"
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(raw);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            } catch {}
          }}
        >
          {copied ? T("ds_copied") : T("ds_copy")}
        </button>
      </div>
      {tab === "preview" ? (
        <div className="ds" style={frame}>
          {live.map((s, i) => (
            <section key={s.title} className="ds-sec">
              <span className="ds-eyebrow">{String(i + 1).padStart(2, "0")} · {kindLabel[s.kind]}</span>
              <h3 className="ds-h">{s.title}</h3>
              {s.intro && <p className="ds-intro">{s.intro}</p>}
              {s.body}
            </section>
          ))}
        </div>
      ) : (
        <pre className="dm-raw" tabIndex={0}><code>{raw}</code></pre>
      )}
    </div>
  );
}
