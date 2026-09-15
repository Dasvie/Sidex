---
name: db
description: 스키마 변경·마이그레이션·시드·계정 이전. Drizzle + Postgres(Neon) / 로컬 PGlite. 테이블이나 컬럼을 바꿀 때, 시드를 다시 넣을 때 쓴다.
---

# /db [generate|migrate|seed|reset|claim]

정본은 `web/src/db/schema.ts`. 마이그레이션 SQL 은 `web/drizzle/`. 모든 명령은 `web/` 에서.

| 할 일 | 명령 | 언제 |
|---|---|---|
| 스키마 → SQL | `npm run db:generate` | `schema.ts` 를 고친 직후. 생성된 `drizzle/XXXX_*.sql` 을 읽고 의도와 맞는지 확인한다 |
| SQL 적용 | `npm run db:migrate` | generate 뒤. `DATABASE_URL` 이 있으면 Neon, 없으면 `./.pglite` |
| 시드 | `npm run db:seed` | 비어 있는 DB 에 Sidex 1건 + 소개 프로덕트 3건(Notion·Figma·Linear). 있으면 건너뛴다(멱등) |
| 로컬 초기화 | `npm run db:reset` 후 migrate·seed | 로컬 DB 를 통째로 지운다. Neon 에는 영향 없다 |
| 시드 계정 인계 | `npm run db:claim -- sidex <이메일>` | 사용자가 SNS 로그인을 한 번 한 뒤. 시드된 @sidex 프로필과 그 프로덕트가 실제 계정으로 넘어간다 |

## 규칙

- 시드에는 **실제 값만** 넣는다. 예시 프로덕트(Notion·Figma·Linear)는 매 실행마다 새로 고쳐진다: 한 줄 소개는 getdesign.md 요약의 번역, 무엇인가는 Wikipedia 첫 문장의 번역, 만든 사람은 Wikipedia·공식 About 의 사실(출처 URL 저장), DESIGN.md 는 `src/db/design/<slug>.md`(getdesign 원문), 팔레트·서체는 `src/lib/dna.ts` 측정. 새 예시를 넣을 때도 같은 절차를 지킨다. DESIGN.md 원문은 `npx getdesign@latest add <brand>` 로 받는다(brand 목록은 명령이 알려 준다).
- 회원이 등록한 행(source=member)은 시드가 절대 건드리지 않는다.
- 집계 컬럼(`review_count`, `comment_count`, `reply_count`, `rating_avg_x10`)은 `refreshAggregates()` 만 쓴다. 직접 UPDATE 하지 않는다.
- 랭킹 공식은 `src/lib/rank.ts` 한 곳. 리뷰 3, 논평 1, 답글 0.5. 만든 사람 논평 제외. 별점 미포함.
- 컬럼을 지우는 마이그레이션은 사용자 확인 후에만.
- 개발 서버가 떠 있는 동안 시드를 돌리면 서버는 옛 데이터를 본다(PGlite 는 프로세스 간 공유가 안 된다). 시드 뒤 서버를 재시작한다.
