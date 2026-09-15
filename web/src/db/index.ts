/* One `db` for both worlds.
   - DATABASE_URL set (Vercel / Neon): serverless HTTP driver.
   - Not set (local dev, CI): PGlite writes to ./.pglite so the app runs with no Postgres installed.
   Both go through the same drizzle schema, so queries never branch. */
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

// One nominal type for both drivers, so query builders (returning, transactions) type-check the same way.
type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

function makeNeon(url: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { neon } = require("@neondatabase/serverless") as typeof import("@neondatabase/serverless");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/neon-http") as typeof import("drizzle-orm/neon-http");
  return drizzle(neon(url), { schema }) as unknown as Db;
}

function makePglite() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PGlite } = require("@electric-sql/pglite") as typeof import("@electric-sql/pglite");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/pglite") as typeof import("drizzle-orm/pglite");
  const client = new PGlite(process.env.PGLITE_DIR || "./.pglite");
  return drizzle(client, { schema }) as unknown as Db;
}

/* Vercel's Neon integration names the pooled string by its chosen prefix (DATABASE_POSTGRES_URL,
   POSTGRES_URL); a hand-set DATABASE_URL still wins. */
export const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL || process.env.POSTGRES_URL || "";

const globalForDb = globalThis as unknown as { __sidexDb?: Db };

function real(): Db {
  if (!globalForDb.__sidexDb) {
    globalForDb.__sidexDb = databaseUrl ? makeNeon(databaseUrl) : makePglite();
  }
  return globalForDb.__sidexDb;
}

// Opened on first query, not on import: `next build` prerenders shells in parallel workers, and
// several PGlite instances on one directory abort. Nothing touches the database at build time.
export const db: Db = new Proxy({} as Db, {
  get(_t, key) {
    const target = real() as unknown as Record<PropertyKey, unknown>;
    const v = target[key];
    return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(target) : v;
  },
});

/** The concrete instance, for code that inspects the object's class (Auth.js adapter). */
export function getDb(): Db {
  return real();
}

export const isLocalDb = !databaseUrl;
export { schema };
