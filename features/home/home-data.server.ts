import "server-only";

import { getBrands } from "@/lib/api/endpoints/public/brands.server";
import { getCategories } from "@/lib/api/endpoints/public/categories.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { getProducts } from "@/lib/api/endpoints/public/products.server";
import type { Brand } from "@/types/brand";
import type { CatalogPage } from "@/types/catalog-page";
import type { Category } from "@/types/category";
import type { ProductSummary } from "@/types/product";
import type { HomeSectionState } from "./components/home-section-state";

export async function settleHomeSection<T>(promise: Promise<CatalogPage<T>>): Promise<HomeSectionState<T>> {
  try {
    const page = await promise;
    if (page.items.length === 0) return { status: "empty", items: [] };
    return { status: "ready", items: page.items };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) {
      return { status: "error" };
    }
    throw error;
  }
}

export function loadHomeData() {
  return {
    categories: settleHomeSection<Category>(getCategories()),
    brands: settleHomeSection<Brand>(getBrands()),
    products: settleHomeSection<ProductSummary>(getProducts()),
  };
}
