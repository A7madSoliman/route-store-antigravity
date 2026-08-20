import "server-only";

import { normalizeApiImageUrl } from "@/lib/media/api-image.server";
import type { GetWishlistResponse } from "@/lib/api/schemas/get-wishlist-response.schema.server";
import type { WishlistData, WishlistItem } from "@/types/wishlist";

type ProductDto = GetWishlistResponse["data"][number];

function toNested(dto: ProductDto["category"] | ProductDto["brand"]) {
  return { id: dto._id, name: dto.name, slug: dto.slug, imageUrl: normalizeApiImageUrl(dto.image) };
}

export function toWishlistItem(dto: ProductDto): WishlistItem {
  return {
    id: dto._id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    price: dto.price,
    imageUrl: normalizeApiImageUrl(dto.imageCover),
    category: toNested(dto.category),
    brand: toNested(dto.brand),
  };
}

export function toWishlistData(response: GetWishlistResponse): WishlistData {
  return {
    count: response.count,
    items: response.data.map(toWishlistItem),
  };
}
