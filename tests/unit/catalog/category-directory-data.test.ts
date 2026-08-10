// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/categories.server", () => ({ getCategories: vi.fn() }));

import { loadCategoryDirectory } from "@/features/catalog/category-directory-data.server";
import { getCategories } from "@/lib/api/endpoints/public/categories.server";
import { PublicApiError } from "@/lib/api/errors.server";

const category = { id: "category/one", name: "Category One", slug: "category-one", imageUrl: null } as const;
const page = { items: [category], total: 1, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } as const;

beforeEach(() => vi.clearAllMocks());

describe("C05 category directory loader", () => {
  it("calls getCategories exactly once without arguments", async () => {
    vi.mocked(getCategories).mockResolvedValue(page);
    await expect(loadCategoryDirectory()).resolves.toEqual({ status: "ready", page });
    expect(getCategories).toHaveBeenCalledOnce();
    expect(getCategories).toHaveBeenCalledWith();
  });

  it("keeps an empty collection distinct", async () => {
    vi.mocked(getCategories).mockResolvedValue({ ...page, items: [], total: 0 });
    await expect(loadCategoryDirectory()).resolves.toEqual({ status: "empty" });
  });

  it.each(["not-found", "invalid-request", "unavailable", "upstream-failure", "invalid-response"] as const)("maps known %s errors to the safe collection error state", async (code) => {
    vi.mocked(getCategories).mockRejectedValue(new PublicApiError(code));
    await expect(loadCategoryDirectory()).resolves.toEqual({ status: "error" });
  });

  it("rethrows unexpected errors", async () => {
    vi.mocked(getCategories).mockRejectedValue(new Error("programming failure"));
    await expect(loadCategoryDirectory()).rejects.toThrow("programming failure");
  });
});
