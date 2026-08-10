import "server-only";

import { getCategory, getCategorySubcategories } from "@/lib/api/endpoints/public/categories.server";
import { getProducts } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { Category } from "@/types/category";
import type { ProductSummary } from "@/types/product";
import type { Subcategory } from "@/types/subcategory";
import { notFound } from "next/navigation";

export type CategoryDetailSectionState<T> =
  | Readonly<{ status: "ready"; items: readonly T[] }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error" }>;

export type CategoryDetailState =
  | Readonly<{
      status: "ready";
      category: Category;
      subcategories: CategoryDetailSectionState<Subcategory>;
      products: CategoryDetailSectionState<ProductSummary>;
    }>
  | Readonly<{ status: "error" }>;

function toSectionState<T>(result: PromiseSettledResult<CatalogPage<T>>): CategoryDetailSectionState<T> {
  if (result.status === "fulfilled") {
    return result.value.items.length === 0
      ? { status: "empty" }
      : { status: "ready", items: result.value.items };
  }

  if (result.reason instanceof PublicApiError) return { status: "error" };
  throw result.reason;
}

export async function loadCategoryDetail(categoryId: string): Promise<CategoryDetailState> {
  const [categoryResult, subcategoriesResult, productsResult] = await Promise.allSettled([
    getCategory(categoryId),
    getCategorySubcategories(categoryId),
    getProducts({ kind: "categories", categoryIds: [categoryId] }),
  ]);

  if (categoryResult.status === "rejected") {
    if (categoryResult.reason instanceof PublicApiError) {
      if (categoryResult.reason.code === "not-found") notFound();
      return { status: "error" };
    }

    throw categoryResult.reason;
  }

  return {
    status: "ready",
    category: categoryResult.value,
    subcategories: toSectionState(subcategoriesResult),
    products: toSectionState(productsResult),
  };
}
