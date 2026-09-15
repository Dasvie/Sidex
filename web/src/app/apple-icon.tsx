/* 180×180 home-screen icon: the Sidex mark on a white tile. */
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  const svg = readFileSync(join(process.cwd(), "public/logo.svg"), "utf8");
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={124} height={124} alt="" />
      </div>
    ),
    size,
  );
}
