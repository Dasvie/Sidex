/* Developer events from the public Dev-Event repository (brave-people/Dev-Event on GitHub), the
   data behind dev-event.vercel.app. The README lists events under month headings; this reads the
   current and next month and keeps entries whose registration or date has not passed.
   Cached for an hour; on any failure the caller gets an empty list and shows just the link. */
import { unstable_cache } from "next/cache";

export type DevEvent = { title: string; url: string; host: string; when: string; tags: string[] };
export const DEV_EVENT_URL = "https://dev-event.vercel.app/events";
const README = "https://raw.githubusercontent.com/brave-people/Dev-Event/master/README.md";

function parse(md: string, now: Date): DevEvent[] {
  const out: DevEvent[] = [];
  const yy = now.getFullYear() % 100;
  const months = [now.getMonth() + 1, ((now.getMonth() + 1) % 12) + 1];
  const wanted = new Set(months.map((m) => `${yy}년 ${String(m).padStart(2, "0")}월`));
  let inMonth = false;
  let cur: DevEvent | null = null;
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    const h = /^##\s+`?(\d{2}년 \d{2}월)`?/.exec(line);
    if (h) { inMonth = wanted.has(h[1]); cur = null; continue; }
    if (!inMonth) continue;
    const item = /^- __\[(.+?)\]\((https?:[^)]+)\)__/.exec(line);
    if (item) { cur = { title: item[1].trim(), url: item[2], host: "", when: "", tags: [] }; out.push(cur); continue; }
    if (!cur) continue;
    const sub = /^\s+- (분류|주최|접수|일시|일정):\s*(.+)$/.exec(line);
    if (!sub) continue;
    const v = sub[2].trim();
    if (sub[1] === "분류") cur.tags = [...v.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    else if (sub[1] === "주최") cur.host = v;
    else if (!cur.when) cur.when = v.replace(/\s+/g, " ");
  }
  // drop entries whose last listed date is already behind us
  return out.filter((e) => {
    const dates = [...e.when.matchAll(/(\d{2})\.\s?(\d{2})/g)].map((m) => new Date(now.getFullYear(), Number(m[1]) - 1, Number(m[2])));
    if (!dates.length) return true;
    const last = dates[dates.length - 1];
    return last.getTime() >= new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  });
}

async function fetchEvents(): Promise<DevEvent[]> {
  try {
    const res = await fetch(README, { headers: { "user-agent": "Sidex (dev events card)" } });
    if (!res.ok) return [];
    return parse(await res.text(), new Date()).slice(0, 12);
  } catch {
    return [];
  }
}

export const devEvents = unstable_cache(fetchEvents, ["dev-events"], { revalidate: 3600, tags: ["dev-events"] });
export { parse as parseDevEvents };
