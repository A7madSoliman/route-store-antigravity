export type ProductQuery =
  | Readonly<{ kind: "limit"; limit: 2 }>
  | Readonly<{ kind: "page"; page: 2 }>
  | Readonly<{ kind: "sort"; sort: "price" | "-price" }>
  | Readonly<{
      kind: "price";
      minimum?: number;
      maximum?: number;
    }>
  | Readonly<{ kind: "brand"; brandId: string }>
  | Readonly<{
      kind: "categories";
      categoryIds: readonly [string] | readonly [string, string];
    }>
  | Readonly<{
      kind: "category-sort";
      categoryId: string;
      sort: "price";
    }>
  | Readonly<{
      kind: "category-brand";
      categoryId: string;
      brandId: string;
    }>;

export type ProductSummary = Readonly<{
  id: string;
  title: string;
  slug: string;
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

export type ProductDetails = ProductSummary &
  Readonly<{
    description: string;
    gallery: readonly string[];
    subcategories: readonly Readonly<{
      id: string;
      name: string;
      slug: string;
      categoryId: string;
    }>[];
  }>;
