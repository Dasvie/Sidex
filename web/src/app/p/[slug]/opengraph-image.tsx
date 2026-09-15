/* Social card for a product: logo, name, one-liner, counts, Sidex mark. */
import { ImageResponse } from "next/og";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { faviconFor } from "@/lib/slug";
import { OG, pretendard } from "@/lib/og";

export const runtime = "nodejs";
export const size = { width: OG.width, height: OG.height };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await db.query.products.findFirst({ where: eq(products.slug, slug) });
  const fonts = await pretendard().then((data) => [{ name: "Pretendard", data, weight: 500 as const, style: "normal" as const }]).catch(() => []);
  const name = p?.name ?? "Sidex";
  const tagline = p?.tagline ?? "프로덕트와 아이디어를 둘러보는 카탈로그";
  const logo = p ? (/^https?:/.test(p.logoUrl) ? p.logoUrl : faviconFor(p.url, 256)) : "";
  const counts = p ? `리뷰 ${p.reviewCount} · 논평 ${p.commentCount}` : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: OG.bg, color: OG.ink, fontFamily: "Pretendard" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={136} height={136} style={{ borderRadius: 28, border: `1px solid ${OG.border}`, background: OG.card, objectFit: "cover" }} alt="" />
          ) : (
            <div style={{ width: 136, height: 136, borderRadius: 28, background: OG.card, border: `1px solid ${OG.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>{name.slice(0, 1)}</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: -2 }}>{name}</div>
            <div style={{ fontSize: 32, lineHeight: 1.3, color: OG.muted }}>{tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: OG.soft }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {counts && <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 12, height: 12, borderRadius: 999, background: OG.accent }} />{counts}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: OG.ink, fontSize: 30 }}>Sidex</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
