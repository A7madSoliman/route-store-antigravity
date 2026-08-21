import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/responsive',
  // Use the same baseURL as the main config
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Increase timeout for visual diff generation
  timeout: 60_000,
  expect: {
    // Adjust screenshot comparison tolerance if needed
    toMatchSnapshot: { threshold: 0.1 },
  },
});
