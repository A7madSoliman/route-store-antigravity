import "server-only";

import { getSubcategories } from "@/lib/api/endpoints/public/subcategories.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { Subcategory } from "@/types/subcategory";

export type SubcategoryDirectoryState =
  | Readonly<{ status: "ready"; page: CatalogPage<Subcategory> }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error" }>;

export async function loadSubcategoryDirectory(): Promise<SubcategoryDirectoryState> {
  try {
    const page = await getSubcategories();
    return page.items.length === 0 ? { status: "empty" } : { status: "ready", page };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) return { status: "error" };
    throw error;
  }
}
