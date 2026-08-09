import "server-only";

import { toCategory, toCategoryPage } from "@/lib/api/adapters/category.adapter.server";
import { toSubcategoryPage } from "@/lib/api/adapters/subcategory.adapter.server";
import { publicGet } from "@/lib/api/transport/public-request.server";
import { parsePublicResponse } from "@/lib/api/schemas/parse-response.server";
import { GetCategoriesResponseSchema } from "@/lib/api/schemas/get-categories-response.schema.server";
import { GetCategoryResponseSchema } from "@/lib/api/schemas/get-category-response.schema.server";
import { GetCategorySubcategoriesResponseSchema } from "@/lib/api/schemas/get-category-subcategories-response.schema.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { Category } from "@/types/category";
import type { Subcategory } from "@/types/subcategory";

export async function getCategories(): Promise<CatalogPage<Category>> {
  const response = await publicGet(["categories"]);
  return toCategoryPage(parsePublicResponse(GetCategoriesResponseSchema, response));
}

export async function getCategory(categoryId: string): Promise<Category> {
  const response = await publicGet(["categories", categoryId]);
  return toCategory(parsePublicResponse(GetCategoryResponseSchema, response).data);
}

export async function getCategorySubcategories(
  categoryId: string,
): Promise<CatalogPage<Subcategory>> {
  const response = await publicGet(["categories", categoryId, "subcategories"]);
  return toSubcategoryPage(
    parsePublicResponse(GetCategorySubcategoriesResponseSchema, response),
  );
}
