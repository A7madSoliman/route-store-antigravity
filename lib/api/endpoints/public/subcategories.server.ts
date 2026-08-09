import "server-only";

import { toSubcategory, toSubcategoryPage } from "@/lib/api/adapters/subcategory.adapter.server";
import { publicGet } from "@/lib/api/transport/public-request.server";
import { parsePublicResponse } from "@/lib/api/schemas/parse-response.server";
import { GetSubcategoriesResponseSchema } from "@/lib/api/schemas/get-subcategories-response.schema.server";
import { GetSubcategoryResponseSchema } from "@/lib/api/schemas/get-subcategory-response.schema.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { Subcategory } from "@/types/subcategory";

export async function getSubcategories(): Promise<CatalogPage<Subcategory>> {
  const response = await publicGet(["subcategories"]);
  return toSubcategoryPage(parsePublicResponse(GetSubcategoriesResponseSchema, response));
}

export async function getSubcategory(subcategoryId: string): Promise<Subcategory> {
  const response = await publicGet(["subcategories", subcategoryId]);
  return toSubcategory(parsePublicResponse(GetSubcategoryResponseSchema, response).data);
}
