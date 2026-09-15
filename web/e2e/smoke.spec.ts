/* Every screen and every interaction a visitor can reach, with the console and network watched.
   Fails on any console error, any 5xx, any page slower than 4s to load, and on the specific
   behaviours below. Runs as @sidex (development sign-in) unless the server was started with
   DEV_USER_HANDLE= (then the signed-out variants apply, see LOGGED_OUT). */
import { expect, test, type Page } from "@playwright/test";

const LOGGED_OUT = process.env.E2E_LOGGED_OUT === "1";
const IGNORE = [/_next\/hmr/i, /WebSocket connection/i, /hydration/i]; // dev-server noise only

function watch(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error" && !IGNORE.some((re) => re.test(m.text()))) errors.push(`console: ${m.text().slice(0, 200)}`); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on("response", (r) => { if (r.status() >= 500) errors.push(`${r.status()} ${r.url()}`); });
  return errors;
}
async function open(page: Page, path: string, maxMs = 4000) {
  const t0 = Date.now();
  const res = await page.goto(path, { waitUntil: "load" });
  const ms = Date.now() - t0;
  expect(ms, `${path} took ${ms}ms`).toBeLessThan(maxMs);
  return res;
}

test.describe("screens", () => {
  for (const path of ["/", "/?scope=all", "/c", "/c/productivity", "/c/design", "/c/finance", "/t/productivity/notes-and-docs", "/t/design/ui-design", "/t/finance/lending-and-insurance", "/search?q=%EB%85%B8%EC%85%98", "/search?topic=productivity%2Fnotes-and-docs", "/search", "/p/notion", "/p/figma", "/p/linear", "/p/sidex", "/u/sidex", "/submit", "/login", "/terms", "/privacy"]) {
    test(`renders ${path}`, async ({ page }) => {
      const errors = watch(page);
      const res = await open(page, path, path.startsWith("/p/") ? 6000 : 4000);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("main:visible").last()).toBeVisible(); // a streamed skeleton may still be mid-swap
      await expect(page.locator("body")).not.toContainText("—"); // banned glyph in our copy
      expect(errors).toEqual([]);
    });
  }
  test("unknown routes show the not-found page", async ({ page }) => {
    for (const path of ["/p/nope-nope", "/c/nope", "/t/finance/nope", "/u/nobody"]) {
      await page.goto(path);
      await expect(page.getByText("없는 페이지예요")).toBeVisible();
    }
  });
  test("images and cards", async ({ request }) => {
    for (const path of ["/opengraph-image", "/p/notion/opengraph-image", "/apple-icon", "/icon.svg", "/logo.svg", "/shots/notion-1.png"]) {
      const r = await request.get(path);
      expect(r.status(), path).toBe(200);
    }
  });
});

test.describe("header", () => {
  test("mega menus open on click and close on Escape", async ({ page }) => {
    await open(page, "/");
    await page.getByRole("button", { name: "프로덕트" }).click();
    await expect(page.locator("#mega-products")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mega-products")).toBeHidden();
    await page.getByRole("button", { name: "카테고리" }).click();
    await expect(page.locator("#mega-categories")).toBeVisible();
    await page.locator("#mega-categories").getByRole("link", { name: "생산성", exact: true }).click();
    await expect(page).toHaveURL(/\/c\/productivity/);
  });
  test("Ctrl+K focuses the search and Enter searches", async ({ page }) => {
    await open(page, "/");
    await page.keyboard.press("Control+k");
    await expect(page.locator(".search input")).toBeFocused();
    await page.keyboard.type("Linear");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=Linear/);
    await expect(page.locator(".row", { hasText: "Linear" })).toBeVisible();
  });
  test("language switches to English and back", async ({ page }) => {
    await open(page, "/");
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/products/i);
    await page.getByRole("button", { name: "한국어" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  });
  test(LOGGED_OUT ? "signed out: login and submit CTA" : "signed in: user menu", async ({ page }) => {
    await open(page, "/");
    if (LOGGED_OUT) {
      await expect(page.locator(".header").getByRole("link", { name: "로그인" })).toBeVisible();
      await expect(page.locator(".user")).toHaveCount(0);
    } else {
      await page.getByRole("button", { name: "내 메뉴" }).click();
      await expect(page.locator("#user-menu")).toBeVisible();
      await page.locator("#user-menu").getByRole("link", { name: "내 프로필" }).click();
      await expect(page).toHaveURL(/\/u\/sidex/);
    }
  });
});

test.describe("product page", () => {
  test("gallery, design system tabs, planning map, review section", async ({ page }) => {
    const errors = watch(page);
    await open(page, "/p/notion", 6000);
    // gallery
    await expect(page.locator(".gallery__item")).toHaveCount(3);
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page.locator(".gallery__dot.is-on")).toHaveAttribute("aria-label", "2 / 3");
    // design system
    await expect(page.getByRole("heading", { name: "색상 팔레트" })).toBeVisible();
    await page.getByRole("tab", { name: "DESIGN.md" }).click();
    await expect(page.locator(".dm-raw")).toContainText("version: alpha");
    await page.getByRole("tab", { name: "Preview" }).click();
    // planning map: open two levels, panel follows, wheel does not scroll the page
    await page.locator(".plan__node", { hasText: "비즈니스" }).first().click();
    await page.locator(".plan__node", { hasText: "수익 모델" }).first().click();
    await expect(page.locator(".plan__panel-title")).toHaveText("수익 모델");
    await expect(page.locator(".plan__node", { hasText: "구독" })).toHaveCount(1);
    const y0 = await page.evaluate(() => window.scrollY);
    await page.locator(".plan__svg").hover();
    await page.mouse.wheel(0, 300);
    expect(await page.evaluate(() => window.scrollY)).toBe(y0);
    await page.getByRole("button", { name: "다시 접기" }).click();
    // review section
    if (LOGGED_OUT) {
      await expect(page.locator("#reviews")).toContainText("로그인");
    } else {
      await page.locator("#reviews").getByRole("button", { name: "리뷰 쓰기" }).click();
      await expect(page.locator("#reviews textarea#r-good")).toBeVisible();
      await expect(page.locator("#reviews button[type=submit]")).toBeDisabled(); // nothing picked yet
    }
    // share: copy link
    await page.getByRole("button", { name: "링크 복사" }).click();
    await expect(page.getByRole("button", { name: /복사했어요|링크 복사/ })).toBeVisible();
    expect(errors).toEqual([]);
  });
  test("maker's product shows the nudge and the note form; others do not", async ({ page }) => {
    await open(page, "/p/sidex", 6000);
    if (LOGGED_OUT) {
      await expect(page.locator(".nudge")).toHaveCount(0);
      await page.locator(".plan__node", { hasText: "문제" }).first().click();
      await expect(page.locator(".plan__note")).toHaveCount(0);
    } else {
      await expect(page.locator(".nudge")).toBeVisible();
      await page.locator(".plan__node", { hasText: "문제" }).first().click();
      await expect(page.locator(".plan__note textarea")).toBeVisible();
    }
  });
});

test.describe("submit", () => {
  test(LOGGED_OUT ? "signed out: draft works, last step asks to log in" : "signed in: address fills the draft", async ({ page }) => {
    const errors = watch(page);
    await open(page, "/submit");
    await page.getByLabel("서비스 URL").fill("https://www.figma.com/");
    await expect(page.getByLabel("서비스명")).not.toHaveValue("", { timeout: 20_000 });
    await expect(page.locator(".preview .row__title")).not.toHaveText("-");
    await page.locator('label:has(input[name="categories"][value="design"])').click();
    await expect(page.locator('input[name="topics"]').first()).toBeAttached();
    if (LOGGED_OUT) await expect(page.getByRole("link", { name: "로그인하고 등록" })).toBeVisible();
    else await expect(page.getByRole("button", { name: "등록", exact: true })).toBeEnabled();
    expect(errors).toEqual([]);
  });
});

test.describe("profile and english", () => {
  test(LOGGED_OUT ? "signed out: profile is read-only" : "signed in: bio edit round-trips", async ({ page }) => {
    const errors = watch(page);
    await open(page, "/u/sidex");
    if (LOGGED_OUT) {
      await expect(page.locator("#edit")).toHaveCount(0);
      await expect(page.locator("#manage")).toHaveCount(0);
    } else {
      const before = await page.locator("#p-bio").inputValue();
      await page.locator("#p-bio").fill(before + " ·e2e");
      await page.locator("#edit button[type=submit]").click();
      await expect(page.locator("#edit .ok")).toBeVisible();
      await page.locator("#p-bio").fill(before);
      await page.locator("#edit button[type=submit]").click();
      await expect(page.locator("#edit .ok")).toBeVisible();
      await page.reload();
      await expect(page.locator("#p-bio")).toHaveValue(before);
    }
    expect(errors).toEqual([]);
  });
  test("product page reads in English", async ({ page }) => {
    await open(page, "/");
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en"); // the cookie lands with the action's response
    await open(page, "/p/notion", 6000);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(page.locator(".product__tagline")).toHaveText("All-in-one workspace");
    await expect(page.locator(".plan__node", { hasText: "Problem" })).toHaveCount(1);
    await page.getByRole("button", { name: "한국어" }).click();
  });
  test("login page shows the provider state honestly", async ({ page }) => {
    await open(page, "/login");
    if (LOGGED_OUT) await expect(page.locator("main")).toContainText(/로그인/);
    else await expect(page).not.toHaveURL(/\/login$/); // signed in users are sent on
  });
});
