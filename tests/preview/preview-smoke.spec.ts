import { test, expect, Page } from '@playwright/test';

// Routes to verify in preview environment
const routes = [
  '/',
  '/products',
  '/products/product-fixture-1',
  '/cart',
  '/checkout',
  '/sign-in',
  '/sign-up',
  '/account/orders',
  '/wishlist',
];

// Helper to check a page for HTTP 200, security headers, and absence of secret strings
async function checkPage(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  const headers = response?.headers();
  expect(headers?.['strict-transport-security']).toBeDefined();
  expect(headers?.['x-content-type-options']).toBe('nosniff');
  expect(headers?.['x-frame-options']).toBe('DENY');
  expect(headers?.['referrer-policy']).toBe('no-referrer');
  const content = await page.content();
  const secretPatterns = [/SESSION_ENCRYPTION_KEY/, /token/i, /secret/i];
  for (const pat of secretPatterns) {
    expect(content).not.toMatch(pat);
  }
}

for (const route of routes) {
  test(`GET ${route} should be secure and secret‑free`, async ({ page }) => {
    await checkPage(page, route);
  });
}
