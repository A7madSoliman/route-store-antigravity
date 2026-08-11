// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/products.server", () => ({ getProducts: vi.fn() }));
vi.mock("@/lib/api/endpoints/public/categories.server", () => ({ getCategories: vi.fn() }));
vi.mock("@/lib/api/endpoints/public/brands.server", () => ({ getBrands: vi.fn() }));

import { getBrands } from "@/lib/api/endpoints/public/brands.server";
import { getCategories } from "@/lib/api/endpoints/public/categories.server";
import { getProducts } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { loadProductListing } from "@/features/catalog/product-listing-data.server";

const category = { id: "category-1", name: "Category", slug: "category", imageUrl: null } as const;
const brand = { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } as const;
const product = { id: "product-1", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand } as const;
const productPage = (items = [product]) => ({ items, total: items.length, pagination: { currentPage: 1, numberOfPages: 2, limit: 40, nextPage: 2 } });
const categoryPage = { items: [category], total: 1, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } };
const brandPage = { items: [brand], total: 1, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } };

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getProducts).mockResolvedValue(productPage());
  vi.mocked(getCategories).mockResolvedValue(categoryPage);
  vi.mocked(getBrands).mockResolvedValue(brandPage);
});

describe("C09 product listing loader", () => {
  it.each([
    [{}, undefined],
    [{ page: "2" }, { kind: "page", page: 2 }],
    [{ sort: "price" }, { kind: "sort", sort: "price" }],
    [{ sort: "-price" }, { kind: "sort", sort: "-price" }],
    [{ "price[gte]": "10" }, { kind: "price", minimum: 10 }],
    [{ "price[lte]": "20" }, { kind: "price", maximum: 20 }],
    [{ "price[gte]": "10", "price[lte]": "20" }, { kind: "price", minimum: 10, maximum: 20 }],
    [{ brand: "brand/one" }, { kind: "brand", brandId: "brand/one" }],
    [{ "category[in]": "category/one" }, { kind: "categories", categoryIds: ["category/one"] }],
    [{ "category[in]": ["category/one", "category/two"] }, { kind: "categories", categoryIds: ["category/one", "category/two"] }],
    [{ "category[in]": "category/one", sort: "price" }, { kind: "category-sort", categoryId: "category/one", sort: "price" }],
    [{ "category[in]": "category/one", brand: "brand/one" }, { kind: "category-brand", categoryId: "category/one", brandId: "brand/one" }],
  ] as const)("maps %o to %o", async (searchParams, expected) => {
    await loadProductListing(searchParams);
    expect(vi.mocked(getProducts).mock.calls[0]?.[0]).toEqual(expected);
  });

  it.each([
    { page: "3" }, { page: ["2", "2"] }, { sort: "name" }, { sort: ["price", "-price"] },
    { brand: "" }, { brand: ["brand-1", "brand-2"] }, { "category[in]": "" },
    { "category[in]": ["category-1", "category-1"] }, { "category[in]": ["a", "b", "c"] },
    { "category[in]": "a,b" }, { "price[gte]": ["1", "2"] }, { "price[gte]": "-1" },
    { "price[gte]": "1e2" }, { "price[gte]": "10", "price[lte]": "2" },
    { page: "2", sort: "price" }, { brand: "b", sort: "price" }, { brand: "b", "price[gte]": "1" },
    { "category[in]": "c", sort: "-price" }, { "category[in]": ["a", "b"], brand: "b" },
    { keyword: "shirt" }, { fields: "title" }, { limit: "2" }, { subcategory: "c" }, { foo: "bar" },
  ])("falls back to baseline for unsupported %o", async (searchParams) => {
    await loadProductListing(searchParams);
    expect(getProducts).toHaveBeenCalledWith(undefined);
  });

  it("loads products, categories, and brands once and maps options to id/name", async () => {
    const result = await loadProductListing({});
    expect(getProducts).toHaveBeenCalledOnce();
    expect(getCategories).toHaveBeenCalledOnce();
    expect(getBrands).toHaveBeenCalledOnce();
    expect(result.categories).toEqual({ status: "ready", items: [{ id: "category-1", name: "Category" }] });
    expect(result.brands).toEqual({ status: "ready", items: [{ id: "brand-1", name: "Brand" }] });
  });

  it("keeps products when an option endpoint has a known error", async () => {
    vi.mocked(getCategories).mockRejectedValue(new PublicApiError("unavailable"));
    const result = await loadProductListing({});
    expect(result.products.status).toBe("ready");
    expect(result.categories).toEqual({ status: "error" });
  });

  it("keeps ready and empty product results distinct", async () => {
    vi.mocked(getProducts).mockResolvedValue(productPage([]));
    await expect(loadProductListing({})).resolves.toMatchObject({ products: { status: "empty" } });
  });

  it("rethrows unexpected endpoint errors", async () => {
    vi.mocked(getProducts).mockRejectedValue(new Error("programming failure"));
    await expect(loadProductListing({})).rejects.toThrow("programming failure");
  });
});
