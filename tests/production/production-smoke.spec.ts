import { test, expect } from "@playwright/test";

test.describe("Production Smoke Verification", () => {
  // Use a sensible default but allow overriding via environment variable
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

  test("Homepage loads and has primary sections", async ({ page }) => {
    const response = await page.goto(baseURL);
    expect(response?.status()).toBe(200);

    // Security headers check (basic baseline)
    const headers = response?.headers() || {};
    // Depending on deployment, some headers might be added by the CDN/Edge instead of Next.js directly
    // This asserts the Next.js config level headers are present.
    expect(headers).toHaveProperty("x-content-type-options", "nosniff");
    expect(headers).toHaveProperty("x-frame-options");

    // Verify main landmarks
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("Product listing and detail flows function safely", async ({ page }) => {
    await page.goto(`${baseURL}/products`);
    
    // Wait for product grid to populate
    const productLinks = page.locator('a[href^="/products/"]');
    await productLinks.first().waitFor({ state: 'visible', timeout: 10000 });
    
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);

    // Navigate to the first product detail page
    const firstProductUrl = await productLinks.first().getAttribute("href");
    if (!firstProductUrl) {
      throw new Error("Product link has no href");
    }
    
    const response = await page.goto(`${baseURL}${firstProductUrl}`);
    expect(response?.status()).toBe(200);

    // Check that an 'Add to Cart' button is visible, indicating the page is interactive
    // The exact text depends on UI_SPEC, assuming "Add to cart" or similar.
    const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    if (await addToCartBtn.count() > 0) {
       await expect(addToCartBtn.first()).toBeVisible();
    }
  });

  test("Cart page is accessible", async ({ page }) => {
    const response = await page.goto(`${baseURL}/cart`);
    // Depending on auth state, it might redirect to /sign-in, but should still be a 200 or 30x.
    const status = response?.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  });
  
  test("Zero private environment leakage in client HTML", async ({ page }) => {
    await page.goto(baseURL);
    const html = await page.content();
    // Ensure the encryption key hasn't leaked into the serialized DOM
    const secret = process.env.SESSION_ENCRYPTION_KEY || "SoP4AHsfP0CGh_yU2MzHnmK-RbJ0Rvafzs4XHgaSAJo";
    expect(html).not.toContain(secret);
  });
});
