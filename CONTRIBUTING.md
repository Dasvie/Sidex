# 기여하기

Sidex에 관심 가져 줘서 고마워요. 이슈와 PR 모두 환영해요.

## 시작하기

```bash
git clone https://github.com/Dasvie/Sidex.git
cd Sidex/web
npm install
cp .env.example .env.local   # 값은 비워도 로컬은 돌아가요
npm run db:migrate
npm run db:seed
npm run dev                  # http://localhost:3000, @sidex로 상시 로그인
```

## 끝났다의 기준

PR을 올리기 전에 이 세 줄이 통과해야 해요.

```bash
npm run typecheck && npm test && npm run build
npx playwright test e2e/smoke.spec.ts   # dev 서버를 켜 둔 채로
npm run e2e                             # 등록부터 삭제까지 한 바퀴
```

## 지키는 것

- **가상의 데이터·문구를 넣지 않아요.** 시드는 실제 사이트에서 읽은 값만. 모르는 값은 `-`.
- **문구는 짧은 해요체.** `—`는 서비스 어디에도 쓰지 않아요. UI 문구는 `web/src/lib/i18n.ts` 한 곳(한국어·영어).
- **서체는 Pretendard 하나.** 색은 오프화이트 캔버스와 그린 CTA 하나.
- **순위 공식은 `web/src/lib/rank.ts` 한 곳.** 리뷰×3 + 논평×1 + 답글×0.5. 만든 사람의 논평 제외, 기획 기록 제외.
- **쓰기는 로그인 세션으로만.** 서버 액션은 `currentProfile()`로 시작하고 입력은 zod로 검사해요.
- **`.env*`는 만지지 않아요.** 키는 리포 어디에도 없어요.
- 스키마를 바꿨으면 `npm run db:generate` 결과(`web/drizzle/`)를 같이 올려요.

전체 규칙은 [CLAUDE.md](CLAUDE.md)에 있어요. 에이전트용이지만 사람이 읽어도 같은 내용이에요.

## 커밋과 PR

- 커밋 메시지는 영어, `feat:` `fix:` `docs:` `chore:` 접두사.
- PR 하나에 한 가지. 화면이 바뀌면 전후 캡처를 붙여 주세요.
- 이슈는 [템플릿](.github/ISSUE_TEMPLATE)을 따라 주세요. 재현 순서와 주소가 있으면 빨라요.
