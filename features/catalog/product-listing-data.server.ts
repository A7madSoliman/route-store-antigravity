import "server-only";

import { getProducts } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { ProductSummary } from "@/types/product";

export type ProductListingSearchParams = Readonly<Record<string, string | string[] | undefined>>;

export type ProductListingState =
  | Readonly<{ status: "ready"; page: CatalogPage<ProductSummary> }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error" }>;

export function isExactPageTwo(searchParams: ProductListingSearchParams): boolean {
  const keys = Object.keys(searchParams);
  return keys.length === 1 && keys[0] === "page" && searchParams.page === "2";
}

export function getExactBrandId(searchParams: ProductListingSearchParams): string | null {
  const keys = Object.keys(searchParams);
  const brand = searchParams.brand;
  return keys.length === 1 && keys[0] === "brand" && typeof brand === "string" && brand.trim().length > 0 ? brand : null;
}

export async function loadProductListing(searchParams: ProductListingSearchParams): Promise<ProductListingState> {
  try {
    const brandId = getExactBrandId(searchParams);
    const page = await (brandId !== null
      ? getProducts({ kind: "brand", brandId })
      : isExactPageTwo(searchParams)
        ? getProducts({ kind: "page", page: 2 })
        : getProducts());

    return page.items.length === 0 ? { status: "empty" } : { status: "ready", page };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) return { status: "error" };
    throw error;
  }
}
