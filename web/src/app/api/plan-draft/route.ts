/* POST /api/plan-draft { productId, nodeId } → { text }
   Reads the product's own site (title, description, visible text) and asks the model to draft the
   maker's answer for one planning-map node. Only the maker may call it, only with an API key, and
   nothing is stored: the draft lands in the textarea for the maker to edit and save. */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { currentProfile } from "@/auth";
import { readSite } from "@/lib/site";
import { DOMAINS, FLOW, slugOf, type Node } from "@/lib/planmap";

export const runtime = "nodejs";

function findNode(nodeId: string): { path: Node[]; kind: "flow" | "domain" } | null {
  const parts = nodeId.split("/");
  let list: Node[] | undefined;
  let kind: "flow" | "domain";
  if (parts[0] === "f") { list = FLOW; kind = "flow"; }
  else if (parts[0].startsWith("d:")) { list = DOMAINS[parts[0].slice(2)]; kind = "domain"; }
  else return null;
  const path: Node[] = [];
  for (const seg of parts.slice(1)) {
    const hit: Node | undefined = list?.find((x) => slugOf(x) === seg);
    if (!hit) return null;
    path.push(hit);
    list = hit.children;
  }
  return path.length ? { path, kind } : null;
}

async function pageText(url: string) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 6000);
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128 Safari/537.36", accept: "text/html" }, signal: ctl.signal });
    clearTimeout(t);
    const html = (await res.text()).slice(0, 400 * 1024);
    return html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z#0-9]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "off" }, { status: 503 });
  const me = await currentProfile();
  if (!me) return NextResponse.json({ error: "login" }, { status: 401 });
  let body: { productId?: unknown; nodeId?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const productId = Number(body.productId);
  const nodeId = String(body.nodeId || "");
  const found = findNode(nodeId);
  if (!productId || !found) return NextResponse.json({ error: "bad node" }, { status: 400 });
  const p = await db.query.products.findFirst({ where: eq(products.id, productId) });
  if (!p || p.ownerId !== me.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const [site, text] = await Promise.all([readSite(p.url), pageText(p.url)]);
  const node = found.path[found.path.length - 1];
  const crumbs = found.path.map((x) => x.ko).join(" › ");
  const questions = found.path.flatMap((x) => x.q ?? []).map(([ko]) => `- ${ko}`).join("\n");
  const system = [
    "You draft a product maker's planning note in Korean, 해요체, 2 to 4 sentences, plain text, no markdown, no headings.",
    "Write only what the provided material supports. Where the material says nothing, write '(확인 필요)' instead of guessing. Never invent numbers, names or features.",
    "The note answers the planning question named below for this specific product, from the maker's point of view (1인칭 복수 '우리는' 또는 제품명 주어).",
  ].join("\n");
  const user = [
    `제품: ${p.name}`,
    `한 줄 소개: ${p.tagline}`,
    p.why ? `왜 만들었나: ${p.why}` : "",
    p.description ? `무엇인가: ${p.description}` : "",
    p.detail ? `자세히: ${p.detail}` : "",
    site ? `사이트 제목: ${site.title}\n사이트 설명: ${site.description}` : "",
    text ? `사이트 본문(발췌): ${text}` : "",
    `\n기획 지도 노드: ${crumbs}`,
    questions ? `이 노드의 질문:\n${questions}` : `이 노드(${node.ko})에 대해 이 제품이 택한 답을 적어요.`,
  ].filter(Boolean).join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 400, system, messages: [{ role: "user", content: user }] }),
  });
  if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const draft = (data.content || []).filter((c) => c.type === "text").map((c) => c.text || "").join("").trim();
  return NextResponse.json({ text: draft });
}
