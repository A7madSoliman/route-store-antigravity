export type CatalogPagination = Readonly<{
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}>;

export type CatalogPage<T> = Readonly<{
  items: readonly T[];
  total: number;
  pagination: CatalogPagination;
}>;
