---
name: dev
description: 로컬 개발 서버를 띄우고 브라우저 패널에서 화면을 확인한다. web/ 의 Next.js 앱. 코드 고친 뒤 화면으로 검증할 때 쓴다.
---

# /dev

## 절차

1. `preview_start(name: "web")` 로 서버를 띄운다(`.claude/launch.json`). 이미 떠 있으면 재사용된다.
2. 확인할 주소로 `navigate` 한 뒤 `screenshot` 과 `read_console_messages(onlyErrors: true)` 를 같이 본다.
3. 로그인이 필요한 화면(등록·리뷰·논평)은 로그인 제공자 키가 `.env.local` 에 있어야 동작한다. 없으면 로그인 화면에 "제공자가 아직 연결되지 않았습니다" 가 뜬다. 그 상태는 정상이다.

## 주의

- 로컬 DB 는 PGlite(`web/.pglite`)다. **서버가 떠 있는 동안 `npm run db:seed` 를 돌리면 서버는 옛 데이터를 본다.** 시드를 바꿨으면 `preview_stop` 후 다시 `preview_start`.
- 서버 콘솔에 `[auth][error] MissingSecret` 이 보이면 `AUTH_SECRET` 이 없는 것이다. 로컬은 자동 대체값으로 돌아가므로 무시해도 되지만, 배포 전에는 `npx auth secret` 으로 만들어 넣는다.
- `.env*` 는 읽지도 쓰지도 않는다. 값이 필요하면 사용자에게 `.env.example` 을 채우라고 한다.

## 자주 보는 주소

- `/` 랭킹, `/c/engineering` 카테고리, `/p/sidex` 제품, `/submit` 등록, `/u/sidex` 프로필, `/login`, `/search?q=`
