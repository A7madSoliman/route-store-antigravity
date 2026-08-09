import "server-only";

import type { CatalogPage } from "@/types/catalog-page";
import type { Subcategory } from "@/types/subcategory";

type SubcategoryDto = { _id: string; name: string; slug: string; category: string };
type SubcategoryPageDto = {
  results: number;
  metadata: { currentPage: number; numberOfPages: number; limit: number; nextPage?: number; prevPage?: number };
  data: SubcategoryDto[];
};

export function toSubcategory(dto: SubcategoryDto): Subcategory {
  return { id: dto._id, name: dto.name, slug: dto.slug, categoryId: dto.category };
}

export function toSubcategoryPage(dto: SubcategoryPageDto): CatalogPage<Subcategory> {
  return { total: dto.results, items: dto.data.map(toSubcategory), pagination: dto.metadata };
}
