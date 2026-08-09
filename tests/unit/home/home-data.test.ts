// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/categories.server", () => ({ getCategories: vi.fn() }));
vi.mock("@/lib/api/endpoints/public/brands.server", () => ({ getBrands: vi.fn() }));
vi.mock("@/lib/api/endpoints/public/products.server", () => ({ getProducts: vi.fn() }));

import { getBrands } from "@/lib/api/endpoints/public/brands.server";
import { getCategories } from "@/lib/api/endpoints/public/categories.server";
import { getProducts } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { loadHomeData } from "@/features/home/home-data.server";

const page = <T,>(items: readonly T[]) => ({ items, total: items.length, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } });
const brand = { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } as const;
const category = { id: "category-1", name: "Category", slug: "category", imageUrl: null } as const;
const product = { id: "product-1", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand } as const;

beforeEach(() => vi.clearAllMocks());

describe("home data", () => {
  it("starts the three independent reads without a product query", async () => {
    vi.mocked(getCategories).mockResolvedValue(page([]));
    vi.mocked(getBrands).mockResolvedValue(page([]));
    vi.mocked(getProducts).mockResolvedValue(page([]));

    const data = loadHomeData();
    await Promise.all([data.categories, data.brands, data.products]);

    expect(getCategories).toHaveBeenCalledOnce();
    expect(getBrands).toHaveBeenCalledOnce();
    expect(getProducts).toHaveBeenCalledWith();
  });

  it("keeps successful siblings ready when one known API read fails", async () => {
    vi.mocked(getCategories).mockRejectedValue(new PublicApiError("unavailable"));
    vi.mocked(getBrands).mockResolvedValue(page([brand]));
    vi.mocked(getProducts).mockResolvedValue(page([product]));

    const data = loadHomeData();
    await expect(data.categories).resolves.toEqual({ status: "error" });
    await expect(data.brands).resolves.toMatchObject({ status: "ready" });
    await expect(data.products).resolves.toMatchObject({ status: "ready" });
  });

  it("distinguishes empty data and rethrows unexpected failures", async () => {
    vi.mocked(getCategories).mockResolvedValue(page([]));
    vi.mocked(getBrands).mockRejectedValue(new Error("programming failure"));
    vi.mocked(getProducts).mockResolvedValue(page([]));

    const data = loadHomeData();
    await expect(data.categories).resolves.toEqual({ status: "empty", items: [] });
    await expect(data.products).resolves.toEqual({ status: "empty", items: [] });
    await expect(data.brands).rejects.toThrow("programming failure");
  });
});
