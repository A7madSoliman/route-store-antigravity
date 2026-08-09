import "server-only";

import { normalizeApiImageUrl } from "@/lib/media/api-image.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { Category } from "@/types/category";

type CategoryDto = {
  _id: string;
  name: string;
  slug: string;
  image?: unknown;
};

type CategoryPageDto = {
  results: number;
  metadata: { currentPage: number; numberOfPages: number; limit: number; nextPage?: number; prevPage?: number };
  data: CategoryDto[];
};

export function toCategory(dto: CategoryDto): Category {
  return {
    id: dto._id,
    name: dto.name,
    slug: dto.slug,
    imageUrl: normalizeApiImageUrl(dto.image),
  };
}

export function toCategoryPage(dto: CategoryPageDto): CatalogPage<Category> {
  return {
    total: dto.results,
    items: dto.data.map(toCategory),
    pagination: dto.metadata,
  };
}
