/* Shared pieces for the social cards drawn with next/og: the Pretendard face (fetched once,
   OTF because Satori cannot read woff2) and the palette. */
const FONT = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Medium.otf";
let fontData: Promise<ArrayBuffer> | null = null;

export function pretendard() {
  fontData ??= fetch(FONT).then((r) => {
    if (!r.ok) throw new Error("font");
    return r.arrayBuffer();
  });
  return fontData;
}

export const OG = { width: 1200, height: 630, bg: "#f5f5f5", ink: "#0c0a09", muted: "#4e4e4e", soft: "#6e6861", border: "#e7e5e4", accent: "#13bd7e", card: "#ffffff" };
