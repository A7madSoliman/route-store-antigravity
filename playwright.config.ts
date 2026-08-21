import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/a11y",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 120_000,
    env: {
      ECOMMERCE_API_BASE_URL: "https://ecommerce.routemisr.com/api/v1",
      SESSION_ENCRYPTION_KEY: "SoP4AHsfP0CGh_yU2MzHnmK-RbJ0Rvafzs4XHgaSAJo",
      APP_ORIGIN: "http://localhost:3000",
      NODE_OPTIONS: "--require ./tests/a11y/preload.js",
    },
  },
});
