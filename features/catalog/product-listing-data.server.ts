import "server-only";

import { getBrands } from "@/lib/api/endpoints/public/brands.server";
import { getCategories } from "@/lib/api/endpoints/public/categories.server";
import { getProducts } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import {
  parseProductListingQuery,
  type ProductListingQueryState,
  type ProductListingSearchParams,
} from "@/features/catalog/product-listing-query";
import type { CatalogPage } from "@/types/catalog-page";
import type { ProductQuery, ProductSummary } from "@/types/product";

export type { ProductListingSearchParams } from "@/features/catalog/product-listing-query";

export type ProductListingState =
  | Readonly<{ status: "ready"; page: CatalogPage<ProductSummary> }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error" }>;

export type FilterOption = Readonly<{ id: string; name: string }>;

export type FilterOptionState =
  | Readonly<{ status: "ready"; items: readonly FilterOption[] }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error" }>;

export type ProductListingViewModel = Readonly<{
  query: ProductListingQueryState;
  products: ProductListingState;
  categories: FilterOptionState;
  brands: FilterOptionState;
}>;

function toProductQuery(query: ProductListingQueryState): ProductQuery | undefined {
  switch (query.kind) {
    case "baseline": return undefined;
    case "page-two": return { kind: "page", page: 2 };
    case "sort": return { kind: "sort", sort: query.sort };
    case "price": return { kind: "price", minimum: query.minimum, maximum: query.maximum };
    case "brand": return { kind: "brand", brandId: query.brandId };
    case "categories": return { kind: "categories", categoryIds: query.categoryIds };
    case "category-sort": return { kind: "category-sort", categoryId: query.categoryId, sort: "price" };
    case "category-brand": return { kind: "category-brand", categoryId: query.categoryId, brandId: query.brandId };
  }
}

async function loadProducts(query: ProductListingQueryState): Promise<ProductListingState> {
  try {
    const page = await getProducts(toProductQuery(query));
    return page.items.length === 0 ? { status: "empty" } : { status: "ready", page };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) return { status: "error" };
    throw error;
  }
}

async function loadCategories(): Promise<FilterOptionState> {
  try {
    const page = await getCategories();
    const items = page.items.map(({ id, name }) => ({ id, name }));
    return items.length === 0 ? { status: "empty" } : { status: "ready", items };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) return { status: "error" };
    throw error;
  }
}

async function loadBrands(): Promise<FilterOptionState> {
  try {
    const page = await getBrands();
    const items = page.items.map(({ id, name }) => ({ id, name }));
    return items.length === 0 ? { status: "empty" } : { status: "ready", items };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) return { status: "error" };
    throw error;
  }
}

export async function loadProductListing(searchParams: ProductListingSearchParams): Promise<ProductListingViewModel> {
  const query = parseProductListingQuery(searchParams);
  const productsPromise = loadProducts(query);
  const categoriesPromise = loadCategories();
  const brandsPromise = loadBrands();
  const [products, categories, brands] = await Promise.all([productsPromise, categoriesPromise, brandsPromise]);
  return { query, products, categories, brands };
}
