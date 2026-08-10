// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/catalog/product-detail-data.server", () => ({ loadProductDetail: vi.fn() }));

import ProductDetailPage from "@/app/(shop)/products/[productId]/page";
import { loadProductDetail } from "@/features/catalog/product-detail-data.server";

const state = { status: "error" as const };

describe("C04 product detail page boundary", () => {
  it("awaits params and forwards the decoded opaque ID once", async () => {
    vi.mocked(loadProductDetail).mockResolvedValue(state);
    const result = await ProductDetailPage({ params: Promise.resolve({ productId: "opaque/id with space" }) });
    expect(loadProductDetail).toHaveBeenCalledOnce();
    expect(loadProductDetail).toHaveBeenCalledWith("opaque/id with space");
    expect(result).toBeTruthy();
  });
});
