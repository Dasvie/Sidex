# Sidex

프로덕트와 아이디어를 둘러보는 카탈로그. 리뷰와 논평이 순위를 만든다.

## 로컬에서 돌리기

```bash
npm install
npm run db:migrate     # ./.pglite 에 테이블 생성
npm run db:seed        # Sidex 1건 + Notion·Figma·Linear (사이트에서 문구·팔레트·서체를 읽어 온다)
npm run dev            # http://localhost:3000
```

로그인은 `.env.local` 에 제공자 키가 있어야 된다. `.env.example` 을 복사해 채운다. 키가 없어도 둘러보기는 전부 된다.

## 스크립트

| 명령 | 하는 일 |
|---|---|
| `npm run db:generate` | `src/db/schema.ts` 변경을 `drizzle/*.sql` 로 |
| `npm run db:migrate` | SQL 적용. `DATABASE_URL` 있으면 Neon, 없으면 PGlite |
| `npm run db:seed` | 시드(멱등) |
| `npm run db:reset` | 로컬 PGlite 삭제 |
| `npm run db:claim -- sidex you@example.com` | 시드된 @sidex 프로필을 로그인한 계정에 넘긴다 |
| `npm run typecheck` / `npm run build` | 배포 전 검사 |

## 배포 (Vercel)

1. Vercel 프로젝트의 Root Directory 를 `web` 으로.
2. 환경변수: `DATABASE_URL`(Neon), `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `AUTH_GOOGLE_ID/SECRET`, `AUTH_KAKAO_ID/SECRET`, `AUTH_NAVER_ID/SECRET`, `BLOB_READ_WRITE_TOKEN`, `ANTHROPIC_API_KEY`(도우미, 없으면 안 뜸), `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`(선택, 레이트 리밋 공유).
3. 로컬 터미널에서 `DATABASE_URL` 을 Neon 으로 두고 `npm run db:migrate && npm run db:seed`.
4. 배포 뒤 한 번 로그인하고 `db:claim` 을 돌린다.

OAuth 리디렉션 URI 는 `https://<도메인>/api/auth/callback/{google|kakao|naver}`.

## 구조

- 랭킹 공식은 `src/lib/rank.ts` 한 곳. 리뷰×3 + 논평×1 + 답글×0.5. 날짜·별점·업보트 없음.
- 팔레트·서체 측정은 `src/lib/dna.ts`. 등록된 주소의 CSS 를 읽어 세고, 잰 날짜를 같이 저장한다.
- 쓰기는 전부 `src/actions/` 의 서버 액션. 로그인 세션 없으면 한국어 오류를 돌려준다.
