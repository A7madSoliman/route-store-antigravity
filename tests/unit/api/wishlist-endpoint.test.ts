// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedGetMock } = vi.hoisted(() => ({
  protectedGetMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedGet: protectedGetMock,
}));

import { getWishlist } from "@/lib/api/endpoints/protected/wishlist.server";

beforeEach(() => {
  protectedGetMock.mockReset();
});

describe("getWishlist endpoint", () => {
  it("calls protectedGet with ['wishlist'] and returns adapted data", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "success",
      count: 1,
      data: [
        {
          _id: "prod-1",
          title: "Product 1",
          slug: "product-1",
          description: "Description",
          price: 100,
          imageCover: "https://ecommerce.routemisr.com/products/1.jpg",
          images: [],
          subcategory: [],
          category: {
            _id: "cat-1",
            name: "Category",
            slug: "category",
            image: "https://ecommerce.routemisr.com/categories/1.jpg",
          },
          brand: {
            _id: "brand-1",
            name: "Brand",
            slug: "brand",
            image: "https://ecommerce.routemisr.com/brands/1.jpg",
          },
        },
      ],
    });

    const result = await getWishlist();
    expect(protectedGetMock).toHaveBeenCalledWith(["wishlist"]);
    expect(result.count).toBe(1);
    expect(result.items[0].id).toBe("prod-1");
  });

  it("handles empty wishlist", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "success",
      count: 0,
      data: [],
    });

    const result = await getWishlist();
    expect(protectedGetMock).toHaveBeenCalledWith(["wishlist"]);
    expect(result.count).toBe(0);
    expect(result.items).toEqual([]);
  });

  it("throws error when schema parsing fails", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "error",
      data: null,
    });

    await expect(getWishlist()).rejects.toThrow();
  });
});