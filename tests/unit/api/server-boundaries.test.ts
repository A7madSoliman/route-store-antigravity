// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const serverRoots = [
  "lib/api/errors.server.ts",
  "lib/api/transport/public-request.server.ts",
  "lib/api/transport/protected-request.server.ts",
  "lib/api/query/product-query.server.ts",
  "lib/api/schemas/catalog-entities.schema.server.ts",
  "lib/api/schemas/pagination.schema.server.ts",
  "lib/api/schemas/parse-response.server.ts",
  "lib/api/schemas/get-products-response.schema.server.ts",
  "lib/api/schemas/get-product-response.schema.server.ts",
  "lib/api/schemas/get-categories-response.schema.server.ts",
  "lib/api/schemas/get-category-response.schema.server.ts",
  "lib/api/schemas/get-subcategories-response.schema.server.ts",
  "lib/api/schemas/get-subcategory-response.schema.server.ts",
  "lib/api/schemas/get-category-subcategories-response.schema.server.ts",
  "lib/api/schemas/get-brands-response.schema.server.ts",
  "lib/api/schemas/get-brand-response.schema.server.ts",
  "lib/api/adapters/product.adapter.server.ts",
  "lib/api/adapters/category.adapter.server.ts",
  "lib/api/adapters/subcategory.adapter.server.ts",
  "lib/api/adapters/brand.adapter.server.ts",
  "lib/api/endpoints/public/products.server.ts",
  "lib/api/endpoints/public/categories.server.ts",
  "lib/api/endpoints/public/subcategories.server.ts",
  "lib/api/endpoints/public/brands.server.ts",
  "lib/api/endpoints/public/signup.server.ts",
  "lib/api/schemas/signup-response.schema.server.ts",
  "lib/api/endpoints/public/forgot-password.server.ts",
  "lib/api/schemas/forgot-password-response.schema.server.ts",
  "lib/media/api-image.server.ts",
  "lib/auth/session-codec.server.ts",
  "lib/auth/session.server.ts",
  "lib/auth/require-session.server.ts",
  "lib/auth/return-to.server.ts",
  "lib/auth/protected-route.server.ts",
  "features/auth/sign-up-form.schema.server.ts",
  "features/auth/sign-in-form.schema.server.ts",
  "features/auth/forgot-password-form.schema.server.ts",
  "features/auth/verify-reset-code-form.schema.server.ts",
  "features/auth/reset-password-form.schema.server.ts",
  "lib/api/endpoints/public/verify-reset-code.server.ts",
  "lib/api/schemas/verify-reset-code-response.schema.server.ts",
  "lib/api/endpoints/public/reset-password.server.ts",
  "lib/api/schemas/reset-password-response.schema.server.ts",
  "lib/api/endpoints/public/signin.server.ts",
  "lib/api/schemas/signin-response.schema.server.ts",
  "lib/api/schemas/get-wishlist-response.schema.server.ts",
  "lib/api/schemas/add-to-wishlist-response.schema.server.ts",
  "lib/api/adapters/wishlist.adapter.server.ts",
  "lib/api/endpoints/protected/wishlist.server.ts",
  "lib/api/endpoints/protected/add-to-wishlist.server.ts",
];

describe("C01 server boundaries", () => {
  it("marks every server runtime root with server-only", () => {
    for (const path of serverRoots) {
      expect(readFileSync(path, "utf8"), path).toMatch(/^import ["']server-only["'];/u);
    }
  });

  it("keeps domain declarations free of runtime imports", () => {
    for (const path of ["types/catalog-page.ts", "types/product.ts", "types/category.ts", "types/subcategory.ts", "types/brand.ts", "types/wishlist.ts"]) {
      expect(readFileSync(path, "utf8"), path).not.toMatch(/^import /mu);
    }
  });
});
