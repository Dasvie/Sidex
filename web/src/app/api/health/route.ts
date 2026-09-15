/* GET /api/health → what a deployment is missing, in one JSON. Booleans only for secrets;
   the database line carries the driver's message so "relation does not exist" (migrations not
   run) and "connection refused" (wrong DATABASE_URL) can be told apart without reading logs. */
import { NextResponse } from "next/server";
import { db, isLocalDb } from "@/db";
import { enabledProviders } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let database: string;
  let products = 0;
  try {
    products = (await db.query.products.findMany({ columns: { id: true } })).length;
    database = "ok";
  } catch (e) {
    database = "error: " + (e instanceof Error ? e.message : String(e)).slice(0, 200);
  }
  const body = {
    database: isLocalDb ? (process.env.NODE_ENV === "production" ? "error: DATABASE_URL is not set" : database) : database,
    products,
    authSecret: !!process.env.AUTH_SECRET,
    providers: enabledProviders,
    blob: !!process.env.BLOB_READ_WRITE_TOKEN,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    assistant: !!process.env.ANTHROPIC_API_KEY,
  };
  const ready = body.database === "ok" && body.authSecret && body.providers.length > 0 && body.blob && !!body.siteUrl;
  return NextResponse.json({ ready, ...body }, { status: ready ? 200 : 503, headers: { "cache-control": "no-store" } });
}
