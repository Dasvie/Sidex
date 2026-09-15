import test from "node:test";
import assert from "node:assert/strict";
import { parseDevEvents } from "../src/lib/devevent";

const md = `
## \`26년 08월\`
- __[지난 행사](https://a.b/old)__
  - 분류: \`온라인\`
  - 접수: 08. 01(토) ~ 08. 10(월)

## \`26년 09월\`
- __[[웨비나]클라우드 데이](https://a.b/one)__
  - 분류: \`온라인\`, \`무료\`, \`세미나\`
  - 주최: 클래스메소드코리아
  - 접수: 08. 28(금) ~ 09. 30(수) 23:30
- __[끝난 밋업](https://a.b/two)__
  - 분류: \`오프라인\`
  - 주최: 누군가
  - 일시: 09. 02(수) 19:00

## \`26년 10월\`
- __[해커톤](https://a.b/three)__
  - 분류: \`오프라인\`, \`유료\`
  - 주최: 재단
  - 접수: 09. 20(일) ~ 10. 05(월)
`;

test("reads this month and next, drops what has passed", () => {
  const now = new Date(2026, 8, 16); // 2026-09-16
  const e = parseDevEvents(md, now);
  assert.deepEqual(e.map((x) => x.title), ["[웨비나]클라우드 데이", "해커톤"]);
  assert.equal(e[0].host, "클래스메소드코리아");
  assert.deepEqual(e[0].tags, ["온라인", "무료", "세미나"]);
  assert.match(e[0].when, /09\. 30/);
});

test("an entry without dates is kept", () => {
  const e = parseDevEvents("## `26년 09월`\n- __[날짜 없음](https://a.b/x)__\n  - 주최: 누구\n", new Date(2026, 8, 16));
  assert.equal(e.length, 1);
});
