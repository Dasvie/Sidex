---
name: deploy
description: Vercel 배포 전 점검과 배포. 빌드·타입 검사·환경변수 목록·마이그레이션 순서. 사용자가 "배포하자" 할 때 쓴다.
---

# /deploy

배포 대상은 `web/`. 호스팅 Vercel, DB Neon, 이미지 Vercel Blob, 로그인 Auth.js(Google·Kakao·Naver).

## 배포 전 (여기서 다 통과해야 한다)

1. `cd web && npm run typecheck && npm run build` 가 에러 없이 끝난다.
2. 서비스 문구에 "—" 가 없다: `grep -rn "—" web/src --include=*.tsx --include=*.ts | grep -v "^\S*:\s*//"` 가 비어 있다.
3. 가상의 데이터가 없다. 시드는 Sidex 1건 + 소개 3건뿐이고 리뷰·논평은 0 이다.

## Vercel 환경변수 (사용자가 직접 넣는다. 값은 이 리포에 두지 않는다)

| 키 | 어디서 |
|---|---|
| `DATABASE_URL` | Neon 프로젝트의 pooled connection string |
| `AUTH_SECRET` | `npx auth secret` |
| `AUTH_URL`, `NEXT_PUBLIC_SITE_URL` | 배포 주소 `https://…` |
| `AUTH_GOOGLE_ID/SECRET` | Google Cloud Console → OAuth 클라이언트. 리디렉션 URI `https://<도메인>/api/auth/callback/google` |
| `AUTH_KAKAO_ID/SECRET` | Kakao Developers → REST API 키·Client Secret. 리디렉션 URI `…/api/auth/callback/kakao` |
| `AUTH_NAVER_ID/SECRET` | Naver Developers → 애플리케이션. 콜백 `…/api/auth/callback/naver` |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob 생성 시 자동 주입 |

## 순서

1. Vercel 프로젝트 만들기. Root Directory 를 `web` 으로.
2. 환경변수 입력. `DATABASE_URL` 은 먼저.
3. 로컬에서 `DATABASE_URL=<neon> npm run db:migrate && npm run db:seed` 로 원격 DB 를 채운다. (명령에 실제 값을 이 대화에 붙여 넣지 말고 사용자가 터미널에서 직접 실행한다)
4. 배포. 첫 배포 뒤 사용자가 SNS 로그인을 한 번 한다.
5. `npm run db:claim -- sidex <로그인한 이메일>` 로 @sidex 를 실제 계정에 넘긴다.
6. 배포 주소에서 `/`, `/p/sidex`, `/submit`, `/login` 을 연다. 로그인 → 등록 → 리뷰 → 논평 한 바퀴를 사용자가 직접 돈다.

## 끝났다의 정의

배포 주소에서 로그인한 계정으로 프로덕트 하나를 등록하고, 다른 계정이 리뷰 하나를 남겨 홈 순위가 바뀐 것을 본다.
