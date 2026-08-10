// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/catalog/subcategory-detail-data.server", () => ({ loadSubcategoryDetail: vi.fn() }));

import SubcategoryDetailPage from "@/app/(shop)/subcategories/[subcategoryId]/page";
import { loadSubcategoryDetail } from "@/features/catalog/subcategory-detail-data.server";

describe("C07 subcategory detail page boundary", () => {
  it("awaits params and forwards the decoded opaque ID once", async () => {
    vi.mocked(loadSubcategoryDetail).mockResolvedValue({ status: "error" });
    const result = await SubcategoryDetailPage({ params: Promise.resolve({ subcategoryId: "subcategory/id with space" }) });
    expect(loadSubcategoryDetail).toHaveBeenCalledOnce();
    expect(loadSubcategoryDetail).toHaveBeenCalledWith("subcategory/id with space");
    expect(result).toBeTruthy();
  });
});
