// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import products from "@/tests/fixtures/api/get-products.success.json";
import emptyProducts from "@/tests/fixtures/api/get-products.empty.json";
import product from "@/tests/fixtures/api/get-product.success.json";
import categories from "@/tests/fixtures/api/get-categories.success.json";
import category from "@/tests/fixtures/api/get-category.success.json";
import subcategories from "@/tests/fixtures/api/get-subcategories.success.json";
import subcategory from "@/tests/fixtures/api/get-subcategory.success.json";
import categorySubcategories from "@/tests/fixtures/api/get-category-subcategories.success.json";
import brands from "@/tests/fixtures/api/get-brands.success.json";
import brand from "@/tests/fixtures/api/get-brand.success.json";
import { parsePublicResponse } from "@/lib/api/schemas/parse-response.server";
import { GetProductsResponseSchema } from "@/lib/api/schemas/get-products-response.schema.server";
import { GetProductResponseSchema } from "@/lib/api/schemas/get-product-response.schema.server";
import { GetCategoriesResponseSchema } from "@/lib/api/schemas/get-categories-response.schema.server";
import { GetCategoryResponseSchema } from "@/lib/api/schemas/get-category-response.schema.server";
import { GetSubcategoriesResponseSchema } from "@/lib/api/schemas/get-subcategories-response.schema.server";
import { GetSubcategoryResponseSchema } from "@/lib/api/schemas/get-subcategory-response.schema.server";
import { GetCategorySubcategoriesResponseSchema } from "@/lib/api/schemas/get-category-subcategories-response.schema.server";
import { GetBrandsResponseSchema } from "@/lib/api/schemas/get-brands-response.schema.server";
import { GetBrandResponseSchema } from "@/lib/api/schemas/get-brand-response.schema.server";

describe("catalog response schemas", () => {
  it("parses every verified list and detail fixture", () => {
    expect(parsePublicResponse(GetProductsResponseSchema, products).data).toHaveLength(1);
    expect(parsePublicResponse(GetProductsResponseSchema, emptyProducts).data).toHaveLength(0);
    expect(parsePublicResponse(GetProductResponseSchema, product).data._id).toBe("product-detail-fixture-1");
    expect(parsePublicResponse(GetCategoriesResponseSchema, categories).data).toHaveLength(1);
    expect(parsePublicResponse(GetCategoryResponseSchema, category).data._id).toBe("category-detail-fixture-1");
    expect(parsePublicResponse(GetSubcategoriesResponseSchema, subcategories).data).toHaveLength(1);
    expect(parsePublicResponse(GetSubcategoryResponseSchema, subcategory).data._id).toBe("subcategory-detail-fixture-1");
    expect(parsePublicResponse(GetCategorySubcategoriesResponseSchema, categorySubcategories).data).toHaveLength(1);
    expect(parsePublicResponse(GetBrandsResponseSchema, brands).data).toHaveLength(1);
    expect(parsePublicResponse(GetBrandResponseSchema, brand).data._id).toBe("brand-detail-fixture-1");
  });

  it("rejects malformed envelopes, entities, and pagination", () => {
    expect(() => parsePublicResponse(GetProductsResponseSchema, { data: [] })).toThrow("invalid response");
    expect(() => parsePublicResponse(GetProductResponseSchema, { data: { _id: "missing-core" } })).toThrow("invalid response");
    expect(() => parsePublicResponse(GetCategoriesResponseSchema, { ...categories, metadata: { currentPage: 1 } })).toThrow("invalid response");
  });

  it("keeps missing or malformed media at the adapter boundary", () => {
    const value = structuredClone(products) as { data: Array<Record<string, unknown>> };
    value.data[0].imageCover = { unexpected: true };
    value.data[0].images = "not-an-array";
    value.data[0].category = { ...(value.data[0].category as object), image: undefined };
    expect(() => parsePublicResponse(GetProductsResponseSchema, value)).not.toThrow();
  });
});
