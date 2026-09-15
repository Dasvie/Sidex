import Link from "next/link";
import { getT } from "@/lib/lang";
import { setLang } from "@/actions/lang";

export async function Footer() {
  const T = await getT();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="logo"><img src="/logo.svg" alt="" width={28} height={28} />Sidex</p>
            <p style={{ marginTop: 12, maxWidth: "40ch" }}>{T("footer_desc")}</p>
          </div>
          <div>
            <h2>{T("footer_browse")}</h2>
            <ul>
              <li><Link href="/">{T("nav_ranking")}</Link></li>
              <li><Link href="/c">{T("nav_categories")}</Link></li>
              <li><Link href="/p/sidex">{T("footer_how")}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{T("footer_join")}</h2>
            <ul>
              <li><Link href="/submit">{T("submit")}</Link></li>
              <li><Link href="/login">{T("login")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__legal">
          <span>© Sidex</span>
          <Link href="/terms">{T("terms")}</Link>
          <Link href="/privacy">{T("privacy")}</Link>
          <form action={setLang} className="lang" aria-label={T("lang_label")}>
            <button type="submit" name="lang" value="ko" className="lang__btn" aria-pressed={T.lang === "ko"} lang="ko">한국어</button>
            <button type="submit" name="lang" value="en" className="lang__btn" aria-pressed={T.lang === "en"} lang="en">English</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
