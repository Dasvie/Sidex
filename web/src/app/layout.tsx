import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LangProvider } from "@/components/LangProvider";
import { Chat } from "@/components/Chat";
import { getLang } from "@/lib/lang";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Sidex", template: "%s | Sidex" },
  description: "프로덕트와 아이디어를 둘러보는 카탈로그. 비전공 바이브코더부터 개발자까지, 배포용 URL 하나로 등록하고 리뷰와 논평으로 순위가 정해집니다.",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon-48.png", sizes: "48x48", type: "image/png" }], apple: "/apple-icon" },
  openGraph: { siteName: "Sidex", type: "website", locale: "ko_KR" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const chat = Boolean(process.env.ANTHROPIC_API_KEY);
  return (
    <html lang={lang}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body>
        <LangProvider lang={lang}>
          <Header />
          {children}
          <Footer />
          {chat && <Chat />}
        </LangProvider>
      </body>
    </html>
  );
}
