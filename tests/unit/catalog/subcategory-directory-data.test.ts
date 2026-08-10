// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/subcategories.server", () => ({ getSubcategories: vi.fn() }));

import { getSubcategories } from "@/lib/api/endpoints/public/subcategories.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { loadSubcategoryDirectory } from "@/features/catalog/subcategory-directory-data.server";

const subcategory = { id: "subcategory/one", name: "Subcategory One", slug: "subcategory-one", categoryId: "category-1" } as const;
const page = { items: [subcategory], total: 1, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } as const;

beforeEach(() => vi.clearAllMocks());

describe("C07 subcategory directory loader", () => {
  it("calls getSubcategories exactly once without arguments", async () => {
    vi.mocked(getSubcategories).mockResolvedValue(page);
    await expect(loadSubcategoryDirectory()).resolves.toEqual({ status: "ready", page });
    expect(getSubcategories).toHaveBeenCalledOnce();
    expect(getSubcategories).toHaveBeenCalledWith();
  });

  it("keeps an empty collection distinct", async () => {
    vi.mocked(getSubcategories).mockResolvedValue({ ...page, items: [], total: 0 });
    await expect(loadSubcategoryDirectory()).resolves.toEqual({ status: "empty" });
  });

  it.each(["not-found", "invalid-request", "unavailable", "upstream-failure", "invalid-response"] as const)("maps known %s errors to the safe collection error state", async (code) => {
    vi.mocked(getSubcategories).mockRejectedValue(new PublicApiError(code));
    await expect(loadSubcategoryDirectory()).resolves.toEqual({ status: "error" });
  });

  it("rethrows unexpected errors", async () => {
    vi.mocked(getSubcategories).mockRejectedValue(new Error("programming failure"));
    await expect(loadSubcategoryDirectory()).rejects.toThrow("programming failure");
  });
});
