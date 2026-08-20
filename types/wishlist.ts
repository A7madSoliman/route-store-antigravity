export type WishlistItem = Readonly<{
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: Readonly<{
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  }>;
  brand: Readonly<{
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  }>;
}>;

export type WishlistData = Readonly<{
  count: number;
  items: readonly WishlistItem[];
}>;
