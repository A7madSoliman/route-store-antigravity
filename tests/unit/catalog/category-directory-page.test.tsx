// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/catalog/category-directory-data.server", () => ({ loadCategoryDirectory: vi.fn() }));

import CategoriesPage from "@/app/(shop)/categories/page";
import { loadCategoryDirectory } from "@/features/catalog/category-directory-data.server";

describe("C05 category directory page boundary", () => {
  it("loads the category directory once with no route inputs", async () => {
    vi.mocked(loadCategoryDirectory).mockResolvedValue({ status: "empty" });
    const result = await CategoriesPage();
    expect(loadCategoryDirectory).toHaveBeenCalledOnce();
    expect(loadCategoryDirectory).toHaveBeenCalledWith();
    expect(result).toBeTruthy();
  });
});
