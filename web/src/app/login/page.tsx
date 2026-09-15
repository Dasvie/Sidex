import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentProfile, enabledProviders, signIn } from "@/auth";
import { getT } from "@/lib/lang";
import type { Key } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const T = await getT();
  return { title: T("login") };
}

const LABEL: Record<string, Key> = { google: "login_google", kakao: "login_kakao", naver: "login_naver" };
const ORDER = ["kakao", "naver", "google"];
const LAST_COOKIE = "sidex-last-login";

const ICON: Record<string, React.ReactNode> = {
  kakao: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#191919" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.2 4.6 6.6L5.5 21.5c-.1.3.2.5.5.4l4.7-3.1c.4 0 .9.1 1.3.1 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
    </svg>
  ),
  naver: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#fff" d="M4 3h5.3l5.4 8V3H20v18h-5.3l-5.4-8v8H4z" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3c-.5-1.5-.5-3.1 0-4.6V6.6H1.2c-1.6 3.3-1.6 7.2 0 10.8l4.1-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.1 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  ),
};

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const T = await getT();
  const { next } = await searchParams;
  const to = next && next.startsWith("/") ? next : "/";
  if (await currentProfile()) redirect(to);
  const last = (await cookies()).get(LAST_COOKIE)?.value;
  const ids = ORDER.filter((id) => enabledProviders.includes(id)).concat(enabledProviders.filter((id) => !ORDER.includes(id)));
  return (
    <main className="container">
      <section className="login">
        <h1 className="h2">{T("login")}</h1>
        <p className="help" style={{ marginTop: 8 }}>{T("login_help")}</p>
        {ids.length ? (
          <div className="login__list">
            {ids.map((id) => (
              <form
                key={id}
                action={async () => {
                  "use server";
                  (await cookies()).set(LAST_COOKIE, id, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
                  await signIn(id, { redirectTo: to });
                }}
              >
                <button className={`login__btn login__btn--${id}`} type="submit">
                  <span className="login__icon">{ICON[id]}</span>
                  <span className="login__label">{LABEL[id] ? T(LABEL[id]) : id}</span>
                  {last === id && <span className="login__recent">{T("login_recent")}</span>}
                </button>
              </form>
            ))}
          </div>
        ) : (
          <p className="error" style={{ marginTop: 16 }}>{T("login_none")}</p>
        )}
      </section>
    </main>
  );
}
