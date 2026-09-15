import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentProfile, enabledProviders, signIn } from "@/auth";
import { getT } from "@/lib/lang";
import type { Key } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const T = await getT();
  return { title: T("login") };
}

const LABEL: Record<string, Key> = { google: "login_google", kakao: "login_kakao", naver: "login_naver" };

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const T = await getT();
  const { next } = await searchParams;
  const to = next && next.startsWith("/") ? next : "/";
  if (await currentProfile()) redirect(to);
  return (
    <main className="container">
      <section className="card login">
        <h1 className="h2">{T("login")}</h1>
        <p className="help" style={{ marginTop: 8 }}>{T("login_help")}</p>
        {enabledProviders.length ? (
          enabledProviders.map((id) => (
            <form key={id} action={async () => { "use server"; await signIn(id, { redirectTo: to }); }}>
              <button className="btn btn--lg" type="submit">{LABEL[id] ? T(LABEL[id]) : id}</button>
            </form>
          ))
        ) : (
          <p className="error" style={{ marginTop: 16 }}>{T("login_none")}</p>
        )}
      </section>
    </main>
  );
}
