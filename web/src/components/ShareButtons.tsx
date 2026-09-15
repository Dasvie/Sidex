"use client";
import { useState } from "react";
import { useT } from "./LangProvider";
import { Icon } from "./Icon";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const T = useT();
  const [copied, setCopied] = useState(false);
  const href = url;
  const enc = encodeURIComponent(href);
  const text = encodeURIComponent(title);
  return (
    <div className="share">
      <button
        className="btn"
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {}
        }}
      >
        <Icon name={copied ? "check" : "link"} />{copied ? T("copied") : T("copy_link")}
      </button>
      <a className="btn" href={`https://x.com/intent/post?text=${text}&url=${enc}`} target="_blank" rel="noopener"><Icon name="x" size={14} />X</a>
      <a className="btn" href={`https://www.threads.net/intent/post?text=${text}%20${enc}`} target="_blank" rel="noopener"><Icon name="threads" size={15} />Threads</a>
    </div>
  );
}
