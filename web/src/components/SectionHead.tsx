/* Section header: small pill label, a light large title, an optional link on the right. */
import Link from "next/link";
import { Icon } from "./Icon";

export function SectionHead({ pill, title, href, link }: { pill?: string; title: string; href?: string; link?: string }) {
  return (
    <div className="shead">
      <div>
        {pill && <span className="pill">{pill}</span>}
        <h2 className="shead__title">{title}</h2>
      </div>
      {href && link && <Link className="shead__link" href={href}>{link}<Icon name="arrowRight" size={14} /></Link>}
    </div>
  );
}
