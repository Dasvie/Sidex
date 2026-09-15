/* Seeds the catalogue with real things only.
   1. Sidex itself, in its maker's own words.
   2. Three products Sidex shows as worked examples: Notion, Figma, Linear.
      - One-line intro: the first phrase of the getdesign.md summary line, in Korean.
      - What it is: Korean rendering of the Wikipedia lead sentence, source linked.
      - Maker: company, founders, founding year, HQ, from Wikipedia / the company's own About page.
      - DESIGN.md: the published analysis fetched with `npx getdesign@latest add <brand>` (src/db/design/*.md).
      - Palette and fonts: measured from the live CSS at seed time.
      Nothing is written from memory. Curated rows are refreshed on every run; member rows never are.
   Run: npm run db:seed */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { products, profiles, screenshots, users } from "./schema";
import { measureDna } from "../lib/dna";

async function ensureSidexBuilder() {
  const existing = await db.query.profiles.findFirst({ where: eq(profiles.handle, "sidex") });
  if (existing) return existing.id;
  const [u] = await db.insert(users).values({ name: "김민철" }).returning({ id: users.id });
  await db.insert(profiles).values({
    id: u.id,
    handle: "sidex",
    displayName: "김민철",
    bio: "Sidex를 만들었습니다.",
    linkUrl: "https://github.com/Dasvie/Sidex",
    createdAt: new Date("2026-09-10T19:38:43+09:00"), // the day the profile was first made
  });
  return u.id;
}

const CURATED = [
  {
    slug: "figma",
    name: "Figma",
    url: "https://www.figma.com",
    pages: ["https://www.figma.com/ko-kr/", "https://www.figma.com/ko-kr/make/", "https://www.figma.com/ko-kr/pricing/"],
    categories: ["design"],
    // planning-map topics (editorial classification): interface design, handoff, generative design (Figma Make)
    topics: ["design/ui-design", "design/collaboration-and-handoff", "design/generative-design"],
    // getdesign.md: "Collaborative design tool. Vibrant multi-color, playful yet professional."
    tagline: "협업 디자인 도구",
    taglineEn: "Collaborative design tool",
    descriptionEn: "A collaborative web-based application for user interface design. It supports the design of mobile apps, websites, and illustrations.",
    // Wikipedia lead: "Figma is a collaborative web-based application for user interface design. It supports the design of mobile apps, websites, and illustrations"
    description: "사용자 인터페이스 디자인을 위한 협업 웹 애플리케이션입니다. 모바일 앱, 웹사이트, 일러스트레이션 디자인을 지원합니다.",
    // figma.com/ko-kr and figma.com <meta name="description"> (their dash written as a comma)
    detail: "Figma는 디자인, 코드, AI가 하나로 모이는 캔버스입니다. 초기 아이디어부터 제품 출시까지, 팀 전체가 한 곳에서 개념을 운영 단계의 결과물로 만들어 낼 수 있습니다.",
    detailEn: "Figma is the canvas where design, code, and AI come together. From first idea to shipped product, go from concept to production with your whole team, in one place.",
    makerName: "Figma, Inc.",
    makerDetail: "2012년 Dylan Field와 Evan Wallace가 창업. 샌프란시스코. CEO Dylan Field.",
    makerDetailEn: "Founded in 2012 by Dylan Field and Evan Wallace. San Francisco. CEO Dylan Field.",
    makerUrl: "https://www.figma.com/about/",
    makerSource: "https://en.wikipedia.org/wiki/Figma",
  },
  {
    slug: "notion",
    name: "Notion",
    url: "https://www.notion.com",
    pages: ["https://www.notion.com/ko", "https://www.notion.com/ko", "https://www.notion.com/ko/pricing"],
    categories: ["productivity"],
    topics: ["productivity/notes-and-docs", "productivity/knowledge-management", "productivity/databases-and-tables"],
    // getdesign.md: "All-in-one workspace. Warm minimalism, serif headings, soft surfaces."
    tagline: "올인원 워크스페이스",
    taglineEn: "All-in-one workspace",
    descriptionEn: "A productivity and note-taking application developed by Notion Labs, Inc. It serves as a workspace for notetaking, knowledge management, data organization, and project and task tracking.",
    // Wikipedia lead: "Notion is a productivity and note-taking application developed by Notion Labs, Inc. It serves as a workspace for notetaking, knowledge management, data organization, and project and task tracking."
    description: "Notion Labs, Inc.가 만든 생산성·노트 애플리케이션입니다. 노트, 지식 관리, 데이터 정리, 프로젝트와 할 일 추적을 한곳에서 하는 워크스페이스입니다.",
    // notion.com/ko and notion.com <meta name="description">
    detail: "커스텀 에이전트를 구축하고, 모든 앱을 검색하고, 단순 반복 작업을 자동화하세요. 팀이 더 많은 작업을 더 빠르게 수행할 수 있도록 도와주는 AI 워크스페이스.",
    detailEn: "Build Custom Agents, search across all your apps, and automate busywork. The AI workspace where teams get more done, faster.",
    makerName: "Notion Labs, Inc.",
    makerDetail: "2013년 Ivan Zhao, Akshay Kothari, Chris Prucha, Jessica Lam, Simon Last, Toby Schachman이 창업. 샌프란시스코.",
    makerDetailEn: "Founded in 2013 by Ivan Zhao, Akshay Kothari, Chris Prucha, Jessica Lam, Simon Last and Toby Schachman. San Francisco.",
    makerUrl: "https://www.notion.com/about",
    makerSource: "https://en.wikipedia.org/wiki/Notion_(productivity_software)",
  },
  {
    slug: "linear",
    name: "Linear",
    url: "https://linear.app",
    pages: ["https://linear.app/", "https://linear.app/features", "https://linear.app/pricing"],
    categories: ["productivity", "engineering"],
    topics: ["productivity/project-management", "engineering/collaboration"],
    // getdesign.md: "Project management. Ultra-minimal, precise, purple accent."
    tagline: "프로젝트 관리 도구",
    taglineEn: "Project management tool",
    descriptionEn: "Project management software by Linear Orbit, Inc., San Francisco. A purpose-built system where teams and agents operate together in a shared, structured environment.",
    // Wikipedia lead: "Linear Orbit, Inc. is an American software company based in San Francisco, California that develops the project management software Linear."
    description: "샌프란시스코의 Linear Orbit, Inc.가 만드는 프로젝트 관리 소프트웨어입니다. 팀과 에이전트가 하나의 구조화된 환경에서 함께 일하도록 설계됐습니다.",
    // linear.app <meta name="description">; Korean is our rendering of it
    detail: "AI 에이전트와 함께 프로덕트를 계획하고 만들기 위해 설계된 도구.",
    detailEn: "Purpose-built for planning and building products with AI agents.",
    makerName: "Linear Orbit, Inc.",
    makerDetail: "2019년 Karri Saarinen, Jori Lallo, Tuomas Artman이 창업. 샌프란시스코. CEO Karri Saarinen.",
    makerDetailEn: "Founded in 2019 by Karri Saarinen, Jori Lallo and Tuomas Artman. San Francisco. CEO Karri Saarinen.",
    makerUrl: "https://linear.app/about",
    makerSource: "https://linear.app/about",
  },
] as const;

async function main() {
  const have = new Set((await db.select({ slug: products.slug }).from(products)).map((r) => r.slug));

  if (!have.has("sidex")) {
    const ownerId = await ensureSidexBuilder();
    await db.insert(products).values({
      slug: "sidex",
      name: "Sidex",
      tagline: "프로덕트와 아이디어를 둘러보는 카탈로그",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://github.com/Dasvie/Sidex",
      why: "비전공자부터 전공자까지, 아이디어를 프로덕트로 배포하기 매우 쉬워졌습니다.\n아이디어를 보고, 공유하고, 위계가 생기는 원인을 알 수 있는 플랫폼을 만들고 싶어 제작했습니다.",
      description: "비전공자 바이브코더부터 개발자까지 서비스 URL로 서로의 프로덕트에 대해 공유할 수 있습니다.\n서로의 프로덕트의 구현방법에 대해 호기심이 드는 발판이었으면 좋겠습니다.",
      stage: "prototype",
      categories: ["engineering", "social"],
      ownerId,
      source: "member",
      stack: "Next.js, Postgres, Vercel",
      tools: "Claude Code",
      logoUrl: "/logo.svg",
      dna: { palette: ["#f5f5f5", "#ffffff", "#0c0a09", "#4e4e4e", "#13bd7e", "#e7e5e4"], fonts: ["Pretendard Variable"], measuredAt: new Date().toISOString().slice(0, 10) },
      createdAt: new Date("2026-09-10T19:39:57+09:00"),
    });
    console.log("seeded: sidex");
  }

  // Sidex's own screens, captured from this app (public/shots/sidex-*.png). Added once; a member
  // who later uploads their own set replaces these through the product form, not the seed.
  const [sx] = await db.select({ id: products.id }).from(products).where(eq(products.slug, "sidex"));
  if (sx) {
    const have = await db.select({ id: screenshots.id }).from(screenshots).where(eq(screenshots.productId, sx.id));
    const pages = [["홈", "/"], ["프로덕트 상세", "/p/sidex"], ["카테고리", "/c/design"], ["프로필", "/u/sidex"]] as const;
    if (!have.length) {
      const rows = pages
        .map(([title, path], i) => ({ productId: sx.id, url: `/shots/sidex-${i + 1}.png`, title, caption: path, sort: i }))
        .filter((r) => existsSync(join(__dirname, "../../public", r.url)));
      if (rows.length) await db.insert(screenshots).values(rows);
      console.log(`sidex screens: ${rows.length}`);
    }
  }

  for (const c of CURATED) {
    const designMd = readFileSync(join(__dirname, "design", `${c.slug}.md`), "utf8").replace(/\r\n/g, "\n");
    const dna = await measureDna(c.url);
    const row = {
      name: c.name,
      url: c.url,
      categories: [...c.categories],
      topics: [...c.topics],
      tagline: c.tagline,
      taglineEn: c.taglineEn,
      description: c.description,
      descriptionEn: c.descriptionEn,
      why: "",
      stage: "launched",
      ownerId: null,
      source: "curated",
      designMd,
      designMdSource: `https://getdesign.md/${c.slug === "linear" ? "linear.app" : c.slug}/design-md`,
      detail: c.detail,
      detailEn: c.detailEn,
      makerName: c.makerName,
      makerDetail: c.makerDetail,
      makerDetailEn: c.makerDetailEn,
      makerUrl: c.makerUrl,
      makerSource: c.makerSource,
      ...(dna ? { dna } : {}),
    };
    if (have.has(c.slug)) await db.update(products).set(row).where(eq(products.slug, c.slug));
    else await db.insert(products).values({ slug: c.slug, ...row, dna: dna ?? null });
    // Screens: headless-Chrome captures of the product's own pages (public/shots), 1440×900.
    const [{ id }] = await db.select({ id: products.id }).from(products).where(eq(products.slug, c.slug));
    await db.delete(screenshots).where(eq(screenshots.productId, id));
    const shots = c.pages
      .map((page, i) => ({ productId: id, url: `/shots/${c.slug}-${i + 1}.png`, title: page.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), caption: "", sort: i }))
      .filter((sh) => existsSync(join(__dirname, "../../public", sh.url)));
    if (shots.length) await db.insert(screenshots).values(shots);
    console.log(`${have.has(c.slug) ? "refreshed" : "seeded"}: ${c.slug}`, dna ? `(fonts: ${dna.fonts.join(", ") || "none"}, palette ${dna.palette.length})` : "(dna not measured)");
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
