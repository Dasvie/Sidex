import Link from "next/link";
import { getT } from "@/lib/lang";

export default async function NotFound() {
  const T = await getT();
  return (
    <main className="container">
      <div className="notfound">
        <p className="eyebrow">404</p>
        <h1 className="h1">{T("nf_title")}</h1>
        <p>{T("nf_body")}</p>
        <Link className="btn btn--solid" href="/">{T("nf_back")}</Link>
      </div>
    </main>
  );
}
