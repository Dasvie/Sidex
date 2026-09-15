# Sidex — 하네스 지도

한국 개발자와 바이브코더가 만든 프로덕트를 **등록하고, 리뷰와 논평으로 순위가 정해지는** 카탈로그.
한국어 전용. 웹 하나. 출시를 전제로 만든다: **가상의 데이터·문구를 서비스에 넣지 않는다.**

정본은 `web/` 하나. 리포 루트의 `README.md`가 사람용 소개, 이 파일이 에이전트용 규칙이다.

## 1. 기술 스택 (결정됨)

| 영역 | 선택 | 한 줄 이유 |
|---|---|---|
| 앱 | Next.js 16 App Router, React 19, TypeScript, `web/` | Server Component 기본, 액션으로 쓰기 |
| DB | Postgres(Neon) + Drizzle. 로컬은 PGlite(`web/.pglite`) | 로컬에 Postgres 없이 같은 스키마로 돈다 |
| 인증 | Auth.js v5, Google·Kakao·Naver | 가입 절차 없음. 첫 로그인에 프로필 자동 생성 |
| 이미지 | Vercel Blob | 토큰 없으면 업로드가 꺼지고 로고는 파비콘 |
| 도우미 | Anthropic API(`claude-sonnet-5`), `web/src/app/api/chat/route.ts` | 카탈로그와 사이트 규칙만 답한다. `ANTHROPIC_API_KEY` 없으면 안 뜬다 |
| 배포 | Vercel, Root Directory `web` | 도메인은 사용자가 붙인다 |
| 디자인 | Pretendard 한 벌, 오프화이트 `#f5f5f5`, 잉크 `#0c0a09`, 그린 CTA `#13bd7e` 하나 | 토큰은 `web/src/app/globals.css` 상단 |

## 2. 디렉토리

```
web/                      정본
  src/db/schema.ts        테이블 (user·account·session·profile·product·screenshot·review·comment·plan_note·plan_vote)
  src/db/{index,migrate,seed,claim,cleanup-test}.ts
  src/lib/planmap.ts      기획 지도 콘텐츠(축·주제·질문, ko/en)
  tests/ e2e/             node:test 단위, Playwright 스모크·메이커 플로우
  src/lib/rank.ts         랭킹 공식 한 곳
  src/lib/dna.ts          등록 URL 의 CSS 를 읽어 팔레트·서체를 잰다
  src/actions/            product·review·comment·profile 서버 액션
  src/app/                /  /c  /c/[slug]  /t/[cat]/[slug]  /p/[slug]  /submit  /u/[handle]  /login  /search  /terms  /privacy  /api/*
  src/components/
  drizzle/                마이그레이션 SQL
.claude/skills/           /dev /db /deploy /qa /review /commit
.claude/hooks/            protect-env(.env 보호)
```

## 3. 불변식

- **가상의 것을 넣지 않는다.** 시드는 Sidex 1건과 예시 프로덕트 3건(Notion·Figma·Linear)뿐이다. 예시의 한 줄 소개는 getdesign.md 요약 첫 구절의 번역(한 구절로 끝), 무엇인가는 Wikipedia 첫 문장의 번역, 자세히는 그 사이트의 meta description, 화면은 그 사이트를 headless Chrome 으로 찍은 캡처(`web/public/shots`), 만든 사람은 Wikipedia·공식 About 페이지의 사실, DESIGN.md 는 `npx getdesign@latest add <brand>` 로 받은 원문(`web/src/db/design/*.md`), 팔레트·서체는 측정값. 모르는 값은 `-`. 리뷰·논평 시드 없음.
- **빈 값은 `-` 하나로 표기한다.** "적히지 않음", "측정 안 됨" 같은 문구를 쓰지 않는다. 설명 문구(순위 규칙, 안내 리드)도 화면에 두지 않는다.
- **출처 표기를 화면에 두지 않는다.** 출처는 시드 코드 주석에만 남긴다.
- **"—" 를 서비스 어디에도 쓰지 않는다.** 제목은 `X | Sidex`. 문장 안에서는 쉼표나 마침표.
- **한국어 기본, 영어 지원.** UI 문구는 `web/src/lib/i18n.ts` 한 곳(ko/en). 서버는 `getT()`, 클라이언트는 `useT()`. 선택은 쿠키 `sidex-lang`, 푸터에서 바꾼다. 예시 프로덕트는 `tagline_en`·`description_en`·`maker_detail_en` 을 따로 갖고, 회원이 쓴 글은 번역하지 않는다. 문구 톤은 짧은 해요체("복사했어요", "저장했어요"). "~습니다" 안내문과 설명 리드는 두지 않는다.
- **서체는 Pretendard 하나.** DESIGN.md 프리뷰도 파일이 이름 붙인 서체를 로드하지 않고 Pretendard 로 크기·굵기·자간만 재현한다.
- **순위 = 리뷰×3 + 논평×1 + 답글×0.5.** 날짜 순위 없음. 별점 미포함. 만든 사람의 논평 제외. 업보트 없음.
- **리뷰는 좋은 점·아쉬운 점 필수, 1인 1건, 만든 사람 불가. 답글은 1단.**
- **쓰기는 로그인 세션으로만.** 액션은 `currentProfile()` 로 시작한다. 입력은 zod.
- **`.env*` 읽기·쓰기·커밋 금지.**(훅) 키는 사용자가 `.env.local`/Vercel 에 직접 넣는다.
- **CTA 는 그린 pill 하나.** 잉크 채움 선택 상태의 글자는 흰색.
- **개발에서 업로드는 `public/uploads/`(git 제외)로 떨어진다.** Blob 토큰이 없어도 로고·화면·아바타 흐름이 그대로 돈다. 프로덕션은 Blob.
- **PGlite 는 한 프로세스만.** `next start` 를 dev 서버와 같이 띄우면 `.pglite` 가 깨진다(`Aborted()`). 깨지면 `npm run db:reset && npm run db:migrate && npm run db:seed`.
- **스모크 `npx playwright test e2e/smoke.spec.ts`**: 모든 화면·메뉴·검색·언어·지도·리뷰 폼·등록 초안·프로필 편집, 콘솔 오류 0·5xx 0·4초 이내. 로그아웃 상태는 `DEV_USER_HANDLE=` 로 dev 서버를 띄우고 `E2E_LOGGED_OUT=1`.
- **E2E `npm run e2e`**(Playwright, 설치된 Chrome, dev 서버 필요): 등록→DESIGN.md→화면 3장→기록→논평→답글→삭제. 만드는 행은 `(e2e 삭제 예정)` 태그로 스스로 지운다.
- **삭제는 프로필의 '내 프로덕트 관리'에서 만든 사람만.** 화면·리뷰·논평·기록·표가 FK cascade 로 함께 사라진다.
- 홈 사이드의 **개발자 행사** 카드는 공개 저장소 brave-people/Dev-Event README 를 1시간 캐시로 읽는다. 못 읽으면 버튼만.
- **개발 서버는 @sidex 로 상시 로그인.** `currentProfile()` 이 development 에서 `DEV_USER_HANDLE`(기본 sidex)의 프로필을 돌려준다. 프로덕션 빌드에서는 꺼진다.
- **주제 허브 `/t/<카테고리>/<주제>`.** 등록 시 고른 주제(`product.topics`)로 모이는 페이지. 정렬(랭킹·리뷰·기획 기록)·15개 페이지네이션·하위 키워드·같은 카테고리 다른 주제. 카테고리 페이지와 상세의 주제 칩이 여기로 간다.
- **기획 기록은 순위에 넣지 않는다.** 순위는 남의 평가(리뷰·논평)만. 기록 수는 랭킹 행 네 번째 박스·상세 메타·프로필에 노출, 리뷰어는 기록마다 동의/반대 한 표(`plan_vote`, 만든 사람 불가). 등록 직후 만든 사람에게 권하는 다음 한 가지는 '기획 기록 3개'(상세 상단 배너).
- **기획 지도 콘텐츠는 `web/src/lib/planmap.ts` 한 곳.** 여덟 질문(FLOW)과 카테고리 주제(DOMAINS), 한·영 병기, 노드 id 는 영문 라벨 슬러그. 만든 사람의 기록은 `plan_note` 테이블.
- `web/` 밖 문서 변경은 사용자 요청이 있을 때만.

## 4. 워크플로

`/dev` 띄우기 → 코드 수정 → `/qa` → `/review` → `/commit`. 스키마를 바꿨으면 `/db generate` → `/db migrate`.
배포는 `/deploy` 절차대로. 개발 서버가 떠 있는 동안 시드를 돌리지 않는다(PGlite 는 프로세스 간 공유가 안 된다).

## 5. "끝났다"의 정의

- `npm run typecheck && npm test && npm run build` 통과 + `/qa` 캡처에서 변경이 보인다. 테스트는 `web/tests/`(node:test + tsx): 순위 공식, DESIGN.md 파서, 사이트 리더.
- 로그인 필요한 흐름(등록·리뷰·논평)은 사용자가 브라우저에서 확인한 결과.

## 6. 남은 일

- 배포됨: https://sidex-pi.vercel.app (Vercel 프로젝트 `sidex`, Neon `sidex-db`, Blob `sidex-blob`, Google·Kakao·Naver 로그인). 빌드가 `db:migrate && db:seed` 를 돈다(`web/vercel.json`). `OWNER_EMAIL` 첫 로그인에 @sidex 자동 이전. 상태는 `/api/health`.
- Anthropic 키(도우미·기획 초안)와 Upstash(요청 제한)는 선택. 없으면 각 기능이 조용히 꺼진다.
- 등록 시 첫 스크린샷 자동 캡처는 아직 없다. 등록자가 올린다.
- 커스텀 도메인을 붙이면 `AUTH_URL`·`NEXT_PUBLIC_SITE_URL` 과 세 OAuth 콘솔의 콜백 URI 를 함께 바꾼다.
