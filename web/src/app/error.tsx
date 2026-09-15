"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useT } from "@/components/LangProvider";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const T = useT();
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="container">
      <section className="hero">
        <h1 className="h1">{T("err_title")}</h1>
        <p className="lead">{T("err_body")}</p>
        {error.digest && <p style={{ fontSize: 12, color: "var(--fg-faint)", marginTop: 8 }}>{error.digest}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button type="button" className="btn btn--solid" onClick={reset}>{T("err_retry")}</button>
          <Link className="btn" href="/">{T("nf_back")}</Link>
        </div>
      </section>
    </main>
  );
}
