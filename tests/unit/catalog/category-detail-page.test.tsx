// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/catalog/category-detail-data.server", () => ({ loadCategoryDetail: vi.fn() }));

import CategoryDetailPage from "@/app/(shop)/categories/[categoryId]/page";
import { loadCategoryDetail } from "@/features/catalog/category-detail-data.server";

describe("C06 category detail page boundary", () => {
  it("awaits params and forwards the decoded opaque ID once", async () => {
    vi.mocked(loadCategoryDetail).mockResolvedValue({ status: "error" });
    const result = await CategoryDetailPage({ params: Promise.resolve({ categoryId: "category/id with space" }) });
    expect(loadCategoryDetail).toHaveBeenCalledOnce();
    expect(loadCategoryDetail).toHaveBeenCalledWith("category/id with space");
    expect(result).toBeTruthy();
  });
});
