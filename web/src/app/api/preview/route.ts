/* GET /api/preview?url=https://... → { title, description, favicon } read from that page.
   Public, so it is rate-limited per IP; only public hosts are fetched; results cache 5 minutes. */
import { NextResponse } from "next/server";
import { readSite } from "@/lib/site";
import { allow, clientIp } from "@/lib/guard";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!(await allow(`preview:${clientIp(req)}`, 20))) return NextResponse.json({ error: "too many" }, { status: 429 });
  const url = (new URL(req.url).searchParams.get("url") || "").trim().slice(0, 300);
  if (!/^https?:\/\/\S+\.\S+/.test(url)) return NextResponse.json({ error: "bad url" }, { status: 400 });
  const read = await readSite(url);
  if (!read) return NextResponse.json({ error: "unreachable" }, { status: 502 });
  return NextResponse.json(read, { headers: { "cache-control": "private, max-age=300" } });
}
