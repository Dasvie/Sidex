import { defineConfig } from "@playwright/test";

/* End-to-end checks against the dev server (development = signed in as @sidex, uploads to
   public/uploads). Uses the installed Chrome, so no browser download.
   Run: npm run e2e (dev server must be up on :3000). */
export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    channel: "chrome",
    headless: true,
    viewport: { width: 1280, height: 900 },
    locale: "ko-KR",
    trace: "retain-on-failure",
  },
});
