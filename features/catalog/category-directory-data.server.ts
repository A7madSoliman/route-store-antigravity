import "server-only";

import { getCategories } from "@/lib/api/endpoints/public/categories.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { Category } from "@/types/category";

export type CategoryDirectoryState =
  | Readonly<{ status: "ready"; page: CatalogPage<Category> }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error" }>;

export async function loadCategoryDirectory(): Promise<CategoryDirectoryState> {
  try {
    const page = await getCategories();
    return page.items.length === 0 ? { status: "empty" } : { status: "ready", page };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) return { status: "error" };
    throw error;
  }
}
