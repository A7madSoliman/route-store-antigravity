import "server-only";

import { normalizeApiImageGallery, normalizeApiImageUrl } from "@/lib/media/api-image.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { ProductDetails, ProductSummary } from "@/types/product";

type NestedDto = { _id: string; name: string; slug: string; image?: unknown };
type SubcategoryDto = { _id: string; name: string; slug: string; category: string };
type ProductDto = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageCover?: unknown;
  images?: unknown;
  subcategory: SubcategoryDto[];
  category: NestedDto;
  brand: NestedDto;
};
type ProductPageDto = {
  results: number;
  metadata: { currentPage: number; numberOfPages: number; limit: number; nextPage?: number; prevPage?: number };
  data: ProductDto[];
};

function toNested(dto: NestedDto) {
  return { id: dto._id, name: dto.name, slug: dto.slug, imageUrl: normalizeApiImageUrl(dto.image) };
}

function toSummary(dto: ProductDto): ProductSummary {
  return {
    id: dto._id,
    title: dto.title,
    slug: dto.slug,
    price: dto.price,
    imageUrl: normalizeApiImageUrl(dto.imageCover),
    category: toNested(dto.category),
    brand: toNested(dto.brand),
  };
}

export function toProductSummary(dto: ProductDto): ProductSummary {
  return toSummary(dto);
}

export function toProductDetails(dto: ProductDto): ProductDetails {
  return {
    ...toSummary(dto),
    description: dto.description,
    gallery: normalizeApiImageGallery(dto.images),
    subcategories: dto.subcategory.map((subcategory) => ({
      id: subcategory._id,
      name: subcategory.name,
      slug: subcategory.slug,
      categoryId: subcategory.category,
    })),
  };
}

export function toProductPage(dto: ProductPageDto): CatalogPage<ProductSummary> {
  return { total: dto.results, items: dto.data.map(toSummary), pagination: dto.metadata };
}
