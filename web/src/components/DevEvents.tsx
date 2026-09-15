/* Home sidebar card: developer events happening now, read from the public Dev-Event repository,
   with a button to the full list. Renders only the button when nothing could be read. */
import { DEV_EVENT_URL, devEvents } from "@/lib/devevent";
import { getT } from "@/lib/lang";
import { Icon } from "./Icon";

export async function DevEvents() {
  const T = await getT();
  const events = await devEvents();
  return (
    <section className="events">
      <h2 className="eyebrow">{T("events_title")}</h2>
      {events.length > 0 && (
        <ul className="events__list">
          {events.slice(0, 4).map((e) => (
            <li key={e.url}>
              <a href={e.url} target="_blank" rel="noopener">
                <span className="events__name">{e.title.replace(/^\[[^\]]*\]\s*/, "")}</span>
                <span className="events__meta">{[e.host, e.when].filter(Boolean).join(" · ")}</span>
              </a>
              {e.tags.length > 0 && <span className="events__tags">{e.tags.slice(0, 3).map((t) => <i key={t}>{t}</i>)}</span>}
            </li>
          ))}
        </ul>
      )}
      <a className="btn btn--sm events__more" href={DEV_EVENT_URL} target="_blank" rel="noopener">{T("events_more")}<Icon name="external" size={14} /></a>
    </section>
  );
}
