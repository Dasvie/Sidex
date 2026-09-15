/* Wraps every case-insensitive match of `q` in <mark>. Plain text in, nodes out. */
export function highlight(text: string, q?: string) {
  if (!q) return text;
  const needle = q.trim().toLowerCase();
  if (!needle) return text;
  const out: React.ReactNode[] = [];
  let i = 0;
  const lower = text.toLowerCase();
  let at = lower.indexOf(needle);
  while (at >= 0) {
    if (at > i) out.push(text.slice(i, at));
    out.push(<mark key={at}>{text.slice(at, at + needle.length)}</mark>);
    i = at + needle.length;
    at = lower.indexOf(needle, i);
  }
  if (i < text.length) out.push(text.slice(i));
  return out;
}
