"use client";
/* Planning map, drawn as a balanced mind map: the product in the middle, its category spaces
   growing to the left (open by default so several categories read at once), the eight planning
   questions growing to the right. Any number of branches may be open; the map refits itself to
   the stage whenever a branch opens or closes. Curved connectors, pill nodes, a dotted canvas.
   Drag to pan, wheel or buttons to zoom (the wheel is captured so the page stays still). The
   panel underneath reads the selected node: questions, the maker's note (editable by the maker,
   with an optional AI draft read from the site), or a search into Sidex. */
import { useActionState, useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import Link from "next/link";
import { DOMAINS, FLOW, label, slugOf, type Node } from "@/lib/planmap";
import { categoryName } from "@/lib/categories";
import { savePlanNote, votePlanNote, type PlanState } from "@/actions/plan";
import { useT } from "./LangProvider";
import { Icon } from "./Icon";

type Vote = { up: number; down: number; mine: number };
type Props = { productId: number; name: string; categories: string[]; notes: Record<string, string>; isOwner: boolean; ownerName: string; logoUrl: string; aiOn: boolean; votes: Record<string, Vote>; canVote: boolean; loggedIn: boolean; initialNode: string };
type Placed = { id: string; node: Node; depth: number; x: number; y: number; w: number; parent?: Placed; kind: "root" | "flow" | "domain"; isLeaf: boolean };
type Kid = { node: Node; kind: "flow" | "domain"; id: string };

const ROW = [0, 40, 30, 28, 27]; // row pitch per depth
const H = [48, 32, 27, 25, 25]; // pill height per depth
const FONT = [15, 14, 13, 12.5, 12.5];
const GAP = [0, 64, 46, 40, 36]; // horizontal gap before a column
const STAGE_W = 760, STAGE_H = 560;

function textWidth(text: string, size: number) {
  let w = 0;
  for (const ch of text) w += /[ᄀ-ᇿ㄰-㆏가-힯　-鿿]/.test(ch) ? size * 0.96 : size * 0.56;
  return w;
}

/* Balanced map: category spaces grow to the left, the eight questions to the right. Any number
   of branches may be open at once; a subtree takes as much height as its open children need. */
function layout(name: string, cats: string[], open: Set<string>, titleOf: (id: string, node: Node, depth: number) => string): Placed[] {
  const out: Placed[] = [];
  const rootW = textWidth(name, FONT[0]) + 72;
  const root: Placed = { id: "root", node: { ko: name, en: name }, depth: 0, x: 0, y: 0, w: rootW, kind: "root", isLeaf: false };
  out.push(root);
  type Tree = { kid: Kid; depth: number; w: number; h: number; children: Tree[] };
  const build = (kid: Kid, depth: number): Tree => {
    const text = titleOf(kid.id, kid.node, depth);
    const w = textWidth(text, FONT[Math.min(depth, FONT.length - 1)]) + (depth === 1 ? 30 : 24);
    const children = open.has(kid.id) && kid.node.children ? kid.node.children.map((c) => build({ node: c, kind: kid.kind, id: `${kid.id}/${slugOf(c)}` }, depth + 1)) : [];
    const own = ROW[Math.min(depth, ROW.length - 1)];
    const h = children.length ? Math.max(own, children.reduce((s, c) => s + c.h, 0)) : own;
    return { kid, depth, w, h, children };
  };
  const place = (t: Tree, parent: Placed, dir: 1 | -1, y: number) => {
    const gap = GAP[Math.min(t.depth, GAP.length - 1)];
    const x = parent.x + dir * (parent.w / 2 + gap + t.w / 2);
    const p: Placed = { id: t.kid.id, node: t.kid.node, depth: t.depth, x, y, w: t.w, parent, kind: t.kid.kind, isLeaf: !t.kid.node.children?.length };
    out.push(p);
    let cy = y - t.h / 2;
    for (const c of t.children) { place(c, p, dir, cy + c.h / 2); cy += c.h; }
  };
  const side = (kids: Kid[], dir: 1 | -1) => {
    const trees = kids.map((k) => build(k, 1));
    const total = trees.reduce((s, t) => s + t.h, 0);
    let cy = -total / 2;
    for (const t of trees) { place(t, root, dir, cy + t.h / 2); cy += t.h; }
  };
  side(FLOW.map((node) => ({ node, kind: "flow" as const, id: `f/${slugOf(node)}` })), 1);
  side(cats.map((c) => ({ node: { ko: c, en: c, children: DOMAINS[c] } as Node, kind: "domain" as const, id: `d:${c}` })), -1);
  return out;
}

function NoteForm({ productId, nodeId, initial, aiOn }: { productId: number; nodeId: string; initial: string; aiOn: boolean }) {
  const T = useT();
  const [state, action, pending] = useActionState<PlanState, FormData>(savePlanNote, {});
  const [body, setBody] = useState(initial);
  const [draft, setDraft] = useState<"idle" | "busy" | "done" | "fail">("idle");
  async function suggest() {
    setDraft("busy");
    try {
      const res = await fetch("/api/plan-draft", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId, nodeId }) });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { text: string };
      setBody(data.text);
      setDraft("done");
    } catch {
      setDraft("fail");
    }
  }
  return (
    <form action={action} className="plan__note form" data-pending={pending || undefined}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="nodeId" value={nodeId} />
      <div className="plan__note-head">
        <label className="plan__label" htmlFor={`note-${nodeId}`}>{T("plan_note_write")}</label>
        {aiOn && <button type="button" className="btn btn--ghost btn--sm" onClick={suggest} disabled={draft === "busy"} aria-busy={draft === "busy"}>{draft === "busy" && <i className="spin" aria-hidden="true" />}{draft === "busy" ? T("plan_draft_busy") : T("plan_draft")}</button>}
      </div>
      <textarea id={`note-${nodeId}`} className="textarea" name="body" rows={3} maxLength={2000} value={body} onChange={(e) => setBody(e.target.value)} placeholder={T("plan_note_ph")} />
      {draft === "done" && <p className="help">{T("plan_draft_note")}</p>}
      {draft === "fail" && <p className="error">{T("plan_draft_fail")}</p>}
      <div className="plan__note-foot">
        {state.error && <span className="error">{state.error}</span>}
        {state.ok && state.nodeId === nodeId && <span className="flash" role="status">{T("saved")}</span>}
        <button type="submit" className="btn btn--solid btn--sm" disabled={pending} aria-busy={pending}>{pending && <i className="spin" aria-hidden="true" />}{T("plan_note_save")}</button>
      </div>
    </form>
  );
}

function VoteBar({ productId, nodeId, vote, canVote, loggedIn, isOwner }: { productId: number; nodeId: string; vote: Vote; canVote: boolean; loggedIn: boolean; isOwner: boolean }) {
  const T = useT();
  const [state, action, pending] = useActionState<PlanState, FormData>(votePlanNote, {});
  const btn = (value: 1 | -1, label: string, n: number) => (
    <form action={action} style={{ display: "contents" }}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="nodeId" value={nodeId} />
      <input type="hidden" name="value" value={value} />
      <button type="submit" className="vote__btn" aria-pressed={vote.mine === value} disabled={!canVote || pending}>{label} <b>{n}</b></button>
    </form>
  );
  return (
    <div className="vote" aria-live="polite">
      {btn(1, T("plan_agree"), vote.up)}
      {btn(-1, T("plan_disagree"), vote.down)}
      {!canVote && <span className="help">{isOwner ? T("plan_vote_own") : loggedIn ? "" : T("plan_vote_login")}</span>}
      {state.error && <span className="error">{state.error}</span>}
    </div>
  );
}

export function PlanMap({ productId, name, categories, notes, isOwner, ownerName, logoUrl, aiOn, votes, canVote, loggedIn, initialNode }: Props) {
  const T = useT();
  const L = T.lang;
  const [open, setOpen] = useState<Set<string>>(() => {
    const s = new Set(categories.filter((x) => DOMAINS[x]).map((c) => `d:${c}`));
    // a shared link opens the path to its node
    const parts = initialNode.split("/");
    if (parts.length > 1) for (let i = 1; i < parts.length; i++) s.add(parts.slice(0, i).join("/"));
    return s;
  });
  const [selected, setSelected] = useState<string | null>(initialNode || null);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // React's onWheel is passive; a native non-passive listener is the only way to keep the page still
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setView((v) => ({ ...v, k: Math.min(2.2, Math.max(0.55, v.k * (e.deltaY < 0 ? 1.1 : 0.9))) }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const cats = useMemo(() => {
    const c = categories.filter((x) => DOMAINS[x]);
    return c.length ? c : ["etc"];
  }, [categories]);
  const titleOf = (id: string, node: Node, depth: number) => (depth === 0 ? name : id.startsWith("d:") && depth === 1 ? T("plan_domain", { c: categoryName(id.slice(2), L) }) : label(node, L));
  const placed = useMemo(() => layout(name, cats, open, titleOf), [name, cats, open, L]); // eslint-disable-line react-hooks/exhaustive-deps
  const byId = useMemo(() => Object.fromEntries(placed.map((p) => [p.id, p])), [placed]);
  const sel = selected ? byId[selected] : undefined;
  const hasNoteBelow = (id: string) => Object.keys(notes).some((k) => k === id || k.startsWith(id + "/"));

  // the lit neighbourhood: the hovered (or selected) node, its ancestors and its children
  const focus = hover ? byId[hover] : sel;
  const lit = useMemo(() => {
    if (!focus) return null;
    const s = new Set<string>();
    for (const p of trail(focus)) s.add(p.id);
    for (const p of placed) if (p.parent?.id === focus.id) s.add(p.id);
    return s;
  }, [focus, placed]);

  // fit the whole map into the stage whenever a branch opens or closes
  const bbox = useMemo(() => {
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    for (const p of placed) { const h = H[Math.min(p.depth, H.length - 1)]; x0 = Math.min(x0, p.x - p.w / 2); x1 = Math.max(x1, p.x + p.w / 2); y0 = Math.min(y0, p.y - h / 2); y1 = Math.max(y1, p.y + h / 2); }
    return { x0, x1, y0, y1 };
  }, [placed]);
  useEffect(() => {
    const pad = 48;
    const k = Math.min(1.15, (STAGE_W - pad * 2) / (bbox.x1 - bbox.x0), (STAGE_H - pad * 2) / (bbox.y1 - bbox.y0));
    setView({ k, x: -((bbox.x0 + bbox.x1) / 2) * k, y: -((bbox.y0 + bbox.y1) / 2) * k });
  }, [bbox]);

  function toggle(p: Placed) {
    setSelected(p.id);
    if (p.isLeaf || p.depth === 0) return;
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(p.id)) { for (const id of s) if (id === p.id || id.startsWith(p.id + "/")) next.delete(id); }
      else next.add(p.id);
      return next;
    });
  }
  function openTo(id: string) {
    const parts = id.split("/");
    setOpen((s) => {
      const next = new Set(s);
      for (let i = 1; i < parts.length; i++) next.add(parts.slice(0, i).join("/"));
      return next;
    });
    setSelected(id);
  }
  function reset() { setOpen(new Set(cats.map((c) => `d:${c}`))); setSelected(null); }
  function zoom(f: number) { setView((v) => ({ ...v, k: Math.min(2.2, Math.max(0.55, v.k * f)) })); }

  const onDown = (e: RPointerEvent<SVGSVGElement>) => { drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false }; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
    setView((v) => ({ ...v, x: drag.current!.vx + dx, y: drag.current!.vy + dy }));
  };
  const onUp = () => { setTimeout(() => { drag.current = null; }, 0); };

  const title = (p: Placed) => titleOf(p.id, p.node, p.depth);
  const questions = sel ? sel.node.q ?? [] : [];
  const tags = sel ? sel.node.tags ?? (sel.kind === "flow" ? FLOW.find((f) => sel.id.startsWith(`f/${slugOf(f)}`))?.tags : undefined) : undefined;
  const topicId = sel && sel.kind === "domain" && sel.depth >= 2 ? sel.id.slice(2).split("/").slice(0, 2).join("/") : "";

  return (
    <div className="plan">
      <div className={"plan__stage" + (lit ? " is-focus" : "")}>
        <svg ref={svgRef} className="plan__svg" viewBox={`${-STAGE_W / 2} ${-STAGE_H / 2} ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="xMidYMid meet" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} role="group" aria-label={T("plan_title")}>
          <defs>
            <pattern id="plan-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" className="plan__grid" /></pattern>
            <clipPath id="plan-logo"><circle r={15} /></clipPath>
          </defs>
          <rect x="-4000" y="-4000" width="8000" height="8000" fill="url(#plan-dots)" />
          <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            {placed.filter((p) => p.parent).map((p) => {
              const a = p.parent!;
              const dir = p.x >= a.x ? 1 : -1;
              const x1 = a.x + dir * (a.w / 2), y1 = a.y, x2 = p.x - dir * (p.w / 2), y2 = p.y;
              const c = (x2 - x1) * 0.5;
              const dim = lit ? !(lit.has(p.id) && lit.has(a.id)) : false;
              const on = sel && (sel.id === p.id || sel.id.startsWith(p.id + "/"));
              return <path key={"e" + p.id} className={"plan__edge" + (on ? " is-on" : "") + (dim ? " is-dim" : "") + (p.kind === "domain" ? " plan__edge--domain" : "")} d={`M${x1} ${y1} C${x1 + c} ${y1} ${x2 - c} ${y2} ${x2} ${y2}`} />;
            })}
            {placed.map((p) => {
              const text = title(p);
              const h = H[Math.min(p.depth, H.length - 1)];
              const isOpen = open.has(p.id);
              const noted = p.depth > 0 && hasNoteBelow(p.id);
              const dim = lit ? !lit.has(p.id) : false;
              const cls = ["plan__node", `plan__node--${p.kind}`, `plan__node--d${p.depth}`, isOpen ? "is-open" : "", sel?.id === p.id ? "is-sel" : "", p.isLeaf ? "is-leaf" : "", noted ? "has-note" : "", dim ? "is-dim" : ""].join(" ");
              return (
                <g key={p.id} className={cls} style={{ transform: `translate(${p.x}px, ${p.y}px)` }} role="button" tabIndex={0} aria-expanded={p.isLeaf ? undefined : isOpen} aria-label={text}
                  onClick={() => { if (!drag.current?.moved) toggle(p); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(p); } }}
                  onPointerEnter={() => setHover(p.id)} onPointerLeave={() => setHover(null)}>
                  <rect className="plan__pill" x={-p.w / 2} y={-h / 2} width={p.w} height={h} rx={h / 2} />
                  {p.depth === 0 && (
                    <g transform={`translate(${-p.w / 2 + 26} 0)`}>
                      <circle r={16} className="plan__logo-bg" />
                      {logoUrl && <image href={logoUrl} x={-15} y={-15} width={30} height={30} clipPath="url(#plan-logo)" preserveAspectRatio="xMidYMid slice" />}
                    </g>
                  )}
                  <text className="plan__text" x={p.depth === 0 ? 14 : 0} textAnchor="middle" dominantBaseline="central" fontSize={FONT[Math.min(p.depth, FONT.length - 1)]}>{text}</text>
                  {!p.isLeaf && p.depth > 0 && <circle className="plan__more" cx={(p.kind === "domain" ? -1 : 1) * (p.w / 2)} cy={0} r={3} />}
                  {noted && <circle className="plan__mark" cx={p.w / 2 - 4} cy={-h / 2 + 3} r={3.5} />}
                </g>
              );
            })}
          </g>
        </svg>
        <div className="plan__tools">
          <button type="button" className="btn btn--sm" onClick={() => zoom(1.2)} aria-label={T("plan_zoom_in")}>+</button>
          <button type="button" className="btn btn--sm" onClick={() => zoom(0.85)} aria-label={T("plan_zoom_out")}>−</button>
          <button type="button" className="btn btn--sm" onClick={reset}>{T("plan_reset")}</button>
        </div>
        <p className="plan__hint help">{T("plan_hint")}</p>
      </div>

      <aside className="plan__panel" aria-live="polite">
        {!sel ? (
          <>
            <p className="plan__panel-title">{T("plan_panel_empty_title")}</p>
            <p className="help">{T("plan_panel_empty")}</p>
            <ul className="plan__legend">
              <li><i className="plan__swatch plan__swatch--flow" />{T("plan_legend_flow")}</li>
              <li><i className="plan__swatch plan__swatch--domain" />{T("plan_legend_domain")}</li>
              <li><i className="plan__swatch plan__swatch--note" />{T("plan_legend_note")}</li>
            </ul>
            {Object.keys(notes).length > 0 && (
              <>
                <p className="plan__label">{T("plan_notes_of", { name: ownerName || name })}</p>
                <div className="plan__chips">{Object.keys(notes).map((id) => <button key={id} type="button" className="chip" onClick={() => openTo(id)}>{id.split("/").pop()!.replace(/-/g, " ")}</button>)}</div>
              </>
            )}
          </>
        ) : (
          <>
            <p className="plan__crumb help">{[...trail(sel)].map((p) => title(p)).join(" › ")}</p>
            <p className="plan__panel-title">{title(sel)}</p>
            {questions.length > 0 && (
              <>
                <p className="plan__label">{T("plan_questions", { name })}</p>
                <ol className="plan__qs">{questions.map(([ko, en], i) => <li key={i}>{L === "en" ? en : ko}</li>)}</ol>
              </>
            )}
            {sel.node.children && sel.depth > 0 && (
              <>
                <p className="plan__label">{T("plan_children")}</p>
                <div className="plan__chips">{sel.node.children.map((c) => {
                  const id = `${sel.id}/${slugOf(c)}`;
                  return <button key={id} type="button" className={"chip" + (hasNoteBelow(id) ? " chip--noted" : "")} onClick={() => openTo(id)}>{label(c, L)}</button>;
                })}</div>
              </>
            )}
            {sel.depth > 0 && (notes[sel.id] || isOwner) && (
              <div className="plan__notebox">
                {notes[sel.id] && !isOwner && <><p className="plan__label">{T("plan_note_label", { name: ownerName || name })}</p><p className="plan__note-body">{notes[sel.id]}</p></>}
                {isOwner && <NoteForm key={sel.id} productId={productId} nodeId={sel.id} initial={notes[sel.id] || ""} aiOn={aiOn} />}
                {notes[sel.id] && <VoteBar key={"v" + sel.id} productId={productId} nodeId={sel.id} vote={votes[sel.id] ?? { up: 0, down: 0, mine: 0 }} canVote={canVote} loggedIn={loggedIn} isOwner={isOwner} />}
              </div>
            )}
            {tags && sel.kind === "flow" && (
              <>
                <p className="plan__label">{T("plan_frameworks")}</p>
                <div className="plan__chips">{tags.map((t) => <span key={t} className="pill">{t}</span>)}</div>
              </>
            )}
            {topicId && (
              <Link className="btn btn--sm plan__search" href={sel.depth >= 3 ? `/search?topic=${encodeURIComponent(topicId)}&q=${encodeURIComponent(label(sel.node, "ko"))}` : `/t/${topicId}`}>{sel.depth >= 3 ? T("plan_search", { q: label(sel.node, L) }) : T("plan_hub", { q: label(sel.node, L) })}<Icon name="arrowRight" size={14} /></Link>
            )}
            {sel.depth === 0 && <p className="help">{T("plan_root_hint")}</p>}
          </>
        )}
      </aside>
    </div>
  );
}

function* trail(p: Placed): Generator<Placed> {
  if (p.parent) yield* trail(p.parent);
  yield p;
}
