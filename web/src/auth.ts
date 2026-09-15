import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db, getDb } from "@/db";
import { accounts, profiles, sessions, users, verificationTokens } from "@/db/schema";
import { deriveHandle } from "@/lib/slug";
import { claimSeeded, seededUnclaimed } from "@/lib/claim";

const providers = [
  process.env.AUTH_GOOGLE_ID && Google,
  process.env.AUTH_KAKAO_ID && Kakao,
  process.env.AUTH_NAVER_ID && Naver,
].filter(Boolean) as typeof Google[];

export const enabledProviders = providers.map((p) => p({}).id);

// Config as a function: the adapter checks the database's class, so it gets the concrete
// instance at request time rather than the lazy proxy at import time.
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers,
  // Vercel sits behind a proxy; the host header is the deployment's own.
  trustHost: true,
  // Local dev runs without a secret so the pages render; production must set AUTH_SECRET.
  secret: process.env.AUTH_SECRET || (process.env.NODE_ENV === "production" ? undefined : "sidex-dev-only-secret"),
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  events: {
    // A profile row is the member's public identity. Made once, on the first sign-in,
    // from what the provider already told us. Nobody picks a handle by hand.
    async createUser({ user }) {
      if (!user.id) return;
      const seed = user.email || user.name || user.id;
      let handle = deriveHandle(seed);
      const taken = await db.query.profiles.findFirst({ where: eq(profiles.handle, handle) });
      if (taken) handle = `${handle.slice(0, 24)}_${Math.random().toString(36).slice(2, 6)}`;
      await db.insert(profiles).values({
        id: user.id,
        handle,
        displayName: user.name || handle,
        avatarUrl: user.image || "",
      });
    },
    // The owner's first sign-in takes over the seeded @sidex (products, handle), so the
    // deployment never needs a terminal step. OWNER_EMAIL is set on Vercel; runs until claimed.
    async signIn({ user }) {
      const owner = process.env.OWNER_EMAIL;
      if (!owner || !user.id || !user.email || user.email.toLowerCase() !== owner.toLowerCase()) return;
      if (await seededUnclaimed("sidex", user.id)) await claimSeeded("sidex", user.email);
    },
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
}));

/** Signed-in member's profile, or null. Server-side only. */
/* Development only: every request is signed in as one seeded profile so screens behind login can
   be checked without OAuth keys. Default handle "sidex"; set DEV_USER_HANDLE= (empty) to browse
   signed out. Never active in production builds. */
const DEV_HANDLE = process.env.NODE_ENV === "development" ? (process.env.DEV_USER_HANDLE ?? "sidex") : "";

export async function currentProfile() {
  if (DEV_HANDLE) return (await db.query.profiles.findFirst({ where: eq(profiles.handle, DEV_HANDLE) })) ?? null;
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return (await db.query.profiles.findFirst({ where: eq(profiles.id, id) })) ?? null;
}
export const devLogin = Boolean(DEV_HANDLE);
