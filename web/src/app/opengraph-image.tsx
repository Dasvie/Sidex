/* Social card for the home page. */
import { ImageResponse } from "next/og";
import { OG, pretendard } from "@/lib/og";

export const runtime = "nodejs";
export const size = { width: OG.width, height: OG.height };
export const contentType = "image/png";

export default async function Image() {
  const fonts = await pretendard().then((data) => [{ name: "Pretendard", data, weight: 500 as const, style: "normal" as const }]).catch(() => []);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: OG.bg, color: OG.ink, fontFamily: "Pretendard" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 34, color: OG.soft }}>Sidex</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 80, lineHeight: 1.05, letterSpacing: -2.5 }}><div>프로덕트와 아이디어를</div><div>둘러보는 카탈로그</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: OG.muted }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: OG.accent }} />
          리뷰와 논평이 순위를 정해요
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
