// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/catalog/brand-detail-data.server", () => ({ loadBrandDetail: vi.fn() }));

import BrandDetailPage from "@/app/(shop)/brands/[brandId]/page";
import { loadBrandDetail } from "@/features/catalog/brand-detail-data.server";

describe("C08 brand detail page boundary", () => {
  it("awaits params and forwards the decoded opaque ID once", async () => {
    vi.mocked(loadBrandDetail).mockResolvedValue({ status: "error" });
    const result = await BrandDetailPage({ params: Promise.resolve({ brandId: "brand/id with space" }) });
    expect(loadBrandDetail).toHaveBeenCalledOnce();
    expect(loadBrandDetail).toHaveBeenCalledWith("brand/id with space");
    expect(result).toBeTruthy();
  });
});
