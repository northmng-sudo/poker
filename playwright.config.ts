import { defineConfig, devices } from "@playwright/test";

// Phase 4-өөс хойш бодит e2e тест (2 browser context-той нэг гар тоглох гэх мэт)
// нэмэгдэнэ. Одоогоор Phase 1-ийн auth урсгалыг шалгах суурь тохиргоо.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run preview -- --port 4173",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173",
    trace: "on-first-retry",
  },
  // Sandbox/CI орчинд Chromium урьдчилан өөр байршилд суулгагдсан бол
  // PLAYWRIGHT_CHROMIUM_PATH-аар binary-ийн замыг зааж болно.
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : {},
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"],
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : {},
      },
    },
  ],
});
