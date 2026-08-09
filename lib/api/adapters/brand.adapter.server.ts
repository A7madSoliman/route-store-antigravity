import "server-only";

import { normalizeApiImageUrl } from "@/lib/media/api-image.server";
import type { Brand } from "@/types/brand";
import type { CatalogPage } from "@/types/catalog-page";

type BrandDto = { _id: string; name: string; slug: string; image?: unknown };
type BrandPageDto = {
  results: number;
  metadata: { currentPage: number; numberOfPages: number; limit: number; nextPage?: number; prevPage?: number };
  data: BrandDto[];
};

export function toBrand(dto: BrandDto): Brand {
  return { id: dto._id, name: dto.name, slug: dto.slug, imageUrl: normalizeApiImageUrl(dto.image) };
}

export function toBrandPage(dto: BrandPageDto): CatalogPage<Brand> {
  return { total: dto.results, items: dto.data.map(toBrand), pagination: dto.metadata };
}
