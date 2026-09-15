/* The whole maker path, end to end, as @sidex (development sign-in):
   register a product from a URL with a pasted DESIGN.md → upload three screens → write a
   planning note → comment and reply → delete the product from the profile.
   Everything it creates is removed at the end; the test leaves no rows behind. */
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DESIGN_MD = readFileSync(join(__dirname, "../src/db/design/linear.md"), "utf8");
const SHOTS = [1, 2, 3].map((n) => join(__dirname, `../public/shots/linear-${n}.png`));
const TAG = "(e2e 삭제 예정)";

async function removeLeftovers(page: import("@playwright/test").Page) {
  // a failed earlier run may have left a tagged product behind
  await page.goto("/u/sidex");
  while (await page.locator(".manage li", { hasText: TAG }).count()) {
    const row = page.locator(".manage li", { hasText: TAG }).first();
    await row.getByRole("button", { name: "지우기" }).click();
    await row.getByRole("button", { name: "지우기" }).last().click();
    await page.waitForLoadState("networkidle");
    await page.goto("/u/sidex");
  }
}

test("register, upload screens, note, comment, reply, delete", async ({ page }) => {
  await removeLeftovers(page);
  // register
  await page.goto("/submit");
  await page.getByLabel("서비스 URL").fill("https://linear.app/");
  await expect(page.getByLabel("서비스명")).not.toHaveValue("", { timeout: 20_000 }); // read from the site
  await page.getByLabel("서비스명").fill(`Linear ${TAG}`);
  await page.getByLabel("한 줄 소개").fill("프로젝트 관리 도구 (e2e)");
  await page.locator('label:has(input[name="categories"][value="productivity"])').click(); // category chip
  await page.locator('label:has(input[name="topics"][value="productivity/project-management"])').click(); // topic chip
  await page.getByText("더 채우기").click();
  await page.getByLabel("DESIGN.md").fill(DESIGN_MD);
  await page.getByRole("button", { name: "등록", exact: true }).click();
  await page.waitForURL(/\/p\/linear-/, { timeout: 60_000 });
  const slug = new URL(page.url()).pathname.split("/").pop()!;

  // the product page: nudge for the maker, design system preview, raw file
  await expect(page.getByText("기획 지도에 3개만 적어 보세요")).toBeVisible();
  await expect(page.getByRole("heading", { name: "색상 팔레트" })).toBeVisible();
  await page.getByRole("tab", { name: "DESIGN.md" }).click();
  await expect(page.locator(".dm-raw")).toContainText("version: alpha");

  // upload three screens
  await page.locator("#up-shots").setInputFiles(SHOTS);
  await page.getByRole("button", { name: "화면 올리기" }).click();
  await expect(page.locator(".gallery__item")).toHaveCount(3, { timeout: 60_000 });

  // planning note at 문제 › 페인 포인트
  await page.goto(`/p/${slug}?node=f%2Fproblem%2Fpain-point`);
  await page.locator("textarea[name=body]").first().fill(`기록 ${TAG}`);
  await page.getByRole("button", { name: "기록 저장" }).click();
  await expect(page.locator(".plan__note .flash")).toBeVisible();
  await expect(page.locator(".nudge__dots i.is-on")).toHaveCount(1);

  // comment and reply
  await page.locator("#c-top").fill(`논평 ${TAG}`);
  await page.getByRole("button", { name: "논평 남기기" }).click();
  await expect(page.locator(".comment")).toHaveCount(1);
  await page.getByRole("button", { name: "답글", exact: true }).click();
  await page.locator("textarea[name=body]").last().fill(`답글 ${TAG}`);
  await page.getByRole("button", { name: "답글 남기기" }).click();
  await expect(page.locator(".comment--reply")).toHaveCount(1);

  // delete from the profile
  await page.goto("/u/sidex");
  const row = page.locator(".manage li", { hasText: TAG });
  await row.getByRole("button", { name: "지우기" }).click();
  await row.getByRole("button", { name: "지우기" }).last().click();
  await page.waitForURL(/\/u\/sidex$/);
  await expect(page.locator(".manage li", { hasText: TAG })).toHaveCount(0);
  // dev streams the not-found page with a 200, so the body is the check; production answers 404
  await page.goto(`/p/${slug}`);
  await expect(page.getByText("없는 페이지예요")).toBeVisible();
});
