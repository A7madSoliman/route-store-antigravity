// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { toWishlistData, toWishlistItem } from "@/lib/api/adapters/wishlist.adapter.server";
import type { GetWishlistResponse } from "@/lib/api/schemas/get-wishlist-response.schema.server";

describe("wishlist.adapter.server", () => {
  const sampleDto: GetWishlistResponse["data"][number] = {
    _id: "prod-1",
    title: "Test Product",
    slug: "test-product",
    description: "A test description for product",
    price: 250,
    imageCover: "https://ecommerce.routemisr.com/products/cover.jpg",
    images: ["https://ecommerce.routemisr.com/products/1.jpg"],
    subcategory: [
      {
        _id: "sub-1",
        name: "Sub 1",
        slug: "sub-1",
        category: "cat-1",
      },
    ],
    category: {
      _id: "cat-1",
      name: "Cat 1",
      slug: "cat-1",
      image: "https://ecommerce.routemisr.com/categories/1.jpg",
    },
    brand: {
      _id: "brand-1",
      name: "Brand 1",
      slug: "brand-1",
      image: "https://ecommerce.routemisr.com/brands/1.jpg",
    },
  };

  it("adapts a single product dto to WishlistItem", () => {
    const item = toWishlistItem(sampleDto);
    expect(item).toEqual({
      id: "prod-1",
      title: "Test Product",
      slug: "test-product",
      description: "A test description for product",
      price: 250,
      imageUrl: "https://ecommerce.routemisr.com/products/cover.jpg",
      category: {
        id: "cat-1",
        name: "Cat 1",
        slug: "cat-1",
        imageUrl: "https://ecommerce.routemisr.com/categories/1.jpg",
      },
      brand: {
        id: "brand-1",
        name: "Brand 1",
        slug: "brand-1",
        imageUrl: "https://ecommerce.routemisr.com/brands/1.jpg",
      },
    });
  });

  it("normalizes non-allowlisted media URLs to null", () => {
    const dtoWithInvalidMedia = {
      ...sampleDto,
      imageCover: "http://malicious.com/image.jpg",
      category: {
        ...sampleDto.category,
        image: "http://other.com/cat.jpg",
      },
    };

    const item = toWishlistItem(dtoWithInvalidMedia);
    expect(item.imageUrl).toBeNull();
    expect(item.category.imageUrl).toBeNull();
  });

  it("adapts full response to WishlistData", () => {
    const response: GetWishlistResponse = {
      status: "success",
      count: 1,
      data: [sampleDto],
    };

    const result = toWishlistData(response);
    expect(result.count).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("prod-1");
  });
});