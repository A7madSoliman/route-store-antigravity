// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/transport/public-request.server", () => ({ publicGet: vi.fn() }));

import products from "@/tests/fixtures/api/get-products.success.json";
import product from "@/tests/fixtures/api/get-product.success.json";
import categories from "@/tests/fixtures/api/get-categories.success.json";
import category from "@/tests/fixtures/api/get-category.success.json";
import subcategories from "@/tests/fixtures/api/get-subcategories.success.json";
import subcategory from "@/tests/fixtures/api/get-subcategory.success.json";
import categorySubcategories from "@/tests/fixtures/api/get-category-subcategories.success.json";
import brands from "@/tests/fixtures/api/get-brands.success.json";
import brand from "@/tests/fixtures/api/get-brand.success.json";
import { publicGet } from "@/lib/api/transport/public-request.server";
import { getProducts, getProduct } from "@/lib/api/endpoints/public/products.server";
import { getCategories, getCategory, getCategorySubcategories } from "@/lib/api/endpoints/public/categories.server";
import { getSubcategories, getSubcategory } from "@/lib/api/endpoints/public/subcategories.server";
import { getBrands, getBrand } from "@/lib/api/endpoints/public/brands.server";

const publicGetMock = vi.mocked(publicGet);

beforeEach(() => publicGetMock.mockReset());

describe("public catalog endpoint modules", () => {
  it("uses exact paths for all nine reads", async () => {
    publicGetMock
      .mockResolvedValueOnce(products)
      .mockResolvedValueOnce(product)
      .mockResolvedValueOnce(categories)
      .mockResolvedValueOnce(category)
      .mockResolvedValueOnce(subcategories)
      .mockResolvedValueOnce(subcategory)
      .mockResolvedValueOnce(categorySubcategories)
      .mockResolvedValueOnce(brands)
      .mockResolvedValueOnce(brand);

    await getProducts();
    await getProduct("product-fixture-1");
    await getCategories();
    await getCategory("category-fixture-1");
    await getSubcategories();
    await getSubcategory("subcategory-fixture-1");
    await getCategorySubcategories("category-fixture-1");
    await getBrands();
    await getBrand("brand-fixture-1");

    expect(publicGetMock.mock.calls.map(([path]) => path)).toEqual([
      ["products"],
      ["products", "product-fixture-1"],
      ["categories"],
      ["categories", "category-fixture-1"],
      ["subcategories"],
      ["subcategories", "subcategory-fixture-1"],
      ["categories", "category-fixture-1", "subcategories"],
      ["brands"],
      ["brands", "brand-fixture-1"],
    ]);
  });

  it("serializes every approved product query and returns the adapted page", async () => {
    publicGetMock.mockResolvedValue(products);
    const result = await getProducts({ kind: "category-brand", categoryId: "category-1", brandId: "brand-1" });
    expect(result.items[0]?.id).toBe("product-fixture-1");
    expect(publicGetMock).toHaveBeenCalledWith(
      ["products"],
      new URLSearchParams([["category[in]", "category-1"], ["brand", "brand-1"]]),
    );
  });

  it("turns malformed upstream data into a safe invalid-response error", async () => {
    publicGetMock.mockResolvedValue({ data: [] });
    await expect(getProduct("product-fixture-1")).rejects.toMatchObject({ code: "invalid-response" });
  });
});
