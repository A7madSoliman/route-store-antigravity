// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

// Mock the transport layer
const { get } = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/lib/api/transport/public-request.server", () => ({
  publicGetJson: get,
  publicGet: get,
}));

vi.mock("@/lib/env/server", () => ({
  getServerEnvironment: vi.fn(() => ({
    ecommerceApiBaseUrl: "https://ecommerce.routemisr.com/api/v1",
    appOrigin: "http://localhost:3000",
  })),
  EnvironmentValidationError: class EnvironmentValidationError extends Error {},
}));

const { notFoundMock } = vi.hoisted(() => ({ notFoundMock: vi.fn() }));
vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

import { loadProductListing } from "@/features/catalog/product-listing-data.server";
import { loadProductDetail } from "@/features/catalog/product-detail-data.server";
import { loadCategoryDirectory } from "@/features/catalog/category-directory-data.server";
import { PublicApiError } from "@/lib/api/errors.server";

import getProductsFixture from "../fixtures/api/get-products.success.json";
import getProductFixture from "../fixtures/api/get-product.success.json";
import getCategoriesFixture from "../fixtures/api/get-categories.success.json";
import getProductsEmptyFixture from "../fixtures/api/get-products.empty.json";

beforeEach(() => {
  get.mockReset();
  notFoundMock.mockReset();
});

describe("Catalog Navigation Flow Integration", () => {
  it("loads categories successfully", async () => {
    get.mockResolvedValueOnce(getCategoriesFixture);
    const categories = await loadCategoryDirectory();
    expect(get).toHaveBeenCalledWith(["categories"]);
    expect(categories.status).toBe("ready");
    if (categories.status === "ready") {
      expect(categories.page.items).toHaveLength(getCategoriesFixture.data.length);
      expect(categories.page.items[0].name).toBe(getCategoriesFixture.data[0].name);
    }
  });

  it("loads products with search params and maps correctly", async () => {
    get.mockResolvedValueOnce(getProductsFixture); // for products
    get.mockResolvedValueOnce(getCategoriesFixture); // for categories
    get.mockResolvedValueOnce({ data: [] }); // for brands
    // Query string translates to category-sort in this implementation?
    // Wait, let's just use a simpler query that maps predictably to 'sort'
    const result = await loadProductListing({ sort: "price" });
    
    expect(get).toHaveBeenCalledTimes(3);
    const searchParams = get.mock.calls[0][1] as URLSearchParams;
    expect(searchParams.get("sort")).toBe("price");
    
    expect(result.products.status).toBe("ready");
    if (result.products.status === "ready") {
      expect(result.products.page.items).toHaveLength(getProductsFixture.data.length);
      expect(result.products.page.items[0].title).toBe(getProductsFixture.data[0].title);
    }
  });

  it("returns empty result on empty catalog response", async () => {
    get.mockResolvedValueOnce(getProductsEmptyFixture);
    get.mockResolvedValueOnce(getCategoriesFixture);
    get.mockResolvedValueOnce({ data: [] });
    const result = await loadProductListing({ category: "unknown" });
    expect(result.products.status).toBe("empty");
  });

  it("loads product details successfully", async () => {
    get.mockResolvedValueOnce(getProductFixture);
    const result = await loadProductDetail("some-product-id");
    expect(get).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.product.title).toBe(getProductFixture.data.title);
    }
  });

  it("triggers notFound when product details are missing (404)", async () => {
    get.mockRejectedValueOnce(new PublicApiError("not-found", 404));
    
    try {
      await loadProductDetail("invalid-id");
    } catch {
      // ignore
    }
    expect(notFoundMock).toHaveBeenCalled();
  });

  it("handles upstream failures robustly", async () => {
    get.mockRejectedValueOnce(new PublicApiError("unavailable"));
    const result = await loadCategoryDirectory();
    expect(result.status).toBe("error");
  });
});
