// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import product from "@/tests/fixtures/api/get-product.success.json";
import categories from "@/tests/fixtures/api/get-categories.success.json";
import { GetProductResponseSchema } from "@/lib/api/schemas/get-product-response.schema.server";
import { GetCategoriesResponseSchema } from "@/lib/api/schemas/get-categories-response.schema.server";
import { toProductDetails } from "@/lib/api/adapters/product.adapter.server";
import { toCategoryPage } from "@/lib/api/adapters/category.adapter.server";

describe("catalog adapters", () => {
  it("preserves IDs and exposes only the approved product domain shape", () => {
    const dto = GetProductResponseSchema.parse(product).data;
    expect(toProductDetails(dto)).toEqual({
      id: "product-detail-fixture-1",
      title: "Fixture Detail Product",
      slug: "fixture-detail-product",
      description: "A sanitized detail fixture.",
      price: 2379,
      imageUrl: "https://ecommerce.routemisr.com/fixtures/detail-cover.webp",
      gallery: ["https://ecommerce.routemisr.com/fixtures/detail-gallery.webp"],
      category: {
        id: "category-fixture-2",
        name: "Detail Category",
        slug: "detail-category",
        imageUrl: "https://ecommerce.routemisr.com/fixtures/detail-category.webp",
      },
      brand: {
        id: "brand-fixture-2",
        name: "Detail Brand",
        slug: "detail-brand",
        imageUrl: "https://ecommerce.routemisr.com/fixtures/detail-brand.webp",
      },
      subcategories: [
        {
          id: "subcategory-fixture-2",
          name: "Detail Subcategory",
          slug: "detail-subcategory",
          categoryId: "category-fixture-2",
        },
      ],
    });
  });

  it("normalizes invalid nested media to null", () => {
    const dto = GetProductResponseSchema.parse({
      ...product,
      data: {
        ...product.data,
        imageCover: "http://wrong.example/cover.webp",
        images: ["https://wrong.example/gallery.webp", "not a URL"],
        category: { ...product.data.category, image: "https://cdn.example/category.webp" },
        brand: { ...product.data.brand, image: "https://user:pass@ecommerce.routemisr.com/brand.webp" },
      },
    }).data;
    const adapted = toProductDetails(dto);
    expect(adapted.imageUrl).toBeNull();
    expect(adapted.gallery).toEqual([]);
    expect(adapted.category.imageUrl).toBeNull();
    expect(adapted.brand.imageUrl).toBeNull();
  });

  it("maps category pages without leaking the wire envelope", () => {
    const dto = GetCategoriesResponseSchema.parse(categories);
    expect(toCategoryPage(dto)).toEqual({
      total: 1,
      items: [{
        id: "category-fixture-1",
        name: "Fixture Category",
        slug: "fixture-category",
        imageUrl: "https://ecommerce.routemisr.com/fixtures/category.webp",
      }],
      pagination: { currentPage: 1, numberOfPages: 1, limit: 40 },
    });
  });
});
