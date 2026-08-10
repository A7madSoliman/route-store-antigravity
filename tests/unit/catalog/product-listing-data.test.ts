// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/products.server", () => ({ getProducts: vi.fn() }));

import { getProducts } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { getExactBrandId, isExactPageTwo, loadProductListing } from "@/features/catalog/product-listing-data.server";

const category = { id: "category-1", name: "Category", slug: "category", imageUrl: null } as const;
const brand = { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } as const;
const product = { id: "product-1", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand } as const;
const catalogPage = (items = [product]) => ({ items, total: items.length, pagination: { currentPage: 1, numberOfPages: 2, limit: 40, nextPage: 2 } });

beforeEach(() => vi.clearAllMocks());

describe("C03 product listing query parsing", () => {
  it.each([
    [{}, false],
    [{ page: "2" }, true],
    [{ page: "3" }, false],
    [{ page: "02" }, false],
    [{ page: "" }, false],
    [{ page: ["2", "2"] }, false],
    [{ page: ["2", "3"] }, false],
    [{ page: "2", sort: "price" }, false],
    [{ foo: "bar" }, false],
    [{ limit: "2" }, false],
    [{ sort: "price" }, false],
    [{ search: "test" }, false],
  ])("accepts page two only for the exact single query: %o", (searchParams, expected) => {
    expect(isExactPageTwo(searchParams)).toBe(expected);
  });

  it.each([
    [{ brand: "brand/one" }, "brand/one"],
    [{}, null],
    [{ brand: "" }, null],
    [{ brand: "   " }, null],
    [{ brand: ["brand/one"] }, null],
    [{ brand: ["brand/one", "brand/two"] }, null],
    [{ brand: "brand/one", page: "2" }, null],
    [{ brand: "brand/one", sort: "price" }, null],
  ])("accepts only one non-empty scalar brand query: %o", (searchParams, expected) => {
    expect(getExactBrandId(searchParams)).toBe(expected);
  });
});

describe("C03 product listing loader", () => {
  it("calls the endpoint once without a query for the baseline and unsupported requests", async () => {
    vi.mocked(getProducts).mockResolvedValue(catalogPage());

    await expect(loadProductListing({})).resolves.toMatchObject({ status: "ready" });
    await expect(loadProductListing({ page: "2", sort: "price" })).resolves.toMatchObject({ status: "ready" });

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(getProducts).toHaveBeenNthCalledWith(1);
    expect(getProducts).toHaveBeenNthCalledWith(2);
  });

  it("calls only the verified page-two query for the exact page-two view", async () => {
    vi.mocked(getProducts).mockResolvedValue({ ...catalogPage(), pagination: { currentPage: 2, numberOfPages: 2, limit: 40, prevPage: 1 } });

    await expect(loadProductListing({ page: "2" })).resolves.toMatchObject({ status: "ready" });
    expect(getProducts).toHaveBeenCalledOnce();
    expect(getProducts).toHaveBeenCalledWith({ kind: "page", page: 2 });
  });

  it("calls only the verified brand query for the exact brand view", async () => {
    vi.mocked(getProducts).mockResolvedValue(catalogPage());

    await expect(loadProductListing({ brand: "brand/id with space" })).resolves.toMatchObject({ status: "ready" });
    expect(getProducts).toHaveBeenCalledOnce();
    expect(getProducts).toHaveBeenCalledWith({ kind: "brand", brandId: "brand/id with space" });
  });

  it("does not combine unsupported brand query shapes", async () => {
    vi.mocked(getProducts).mockResolvedValue(catalogPage());

    await expect(loadProductListing({ brand: "brand/id", page: "2" })).resolves.toMatchObject({ status: "ready" });
    expect(getProducts).toHaveBeenCalledOnce();
    expect(getProducts).toHaveBeenCalledWith();
  });

  it("keeps ready and empty results distinct", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce(catalogPage()).mockResolvedValueOnce(catalogPage([]));

    await expect(loadProductListing({})).resolves.toMatchObject({ status: "ready" });
    await expect(loadProductListing({})).resolves.toEqual({ status: "empty" });
  });

  it.each(["not-found", "unavailable", "upstream-failure", "invalid-response", "invalid-request"] as const)("handles known %s errors safely", async (code) => {
    vi.mocked(getProducts).mockRejectedValue(new PublicApiError(code));
    await expect(loadProductListing({})).resolves.toEqual({ status: "error" });
  });

  it("rethrows unexpected errors for the route error boundary", async () => {
    vi.mocked(getProducts).mockRejectedValue(new Error("programming failure"));
    await expect(loadProductListing({})).rejects.toThrow("programming failure");
  });
});
