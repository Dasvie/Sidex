"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { addComment, pinComment, type CommentState } from "@/actions/comment";
import { fromNow } from "@/lib/format";
import { Avatar } from "./Avatar";
import { useT } from "./LangProvider";

type Author = { handle: string; displayName: string; avatarUrl: string } | null;
type Item = { id: number; body: string; pinned: boolean; createdAt: string; authorId: string; author: Author; replies?: Item[] };
type Me = { id: string; handle: string; displayName: string; avatarUrl: string } | null;

function Composer({ productId, parentId, me, placeholder, onDone }: { productId: number; parentId?: number; me: Me; placeholder: string; onDone?: () => void }) {
  const T = useT();
  const [state, action, pending] = useActionState(async (prev: CommentState, fd: FormData) => {
    const r = await addComment(prev, fd);
    if (r.ok) onDone?.();
    return r;
  }, {});
  if (!me) return <p className="help">{T("comment_login_a")}<Link href="/login" style={{ textDecoration: "underline" }}>{T("comment_login_b")}</Link>{T("comment_login_c")}</p>;
  return (
    <form action={action} className="field" key={state.ok ? Date.now() : "form"}>
      <input type="hidden" name="productId" value={productId} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <label className="visually-hidden" htmlFor={`c-${parentId ?? "top"}`}>{placeholder}</label>
      <textarea className="textarea" id={`c-${parentId ?? "top"}`} name="body" rows={parentId ? 2 : 3} maxLength={2000} placeholder={placeholder} required />
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
        {state.error && <span className="error" style={{ marginRight: "auto" }}>{state.error}</span>}
        {onDone && <button className="btn btn--ghost btn--sm" type="button" onClick={onDone}>{T("cancel")}</button>}
        <button className="btn btn--solid btn--sm" type="submit" disabled={pending} aria-busy={pending}>{pending && <i className="spin" aria-hidden="true" />}{parentId ? T("post_reply") : T("post_comment")}</button>
      </div>
    </form>
  );
}

function Line({ c, ownerId, reply, me, isOwner, productId }: { c: Item; ownerId: string | null; reply?: boolean; me: Me; isOwner: boolean; productId: number }) {
  const T = useT();
  const [open, setOpen] = useState(false);
  const maker = c.authorId === ownerId;
  return (
    <>
      <div className={"comment" + (reply ? " comment--reply" : "")}>
        <Avatar profile={c.author} />
        <div>
          <div className="comment__who">
            {c.author ? <Link href={`/u/${c.author.handle}`}>{c.author.displayName}</Link> : T("left_member")}
            {maker && <span className="maker">{T("maker")}</span>}
            {c.pinned && <span className="meta" style={{ marginLeft: 8 }}>{T("pinned")}</span>}
          </div>
          <p className="comment__body">{c.body}</p>
          <div className="comment__act">
            <span>{fromNow(c.createdAt, T.lang)}</span>
            {!reply && me && <button type="button" onClick={() => setOpen((v) => !v)}>{T("reply")}</button>}
            {!reply && isOwner && <button type="button" onClick={() => pinComment(c.id)}>{c.pinned ? T("unpin") : T("pin")}</button>}
          </div>
        </div>
      </div>
      {open && <div className="replybox"><Composer productId={productId} parentId={c.id} me={me} placeholder={T("reply_placeholder")} onDone={() => setOpen(false)} /></div>}
    </>
  );
}

export function CommentThread({ productId, ownerId, me, items }: { productId: number; ownerId: string | null; me: Me; items: Item[] }) {
  const T = useT();
  const isOwner = !!me && me.id === ownerId;
  return (
    <div>
      <Composer productId={productId} me={me} placeholder={T("comment_placeholder")} />
      <div style={{ marginTop: 8 }}>
        {items.length === 0 && <p className="help" style={{ padding: "16px 0" }}>{T("no_comments")}</p>}
        {items.map((c) => (
          <div key={c.id}>
            <Line c={c} ownerId={ownerId} me={me} isOwner={isOwner} productId={productId} />
            {c.replies?.map((r) => <Line key={r.id} c={r} ownerId={ownerId} reply me={me} isOwner={isOwner} productId={productId} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
