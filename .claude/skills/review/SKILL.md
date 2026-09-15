---
name: review
description: 커밋 전 코드 리뷰. 서비스 규칙(실제 값만, 대시 금지, 한국어 전용, CTA 하나) 과 보안(쓰기는 로그인 세션, 입력 검증, 자기 리뷰 금지) 을 확인한다.
---

# /review

`git diff` (또는 지정한 파일) 를 읽고 아래를 판정한다. 통과하면 "통과", 아니면 파일:줄 과 고칠 방향.

## 서비스 규칙
- 화면 문구에 "—" 없음. 영문 용어는 그대로, 설명은 우리말.
- 사용자가 실제로 준 값만 저장한다. 기본값을 지어내지 않는다(빈 문자열·null 이 정답).
- 다국어 코드 없음(한국어 한 벌).
- CTA 그린 pill 은 화면당 하나.

## 데이터·보안
- 쓰기 액션은 `currentProfile()` 로 시작한다. 없으면 한국어 오류 문구를 돌려준다.
- 입력은 zod 로 길이·형식 검증. `innerHTML`/`dangerouslySetInnerHTML` 없음.
- 리뷰: 작성자 1인 1건, 만든 사람 불가. 논평: 답글 1단.
- 집계는 `refreshAggregates()` 로만. 랭킹은 `rank.ts` 한 곳.
- 업로드는 `uploadImage()` 로만(형식·크기 검사).
- `.env*` 를 읽거나 값을 코드에 박지 않았다.

## 코드
- Server Component 가 기본. `"use client"` 는 상태·이벤트가 필요한 컴포넌트만.
- `params`/`searchParams` 는 `await`.
- 죽은 코드는 지우지 말고 `docs/tech-debt.md` 에 적는다.
