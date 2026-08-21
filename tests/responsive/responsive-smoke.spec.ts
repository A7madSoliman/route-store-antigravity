import { test, expect, type Page } from '@playwright/test';

// Primary routes to test
const routes = [
  '/',
  '/products',
  '/products/product-fixture-1', // example product
  '/cart',
  '/checkout',
  '/sign-in',
  '/sign-up',
  '/account/orders',
  '/wishlist',
];

// Helper to navigate and take a screenshot
async function checkResponsive(page: Page, path: string, viewportName: string) {
  await page.goto(path);
  // Wait for potential hydration / network idle
  await page.waitForLoadState('networkidle');
  // Take screenshot and compare to baseline
  await expect(page).toHaveScreenshot(`${viewportName}-${path.replaceAll('/', '-')}.png`, {
    // Allow small visual variance
    threshold: 0.1,
  });
}

// Mobile viewport tests
test.describe('mobile viewport (375x800)', () => {
  test.use({ viewport: { width: 375, height: 800 } });
  for (const route of routes) {
    test(`visual regression for ${route}`, async ({ page }) => {
      await checkResponsive(page, route, 'mobile');
    });
  }
});

// Tablet viewport tests
test.describe('tablet viewport (768x1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });
  for (const route of routes) {
    test(`visual regression for ${route}`, async ({ page }) => {
      await checkResponsive(page, route, 'tablet');
    });
  }
});

// Desktop viewport tests
test.describe('desktop viewport (1024x768)', () => {
  test.use({ viewport: { width: 1024, height: 768 } });
  for (const route of routes) {
    test(`visual regression for ${route}`, async ({ page }) => {
      await checkResponsive(page, route, 'desktop');
    });
  }
});

// Wide viewport tests
test.describe('wide viewport (1440x900)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  for (const route of routes) {
    test(`visual regression for ${route}`, async ({ page }) => {
      await checkResponsive(page, route, 'wide');
    });
  }
});
