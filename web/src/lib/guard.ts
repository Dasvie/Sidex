/* Guards for routes that fetch on the caller's behalf: a per-IP rate limit and a check that the
   target host resolves to a public address (no localhost, no private ranges, no metadata IPs).
   The limit counts in Upstash Redis when UPSTASH_REDIS_REST_URL / _TOKEN are set (shared across
   serverless instances); otherwise in this process's memory. */
import { lookup } from "node:dns/promises";

const hits = new Map<string, number[]>();

async function redisAllow(key: string, max: number, windowMs: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const bucket = `rl:${key}:${Math.floor(Date.now() / windowMs)}`;
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify([["INCR", bucket], ["PEXPIRE", bucket, String(windowMs)]]),
    });
    if (!res.ok) return null;
    const [{ result }] = (await res.json()) as { result: number }[];
    return Number(result) <= max;
  } catch {
    return null;
  }
}

/** true when `key` may proceed: at most `max` calls per `windowMs`. */
export async function allow(key: string, max = 20, windowMs = 60_000) {
  const shared = await redisAllow(key, max, windowMs);
  if (shared !== null) return shared;
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= max) { hits.set(key, list); return false; }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  return true;
}

export function clientIp(req: Request) {
  const h = req.headers;
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "local").trim();
}

function privateV4(ip: string) {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  return (
    p[0] === 10 || p[0] === 127 || p[0] === 0 ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168) ||
    (p[0] === 169 && p[1] === 254) || // link-local, cloud metadata
    (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
    p[0] >= 224
  );
}
function privateV6(ip: string) {
  const s = ip.toLowerCase();
  if (s === "::1" || s === "::") return true;
  if (s.startsWith("fc") || s.startsWith("fd") || s.startsWith("fe80")) return true;
  const m = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(s);
  return m ? privateV4(m[1]) : false;
}

/** Resolves the URL's host and rejects anything that is not a public http(s) address. */
export async function publicUrl(raw: string): Promise<URL | null> {
  let u: URL;
  try { u = new URL(raw); } catch { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return privateV4(host) ? null : u;
  if (host.includes(":")) return privateV6(host) ? null : u;
  try {
    const addrs = await lookup(host, { all: true });
    if (!addrs.length) return null;
    for (const a of addrs) if (a.family === 4 ? privateV4(a.address) : privateV6(a.address)) return null;
    return u;
  } catch {
    return null;
  }
}
