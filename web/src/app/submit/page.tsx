import type { Metadata } from "next";
import { currentProfile } from "@/auth";
import { getT } from "@/lib/lang";
import { SubmitForm } from "@/components/SubmitForm";
import { uploadsEnabled } from "@/lib/upload";

export async function generateMetadata(): Promise<Metadata> {
  const T = await getT();
  return { title: T("submit") };
}
export const dynamic = "force-dynamic";

export default async function Submit() {
  const T = await getT();
  const me = await currentProfile();
  return (
    <main className="container">
      <section className="hero">
        <h1 className="h1">{T("submit_title")}</h1>
        <p className="lead">{T("submit_lead")}</p>
      </section>
      <SubmitForm uploads={uploadsEnabled()} loggedIn={!!me} myName={me?.displayName ?? ""} />
    </main>
  );
}
