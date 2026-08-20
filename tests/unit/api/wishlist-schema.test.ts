// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { GetWishlistResponseSchema } from "@/lib/api/schemas/get-wishlist-response.schema.server";

describe("GetWishlistResponseSchema", () => {
  it("parses empty wishlist response", () => {
    const raw = {
      status: "success",
      count: 0,
      data: [],
    };

    const parsed = GetWishlistResponseSchema.parse(raw);
    expect(parsed).toEqual(raw);
  });

  it("parses populated wishlist response", () => {
    const raw = {
      status: "success",
      count: 1,
      data: [
        {
          _id: "prod-1",
          title: "Product 1",
          slug: "product-1",
          description: "Description of product 1",
          price: 199.99,
          imageCover: "https://ecommerce.routemisr.com/products/prod-1.png",
          images: ["https://ecommerce.routemisr.com/products/prod-1-1.png"],
          subcategory: [
            {
              _id: "sub-1",
              name: "Subcategory 1",
              slug: "subcategory-1",
              category: "cat-1",
            },
          ],
          category: {
            _id: "cat-1",
            name: "Category 1",
            slug: "category-1",
            image: "https://ecommerce.routemisr.com/categories/cat-1.png",
          },
          brand: {
            _id: "brand-1",
            name: "Brand 1",
            slug: "brand-1",
            image: "https://ecommerce.routemisr.com/brands/brand-1.png",
          },
        },
      ],
    };

    const parsed = GetWishlistResponseSchema.parse(raw);
    expect(parsed.count).toBe(1);
    expect(parsed.data).toHaveLength(1);
    expect(parsed.data[0]._id).toBe("prod-1");
  });

  it("rejects non-success status or missing fields", () => {
    expect(() =>
      GetWishlistResponseSchema.parse({
        status: "fail",
        count: 0,
        data: [],
      })
    ).toThrow();

    expect(() =>
      GetWishlistResponseSchema.parse({
        status: "success",
        count: -1,
        data: [],
      })
    ).toThrow();
  });
});