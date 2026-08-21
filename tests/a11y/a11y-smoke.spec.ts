import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import http from "http";

import signinFixture from "../fixtures/api/signin.success.json";
import getProductsFixture from "../fixtures/api/get-products.success.json";
import getProductFixture from "../fixtures/api/get-product.success.json";
import getCategoriesFixture from "../fixtures/api/get-categories.success.json";
import getWishlistFixture from "../fixtures/api/get-wishlist.success.json";
import getOrdersFixture from "../fixtures/api/get-orders.success.json";
import getCartFixture from "../fixtures/api/get-cart.success.json";
import getAddressesFixture from "../fixtures/api/get-addresses.success.json";

const nowEpoch = Math.floor(Date.now() / 1_000) + 3_600;
function generateValidToken(): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ fixture: true })}.${encode({ exp: nowEpoch, id: "user_12345" })}.fixture-signature`;
}

let mockServer: http.Server;
const validToken = generateValidToken();

test.beforeAll(async () => {
  // Start mock HTTP server on port 3001
  mockServer = http.createServer((req, res) => {
    const url = req.url || "";
    res.setHeader("Content-Type", "application/json");

    if (url.includes("/api/v1/categories")) {
      res.writeHead(200);
      res.end(JSON.stringify(getCategoriesFixture));
    } else if (url.includes("/api/v1/brands")) {
      res.writeHead(200);
      res.end(JSON.stringify({ data: [] }));
    } else if (url.includes("/api/v1/products/product-fixture-1")) {
      res.writeHead(200);
      res.end(JSON.stringify(getProductFixture));
    } else if (url.includes("/api/v1/products")) {
      res.writeHead(200);
      res.end(JSON.stringify(getProductsFixture));
    } else if (url.includes("/api/v1/auth/signin")) {
      res.writeHead(200);
      res.end(JSON.stringify({ ...signinFixture, token: validToken }));
    } else if (url.includes("/api/v1/wishlist")) {
      res.writeHead(200);
      res.end(JSON.stringify(getWishlistFixture));
    } else if (url.includes("/api/v1/orders/user/")) {
      res.writeHead(200);
      res.end(JSON.stringify(getOrdersFixture));
    } else if (url.includes("/api/v1/cart")) {
      res.writeHead(200);
      res.end(JSON.stringify(getCartFixture));
    } else if (url.includes("/api/v1/addresses")) {
      res.writeHead(200);
      res.end(JSON.stringify(getAddressesFixture));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Not Found" }));
    }
  });

  await new Promise<void>((resolve) => mockServer.listen(3001, resolve));
});

test.afterAll(async () => {
  await new Promise<void>((resolve) => mockServer.close(() => resolve()));
});

test.describe("Accessibility Smoke Tests", () => {
  const checkA11y = async (page: Page, path: string) => {
    await page.goto(path);
    // Wait for page hydration
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag21a", "wcag2aa", "wcag21aa"])
      .analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    if (criticalOrSerious.length > 0) {
      console.error(`A11y Violations on ${path}:`, JSON.stringify(criticalOrSerious, null, 2));
    }

    expect(criticalOrSerious).toHaveLength(0);
  };

  test("Home Page accessibility", async ({ page }) => {
    await checkA11y(page, "/");
  });

  test("Products Catalog accessibility", async ({ page }) => {
    await checkA11y(page, "/products");
  });

  test("Product Details Page accessibility", async ({ page }) => {
    await checkA11y(page, "/products/product-fixture-1");
  });

  test("Sign In Page accessibility", async ({ page }) => {
    await checkA11y(page, "/sign-in");
  });

  test("Sign Up Page accessibility", async ({ page }) => {
    await checkA11y(page, "/sign-up");
  });

  test("Authenticated routes accessibility flow", async ({ page }) => {
    // Perform Sign In to establish session cookie
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', "jane.doe@example.com");
    await page.fill('input[name="password"]', "Pass1234");
    await page.click('button[type="submit"]');

    // Wait for client-side redirect to the home page (returnTo defaults to "/")
    await expect(page).toHaveURL("http://localhost:3000/");

    // Now test protected routes
    await checkA11y(page, "/cart");
    await checkA11y(page, "/checkout");
    await checkA11y(page, "/account/orders");
    await checkA11y(page, "/wishlist");
  });
});
