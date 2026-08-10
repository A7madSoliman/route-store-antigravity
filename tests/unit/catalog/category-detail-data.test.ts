// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/categories.server", () => ({ getCategory: vi.fn(), getCategorySubcategories: vi.fn() }));
vi.mock("@/lib/api/endpoints/public/products.server", () => ({ getProducts: vi.fn() }));

const navigation = vi.hoisted(() => ({ notFound: vi.fn(() => { throw new Error("NOT_FOUND_SIGNAL"); }) }));
vi.mock("next/navigation", () => navigation);

import { loadCategoryDetail } from "@/features/catalog/category-detail-data.server";
import { getCategory, getCategorySubcategories } from "@/lib/api/endpoints/public/categories.server";
import { getProducts } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";

const category = { id: "category/one", name: "Category", slug: "category", imageUrl: null } as const;
const subcategory = { id: "subcategory/one", name: "Subcategory", slug: "subcategory", categoryId: category.id } as const;
const product = { id: "product/one", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand: { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } } as const;
const subcategoryPage = { items: [subcategory], total: 1, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } as const;
const productPage = { items: [product], total: 1, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } as const;

beforeEach(() => vi.clearAllMocks());

function mockReady() {
  vi.mocked(getCategory).mockResolvedValue(category);
  vi.mocked(getCategorySubcategories).mockResolvedValue(subcategoryPage);
  vi.mocked(getProducts).mockResolvedValue(productPage);
}

describe("C06 category detail loader", () => {
  it("starts all approved reads and forwards the opaque ID unchanged", async () => {
    mockReady();
    const result = await loadCategoryDetail("category/id with space");
    expect(result).toMatchObject({ status: "ready", category });
    expect(getCategory).toHaveBeenCalledOnce();
    expect(getCategory).toHaveBeenCalledWith("category/id with space");
    expect(getCategorySubcategories).toHaveBeenCalledOnce();
    expect(getCategorySubcategories).toHaveBeenCalledWith("category/id with space");
    expect(getProducts).toHaveBeenCalledOnce();
    expect(getProducts).toHaveBeenCalledWith({ kind: "categories", categoryIds: ["category/id with space"] });
  });

  it("starts every read before waiting for any result", async () => {
    let resolveCategory: (value: typeof category) => void = () => undefined;
    vi.mocked(getCategory).mockImplementation(() => new Promise((resolve) => { resolveCategory = resolve; }));
    vi.mocked(getCategorySubcategories).mockResolvedValue(subcategoryPage);
    vi.mocked(getProducts).mockResolvedValue(productPage);

    const pending = loadCategoryDetail("category-id");
    expect(getCategory).toHaveBeenCalledOnce();
    expect(getCategorySubcategories).toHaveBeenCalledOnce();
    expect(getProducts).toHaveBeenCalledOnce();
    resolveCategory(category);
    await expect(pending).resolves.toMatchObject({ status: "ready", category });
  });

  it("gives category not-found precedence after secondary reads settle", async () => {
    vi.mocked(getCategory).mockRejectedValue(new PublicApiError("not-found"));
    vi.mocked(getCategorySubcategories).mockRejectedValue(new Error("secondary programming failure"));
    vi.mocked(getProducts).mockResolvedValue(productPage);

    await expect(loadCategoryDetail("missing-category")).rejects.toThrow("NOT_FOUND_SIGNAL");
    expect(navigation.notFound).toHaveBeenCalledOnce();
  });

  it.each(["invalid-request", "unavailable", "upstream-failure", "invalid-response"] as const)("maps category %s to the page-level safe error", async (code) => {
    vi.mocked(getCategory).mockRejectedValue(new PublicApiError(code));
    vi.mocked(getCategorySubcategories).mockResolvedValue(subcategoryPage);
    vi.mocked(getProducts).mockResolvedValue(productPage);
    await expect(loadCategoryDetail("category-id")).resolves.toEqual({ status: "error" });
  });

  it("keeps secondary empty and known-error states independent", async () => {
    vi.mocked(getCategory).mockResolvedValue(category);
    vi.mocked(getCategorySubcategories).mockResolvedValue({ ...subcategoryPage, items: [], total: 0 });
    vi.mocked(getProducts).mockRejectedValue(new PublicApiError("unavailable"));

    await expect(loadCategoryDetail("category-id")).resolves.toEqual({
      status: "ready",
      category,
      subcategories: { status: "empty" },
      products: { status: "error" },
    });
  });

  it("rethrows unexpected secondary failures for a valid category", async () => {
    vi.mocked(getCategory).mockResolvedValue(category);
    vi.mocked(getCategorySubcategories).mockRejectedValue(new Error("programming failure"));
    vi.mocked(getProducts).mockResolvedValue(productPage);
    await expect(loadCategoryDetail("category-id")).rejects.toThrow("programming failure");
  });
});
