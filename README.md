<div align="center">

<img src="assets/banner.svg" alt="Sidex" width="100%" />

<br />

**한국 개발자와 바이브코더가 만든 프로덕트를 등록하고, 리뷰와 논평으로 순위가 정해지는 카탈로그.**

[![Live](https://img.shields.io/badge/live-sidex--pi.vercel.app-13bd7e?style=flat-square)](https://sidex-pi.vercel.app)
[![CI](https://img.shields.io/github/actions/workflow/status/Dasvie/Sidex/ci.yml?style=flat-square&label=CI)](https://github.com/Dasvie/Sidex/actions)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-0c0a09?style=flat-square&logo=next.js&logoColor=white)](web)
[![Postgres · Drizzle](https://img.shields.io/badge/Postgres-Drizzle-0c0a09?style=flat-square&logo=postgresql&logoColor=white)](web/src/db/schema.ts)
[![Korean · English](https://img.shields.io/badge/UI-%ED%95%9C%EA%B5%AD%EC%96%B4%20%C2%B7%20English-6e6861?style=flat-square)](web/src/lib/i18n.ts)
[![MIT](https://img.shields.io/badge/license-MIT-e7e5e4?style=flat-square)](LICENSE)

<br />

<a href="https://sidex-pi.vercel.app"><img src="https://img.shields.io/badge/%EC%84%9C%EB%B9%84%EC%8A%A4%20%EC%97%B4%EA%B8%B0-13bd7e?style=for-the-badge&labelColor=13bd7e&color=13bd7e" alt="서비스 열기" /></a>&nbsp;
<a href="#-화면"><img src="https://img.shields.io/badge/%ED%99%94%EB%A9%B4-0c0a09?style=for-the-badge" alt="화면" /></a>&nbsp;
<a href="#-사용법-처음부터-끝까지"><img src="https://img.shields.io/badge/%EC%82%AC%EC%9A%A9%EB%B2%95-ffffff?style=for-the-badge&labelColor=ffffff&color=ffffff" alt="사용법" /></a>&nbsp;
<a href="#-로컬에서-실행"><img src="https://img.shields.io/badge/%EB%A1%9C%EC%BB%AC%20%EC%8B%A4%ED%96%89-e7e5e4?style=for-the-badge&labelColor=e7e5e4&color=e7e5e4" alt="로컬 실행" /></a>

</div>

<br />

> 배포용 URL 하나로 등록하면 프로덕트 페이지가 생기고 랭킹에 실려요. 순위는 오직 리뷰와 논평이 만들어요.
>
> 지금 바로: **https://sidex-pi.vercel.app**

<hr />

## 목차

1. [무엇인가](#무엇인가)
2. [이렇게 다릅니다](#이렇게-다릅니다)
3. [화면](#-화면)
4. [사용법, 처음부터 끝까지](#-사용법-처음부터-끝까지)
   - [둘러보기](#1-둘러보기) · [로그인](#2-로그인) · [프로덕트 등록](#3-프로덕트-등록) · [프로덕트 페이지 채우기](#4-프로덕트-페이지-채우기) · [기획 지도](#5-기획-지도) · [리뷰](#6-리뷰) · [논평과 답글](#7-논평과-답글) · [프로필](#8-프로필) · [검색·언어·도우미](#9-검색-언어-도우미)
5. [순위 규칙](#순위-규칙)
6. [데이터 원칙](#데이터-원칙)
7. [구조](#구조)
8. [로컬에서 실행](#-로컬에서-실행)
9. [테스트](#테스트)
10. [배포](#배포)
11. [기여 · 라이선스](#기여)

## 무엇인가

Sidex는 **만든 사람이 자기 프로덕트를 올리고, 다른 사람이 써 보고 리뷰와 논평을 남기는 곳**이에요. 비전공 바이브코더가 주말에 만든 것부터 개발자의 사이드 프로젝트까지, 배포 주소가 있으면 누구나 올릴 수 있어요.

업보트도, 출시일 순위도, 광고도 없어요. **순위는 다른 사람이 남긴 리뷰와 논평의 양으로만 정해져요.** 만든 사람이 자기 프로덕트에 다는 논평은 세지 않아요.

여기까지는 랭킹 사이트예요. Sidex가 다른 점은 **기획**이에요. 프로덕트마다 기획 지도가 열리고, 만든 사람은 "왜 이 문제를, 누구를 위해, 어떤 수익 모델로" 같은 질문에 자기 판단을 남겨요. 읽는 사람은 그 판단에 동의하거나 반대해요. 디자인 시스템 문서(DESIGN.md)를 붙이면 색·타이포·컴포넌트 시트가 그대로 그려져요.

## 이렇게 다릅니다

| | Sidex |
|---|---|
| 순위 | 리뷰 × 3 + 논평 × 1 + 답글 × 0.5. 만든 사람의 논평 제외, 별점 제외, 기획 기록 제외, 업보트 없음 |
| 리뷰 | 별점 + 사용성·완성도·디자인·독창성 4축 + 좋은 점·아쉬운 점 필수. 1인 1건, 만든 사람 불가 |
| 기획 지도 | 8가지 질문(문제·사용자·가치·기능·경험·비즈니스·성장·시스템) × 4단계 + 카테고리별 주제 트리. 만든 사람의 기록, 읽는 사람의 동의/반대 |
| 디자인 시스템 | DESIGN.md를 붙이면 색·타이포·버튼·카드·폼·간격·엘리베이션·반응형 시트가 렌더링 |
| 등록 | 주소 하나 → 자동 채움 → 랭킹 행 미리보기 → 필수 3항목이면 등록. 화면은 등록 뒤에 |
| 데이터 | 가상의 것이 없어요. 예시 프로덕트 3개도 실제 사이트에서 읽은 값만 |
| 언어 | 한국어 기본, 영어 지원. 회원이 쓴 글은 번역하지 않아요 |

## 📷 화면

<div align="center">
<table>
<tr>
<td width="50%"><img src="web/public/shots/sidex-1.png" alt="홈" /><br /><sub>홈 · 이번 달의 프로덕트</sub></td>
<td width="50%"><img src="web/public/shots/sidex-2.png" alt="프로덕트 상세" /><br /><sub>프로덕트 상세 · 개요, 자세히, 기획 지도, 디자인 시스템, 리뷰</sub></td>
</tr>
<tr>
<td width="50%"><img src="web/public/shots/sidex-3.png" alt="카테고리" /><br /><sub>카테고리 · 대표 3개와 주제</sub></td>
<td width="50%"><img src="web/public/shots/sidex-4.png" alt="프로필" /><br /><sub>프로필 · 만든 프로덕트, 최근 기획 기록</sub></td>
</tr>
</table>
</div>

## 🧭 사용법, 처음부터 끝까지

배포 버전(https://sidex-pi.vercel.app) 기준이에요.

### 1. 둘러보기

로그인 없이 전부 볼 수 있어요.

- **홈 `/`**: 이번 달의 프로덕트 랭킹. 상단 탭으로 카테고리별 순위, "전체 기간 보기"로 누적 순위. 각 행에는 로고·이름·한 줄 소개·카테고리·만든 사람, 그리고 네 개의 숫자 박스(별점·리뷰·논평·기획 기록)가 있어요. 오른쪽에는 카테고리별 1위와 **개발자 행사** 카드(공개 저장소 brave-people/Dev-Event에서 읽어요)가 있어요.
- **카테고리 `/c`, `/c/<slug>`**: 개발·엔지니어링, LLM, 생산성, 마케팅, 디자인, 소셜, 금융, 에이전트, 기타. 각 카테고리에는 대표 프로덕트 3개와 그 카테고리의 주제 목록이 있어요.
- **주제 허브 `/t/<카테고리>/<주제>`**: 등록할 때 고른 주제로 프로덕트가 모여요. 정렬(랭킹·리뷰·기획 기록), 15개씩 페이지, 하위 키워드, 같은 카테고리의 다른 주제.
- **프로덕트 `/p/<slug>`**: 아래 4절에서 자세히.
- **헤더**: "프로덕트"와 "카테고리" 메가 메뉴(지금 뜨는 프로덕트, 카테고리별 1위), 검색창, 로그인, 제품 등록.

### 2. 로그인

`/login`에서 **카카오톡, 네이버, Google** 중 하나로 계속해요. 가입 절차가 따로 없어요. 첫 로그인에 제공자가 준 이름과 사진으로 프로필이 만들어지고, 핸들(`@handle`)은 이메일이나 이름에서 자동으로 정해져요. 마지막에 쓴 로그인 방식에는 "최근 로그인" 배지가 붙어요.

로그인은 **등록, 리뷰, 논평, 기획 기록, 동의/반대**에만 필요해요.

### 3. 프로덕트 등록

`/submit`. 로그인 전에도 폼을 채울 수 있고, 마지막 단계에서 로그인해요.

1. **서비스 URL**을 넣어요. Sidex가 그 페이지를 읽어 서비스명, 한 줄 소개, 로고(파비콘)를 채워요. 고쳐도 돼요.
2. 폼 옆에 **랭킹에 어떻게 보이는지** 미리보기가 바로 그려져요.
3. 필수는 **URL, 서비스명, 카테고리(최대 3개)** 셋뿐이에요. 다 차면 바로 등록해도 돼요.
4. 더 채우기(접혀 있어요, 나중에 해도 돼요): 왜 만들었나, 무엇인가, 단계(아이디어·프로토타입·출시), 빌드 노트(스택·도구·제작 기간·팀 인원), DESIGN.md, **주제(최대 5개)**.
5. 등록하면 `/p/<slug>` 프로덕트 페이지가 생기고, 등록 URL의 CSS를 읽어 **팔레트와 서체를 측정**해 개요에 실어요. 못 잰 값은 `-`로 표시해요.

### 4. 프로덕트 페이지 채우기

`/p/<slug>`는 위에서 아래로 이렇게 구성돼요.

| 구역 | 내용 |
|---|---|
| 헤더 | 로고, 이름, 한 줄 소개, 카테고리·주제 칩, 만든 사람, "웹사이트 방문", 링크 복사·공유 |
| 개요 | 왜 만들었나 · 무엇인가 · 빌드 노트 · 측정한 팔레트와 서체 · 주소 |
| 자세히 | 긴 설명과 **실제 화면** 캐러셀 |
| 기획 | 기획 지도 (5절) |
| 디자인 시스템 | DESIGN.md가 있으면 **Preview**(색상 팔레트 카드, 타이포 스케일, 모서리·간격, 버튼·카드·폼 요소, 엘리베이션, 반응형 표)와 **원문** 탭, 복사 버튼 |
| 리뷰 | 요약 시각화 + 리뷰 목록 + 리뷰 폼 (6절) |
| 논평 | 논평과 답글 (7절) |
| 비슷한 프로덕트 | 같은 카테고리의 다른 프로덕트 |

만든 사람은 자기 프로덕트 페이지에서 **실제 화면을 최대 6장**(png·jpg·webp, 한 장 8MB) 올리고 지울 수 있어요. 업로드는 서버에서 다시 인코딩해 1440px 웹으로 저장돼요. 등록 직후에는 상단에 "기획 지도에 3개만 적어 보세요" 배너가 떠요. 이게 Sidex가 권하는 첫 번째 일이에요.

### 5. 기획 지도

프로덕트를 가운데 두고 왼쪽에는 **그 카테고리의 주제 트리**, 오른쪽에는 서비스 하나를 기획할 때 답해야 하는 **여덟 가지 질문**(문제 · 사용자 · 가치 · 기능 · 경험 · 비즈니스 · 성장 · 시스템)이 4단계 깊이로 펼쳐져요. 콘텐츠는 [`web/src/lib/planmap.ts`](web/src/lib/planmap.ts) 한 파일에 한·영으로 들어 있어요(약 1,600 노드).

- 노드를 누르면 아래 주제로 내려가고, 오른쪽 패널에 그 노드에서 **확인할 질문**과 참고 프레임워크가 나와요. 주제 노드는 Sidex 안의 비슷한 프로덕트를 보여 줘요.
- 끌어서 옮기고 휠로 확대해요. 페이지 스크롤과 섞이지 않아요.
- **만든 사람**은 노드마다 "이 프로덕트에서는…" 기록을 남겨요. Anthropic 키가 설정된 배포에서는 사이트를 읽어 만든 **초안 제안** 버튼이 뜨는데, 저장 전엔 아무 데도 남지 않아요.
- **읽는 사람**은 기록마다 **동의 / 반대** 한 표를 던져요. 만든 사람은 자기 기록에 표를 못 던져요.
- 기록 수는 랭킹 행의 네 번째 박스, 상세 메타, 프로필에 보여요. **순위에는 들어가지 않아요.** 순위는 남의 평가만 세요.
- 기록이 있는 노드는 지도에서 표시가 달라요. `?node=<id>`로 특정 노드가 열린 채 공유할 수 있어요.

### 6. 리뷰

- **별점(1~5)**, **사용성·완성도·디자인·독창성 4축**, **좋은 점·아쉬운 점** 텍스트가 모두 필수예요.
- 프로덕트마다 **1인 1건**, 나중에 고칠 수 있어요. 만든 사람은 자기 프로덕트에 리뷰를 못 써요(논평으로 답해요).
- 리뷰가 쌓이면 상단에 평균 별점과 4축 분포가 시각화돼요.
- 별점은 순위에 들어가지 않아요. 리뷰 **건수**만 ×3으로 세요.

### 7. 논평과 답글

- 논평은 프로덕트에 대해 하고 싶은 말이에요. 답글은 **1단**까지.
- 만든 사람은 논평을 **고정**할 수 있고, 만든 사람 표시가 붙어요.
- 순위에는 남의 논평 ×1, 남의 답글 ×0.5로 들어가요. 만든 사람이 쓴 것은 제외.
- 탈퇴한 회원의 글은 "탈퇴한 회원"으로 남아요.

### 8. 프로필

`/u/<handle>`. 표시 이름, 소개, 링크, 사진(없으면 기본 파란 인물 마크), 만든 프로덕트, 최근 기획 기록.

- 우상단 아바타에 마우스를 올리면 메뉴(내 프로필, 제품 등록, 로그아웃)가 열려요.
- 내 프로필에는 **내 프로덕트 관리**가 있어요. 프로덕트를 지우면 화면·리뷰·논평·기획 기록·표가 함께 사라지고 되돌릴 수 없어요(두 번 확인).

### 9. 검색, 언어, 도우미

- **검색 `/search?q=`**: 이름·소개·설명을 찾고 일치 부분을 강조해요.
- **언어**: 푸터에서 한국어 / English. 쿠키에 저장돼요. UI 문구와 예시 프로덕트 소개만 번역되고 회원이 쓴 글은 그대로예요.
- **도우미**: 배포에 Anthropic 키가 있으면 오른쪽 아래에 떠요. 카탈로그와 사용법만 답하고 대화를 저장하지 않아요. 키가 없으면 보이지 않아요.
- **공유**: 모든 페이지에 OG 이미지가 있어요. 프로덕트 페이지는 로고·이름·소개로 카드가 그려져요.

## 순위 규칙

```
점수 = 리뷰 × 3 + 논평 × 1 + 답글 × 0.5
```

- 만든 사람이 자기 프로덕트에 쓴 논평·답글은 세지 않아요.
- 별점, 기획 기록, 동의/반대, 등록일은 순위에 들어가지 않아요.
- "이번 달"은 이번 달에 달린 리뷰·논평만, "전체 기간"은 누적이에요.
- 공식은 [`web/src/lib/rank.ts`](web/src/lib/rank.ts) 한 곳에 있어요. 결과는 60초 캐시되고, 쓰기가 일어나면 바로 갱신돼요.

## 데이터 원칙

- **가상의 데이터·문구를 넣지 않아요.** 시드는 Sidex 자신 1건과 예시 3건(Notion·Figma·Linear)뿐이에요. 한 줄 소개는 getdesign.md 요약, 무엇인가는 Wikipedia 첫 문장, 자세히는 그 사이트의 meta description, 화면은 headless Chrome으로 찍은 실제 캡처, DESIGN.md는 `npx getdesign@latest add <brand>` 원문, 팔레트·서체는 측정값이에요. 리뷰·논평 시드는 없어요.
- 빈 값은 `-` 하나로 표시해요. 설명 문구를 화면에 늘어놓지 않아요.
- 문구는 짧은 해요체. `—`는 서비스 어디에도 쓰지 않아요.
- 서체는 Pretendard 하나. DESIGN.md 프리뷰도 파일이 지정한 서체를 로드하지 않고 크기·굵기·자간만 재현해요.

## 구조

| 영역 | 선택 |
|---|---|
| 앱 | Next.js 16 App Router, React 19, TypeScript. Server Component 기본, 쓰기는 서버 액션 |
| 데이터 | Postgres(Neon) + Drizzle. 로컬은 PGlite라 Postgres 설치가 필요 없어요 |
| 인증 | Auth.js v5 · Google · Kakao · Naver. 세션은 DB |
| 이미지 | Vercel Blob(로컬은 `public/uploads/` 폴백), sharp로 리사이즈 |
| 도우미 | Anthropic API(선택) |
| 요청 제한 | Upstash Redis(선택). 없으면 인스턴스 메모리 |
| 디자인 | Pretendard, 오프화이트 `#f5f5f5`, 잉크 `#0c0a09`, 그린 CTA `#13bd7e` 하나 |
| 테스트 | node:test 단위 · Playwright 스모크와 메이커 플로우 |

```
web/
  src/app/            /  /c  /c/[slug]  /t/[cat]/[slug]  /p/[slug]  /submit  /u/[handle]
                      /login  /search  /terms  /privacy  /api/{auth,preview,chat,plan-draft,health}
  src/actions/        product · screenshot · review · comment · plan · profile
  src/components/     PlanMap · DesignSystem · SubmitForm · ReviewForm · CommentThread · ...
  src/db/             schema · migrate · seed · claim · cleanup-test
  src/lib/            rank(순위) · planmap(기획 지도) · designmd(파서) · site(주소 읽기) · dna(팔레트 측정)
                      guard(요청 제한·공개 주소 검사) · upload · i18n · og
  drizzle/            마이그레이션 SQL
  e2e/  tests/        Playwright · node:test
```

## 🛠 로컬에서 실행

```bash
git clone https://github.com/Dasvie/Sidex.git
cd Sidex/web
npm install
cp .env.example .env.local   # 값은 비워도 로컬은 돌아가요
npm run db:migrate           # PGlite에 스키마
npm run db:seed              # 예시 프로덕트 4개
npm run dev                  # http://localhost:3000
```

개발 서버에서는 시드 회원 `@sidex`로 상시 로그인돼요(`DEV_USER_HANDLE`, 프로덕션에서는 꺼짐). 로그아웃 상태를 보려면 `.env.local`에 `DEV_USER_HANDLE=`(빈 값). 업로드는 `public/uploads/`로 떨어져요. PGlite는 한 프로세스만 열 수 있어요. 깨지면 `npm run db:reset && npm run db:migrate && npm run db:seed`.

## 테스트

```bash
npm run typecheck && npm test && npm run build   # 끝났다의 기준 (CI와 같음)
npx playwright test e2e/smoke.spec.ts            # 모든 화면·메뉴·검색·언어·지도·폼, 콘솔 오류 0, 5xx 0
npm run e2e                                      # 등록 → DESIGN.md → 화면 3장 → 기록 → 논평 → 답글 → 삭제
```

e2e는 dev 서버를 켜 둔 채 돌려요. 만드는 행은 `(e2e 삭제 예정)` 태그로 스스로 지워요.

## 배포

Vercel에서 돌아가요. Root Directory `web`, 나머지는 리포에 다 들어 있어요.

1. Vercel에서 이 리포를 Import, Root Directory를 `web`으로.
2. Storage 탭에서 **Neon**(변수 접두사 `DATABASE`)과 **Blob**(read-write 토큰 포함)을 연결. `DATABASE_URL`·`DATABASE_POSTGRES_URL`·`POSTGRES_URL` 어느 이름이든 읽어요.
3. 환경 변수: `AUTH_SECRET`(`npx auth secret`), `AUTH_URL`·`NEXT_PUBLIC_SITE_URL`(배포 주소), 로그인 제공자 키(`AUTH_GOOGLE_*`, `AUTH_KAKAO_*`, `AUTH_NAVER_*` 중 있는 것), `OWNER_EMAIL`(만든 사람 이메일). 선택: `ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL/TOKEN`. 전체 목록은 [`web/.env.example`](web/.env.example).
4. 배포. 빌드 때 마이그레이션과 시드가 자동으로 돌아요([`web/vercel.json`](web/vercel.json)). `OWNER_EMAIL` 계정이 처음 로그인하면 예시 계정 @sidex가 그 계정으로 넘어와요.
5. `/api/health`가 빠진 설정을 알려줘요. `ready: true`면 끝.

OAuth 콜백은 `https://<도메인>/api/auth/callback/google`, `/kakao`, `/naver`. 도메인을 바꾸면 `AUTH_URL`·`NEXT_PUBLIC_SITE_URL`과 세 콘솔의 콜백을 함께 바꿔요.

## 기여

이슈와 PR 환영해요. 방법은 [CONTRIBUTING.md](CONTRIBUTING.md), 규칙은 [`CLAUDE.md`](CLAUDE.md)에 있어요(에이전트용이지만 사람이 읽어도 같은 내용이에요). 보안 문제는 [SECURITY.md](SECURITY.md)대로 알려 주세요.

## 라이선스

[MIT](LICENSE)

---

<details>
<summary><b>English</b></summary>

**Sidex** is a catalog where Korean developers and vibe coders register their products. Ranking is decided only by other people's reviews and comments: `reviews × 3 + comments × 1 + replies × 0.5`. No upvotes, no date-based ranking, no ads, and the maker's own comments never count.

**How it works.** Sign in with Kakao, Naver or Google. Submit a product with one URL; Sidex reads the page to prefill the name, tagline and logo, shows a live preview of the ranking row, and needs only three required fields. On the product page the maker adds up to six screenshots, a longer description, build notes and a DESIGN.md that renders into a design-system sheet. Every product has a **planning map**: eight product questions (problem, user, value, features, experience, business, growth, system), four levels deep, plus a topic tree for its category. The maker records their decisions on nodes; readers agree or disagree. Reviews need a star rating, four axes (usability, polish, design, originality) and both a strength and a weakness; one per person, never by the maker. Comments allow one level of replies.

**Stack.** Next.js 16 App Router, React 19, TypeScript, Postgres (Neon) with Drizzle (PGlite locally), Auth.js v5, Vercel Blob, Pretendard. Korean UI by default with an English toggle in the footer. Run locally with `cd web && npm install && npm run db:migrate && npm run db:seed && npm run dev`. Live at https://sidex-pi.vercel.app.

</details>
