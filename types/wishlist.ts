import type { ProductSummary } from "@/types/product";

export type WishlistItem = ProductSummary &
  Readonly<{
    description: string;
  }>;

export type WishlistData = Readonly<{
  count: number;
  items: readonly WishlistItem[];
}>;
