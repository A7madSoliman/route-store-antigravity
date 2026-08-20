import "server-only";

import { protectedGet } from "@/lib/api/transport/protected-request.server";
import { GetWishlistResponseSchema } from "@/lib/api/schemas/get-wishlist-response.schema.server";
import { toWishlistData } from "@/lib/api/adapters/wishlist.adapter.server";
import type { WishlistData } from "@/types/wishlist";

export async function getWishlist(): Promise<WishlistData> {
  const raw = await protectedGet(["wishlist"]);
  const parsed = GetWishlistResponseSchema.parse(raw);
  return toWishlistData(parsed);
}
