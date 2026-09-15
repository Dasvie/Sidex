"use client";
/* Two-step delete for one of the maker's own products: the second step names what goes with it. */
import { useActionState, useState } from "react";
import { deleteProduct, type DeleteState } from "@/actions/product";
import { useT } from "./LangProvider";

export function DeleteProduct({ id, name }: { id: number; name: string }) {
  const T = useT();
  const [armed, setArmed] = useState(false);
  const [state, action, pending] = useActionState<DeleteState, FormData>(deleteProduct, {});
  if (!armed) return <button type="button" className="btn btn--ghost btn--sm" onClick={() => setArmed(true)}>{T("del_btn")}</button>;
  return (
    <form action={action} className="del" data-pending={pending || undefined}>
      <input type="hidden" name="productId" value={id} />
      <p className="help">{T("del_confirm", { name })}</p>
      <div className="del__row">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setArmed(false)} disabled={pending}>{T("cancel")}</button>
        <button type="submit" className="btn btn--sm del__yes" disabled={pending} aria-busy={pending}>{pending && <i className="spin" aria-hidden="true" />}{T("del_yes")}</button>
      </div>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
