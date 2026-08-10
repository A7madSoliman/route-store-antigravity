// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/products.server", () => ({ getProduct: vi.fn() }));

const navigation = vi.hoisted(() => ({ notFound: vi.fn(() => { throw new Error("NOT_FOUND_SIGNAL"); }) }));
vi.mock("next/navigation", () => navigation);

import { getProduct } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { loadProductDetail } from "@/features/catalog/product-detail-data.server";

const product = {
  id: "opaque/id",
  title: "Verified product",
  slug: "verified-product",
  price: 2379,
  imageUrl: "https://ecommerce.routemisr.com/images/cover.webp",
  category: { id: "category-1", name: "Category", slug: "category", imageUrl: null },
  brand: { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null },
  description: "A product\nwith details.",
  gallery: ["https://ecommerce.routemisr.com/images/gallery.webp"],
  subcategories: [],
} as const;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("C04 product detail loader", () => {
  it("forwards an opaque route ID unchanged and calls getProduct once", async () => {
    vi.mocked(getProduct).mockResolvedValue(product);
    await expect(loadProductDetail("opaque/id with space")).resolves.toEqual({ status: "ready", product });
    expect(getProduct).toHaveBeenCalledOnce();
    expect(getProduct).toHaveBeenCalledWith("opaque/id with space");
  });

  it("maps only not-found to the framework not-found boundary", async () => {
    vi.mocked(getProduct).mockRejectedValue(new PublicApiError("not-found"));
    await expect(loadProductDetail("missing-id")).rejects.toThrow("NOT_FOUND_SIGNAL");
    expect(navigation.notFound).toHaveBeenCalledOnce();
  });

  it.each(["unavailable", "upstream-failure", "invalid-response", "invalid-request"] as const)("keeps %s as a safe unavailable state", async (code) => {
    vi.mocked(getProduct).mockRejectedValue(new PublicApiError(code));
    await expect(loadProductDetail("opaque-id")).resolves.toEqual({ status: "error" });
    expect(navigation.notFound).not.toHaveBeenCalled();
  });

  it("rethrows unexpected errors", async () => {
    vi.mocked(getProduct).mockRejectedValue(new Error("programming failure"));
    await expect(loadProductDetail("opaque-id")).rejects.toThrow("programming failure");
  });
});
