---
name: commit
description: 리뷰 통과 뒤 커밋. 한국어 메시지, 타입 접두사, 변경 이유 한 줄. 사용자가 커밋을 요청했을 때만.
---

# /commit

1. `git status` 로 범위를 확인한다. `.env*`, `web/.pglite`, `web/.next` 가 들어 있으면 멈춘다.
2. `cd web && npm run typecheck` 가 통과해야 한다.
3. 메시지: `feat|fix|design|docs|chore: 무엇을 (왜)`. 한국어. 한 줄이 넘으면 본문에 이유를 쓴다.
4. 마지막 줄에 이 세션의 attribution 을 붙인다.

예:
```
feat: 리뷰·논평 기반 랭킹으로 전환 (업보트 폐지, 날짜 순위 없음)
```
