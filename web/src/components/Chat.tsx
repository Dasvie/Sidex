"use client";
/* Floating assistant, bottom right on every page. Talks to /api/chat; nothing is stored.
   Paths in an answer (/p/notion, /c/design) become links. */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "./LangProvider";
import { Icon } from "./Icon";

type Msg = { role: "user" | "assistant"; content: string };

function Linked({ text }: { text: string }) {
  const parts = text.split(/(\/(?:p|c|u)\/[\w-]+|\/(?:submit|search|login)\b|https?:\/\/\S+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\//.test(p) ? (
          <Link key={i} href={p}>{p}</Link>
        ) : /^https?:/.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener">{p.replace(/^https?:\/\//, "")}</a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function Chat() {
  const T = useT();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, busy]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      // keep Tab inside the panel while it is open
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input, a[href], textarea")];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setDraft("");
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, lang: T.lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { text: string };
      setMsgs([...next, { role: "assistant", content: data.text }]);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const starters = [T("chat_q1"), T("chat_q2"), T("chat_q3")];

  return (
    <div className="chat">
      {open && (
        <section className="chat__panel" role="dialog" aria-modal="true" aria-label={T("chat_title")} ref={panelRef}>
          <header className="chat__head">
            <div>
              <strong>{T("chat_title")}</strong>
              <span className="help">{T("chat_hint")}</span>
            </div>
            <button type="button" className="chat__close" onClick={() => setOpen(false)} aria-label={T("chat_close")}><Icon name="close" size={18} /></button>
          </header>
          <div className="chat__list" ref={listRef}>
            {msgs.length === 0 && (
              <div className="chat__starters">
                {starters.map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={"chat__msg chat__msg--" + m.role}><Linked text={m.content} /></div>
            ))}
            {busy && <div className="chat__msg chat__msg--assistant chat__msg--busy" aria-live="polite"><span /><span /><span /></div>}
            {error && <p className="chat__error">{T("chat_error")}</p>}
          </div>
          <form
            className="chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input ref={inputRef} className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={T("chat_placeholder")} maxLength={2000} aria-label={T("chat_placeholder")} />
            <button type="submit" className="btn btn--solid" disabled={busy || !draft.trim()}>{T("chat_send")}</button>
          </form>
        </section>
      )}
      <button type="button" className="chat__fab" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={T("chat_open")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4.2 3.4c-.4.3-.8 0-.8-.5V5.5Z" />
        </svg>
      </button>
    </div>
  );
}
