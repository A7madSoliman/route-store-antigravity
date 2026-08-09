import "server-only";

import { toBrand, toBrandPage } from "@/lib/api/adapters/brand.adapter.server";
import { publicGet } from "@/lib/api/transport/public-request.server";
import { parsePublicResponse } from "@/lib/api/schemas/parse-response.server";
import { GetBrandsResponseSchema } from "@/lib/api/schemas/get-brands-response.schema.server";
import { GetBrandResponseSchema } from "@/lib/api/schemas/get-brand-response.schema.server";
import type { Brand } from "@/types/brand";
import type { CatalogPage } from "@/types/catalog-page";

export async function getBrands(): Promise<CatalogPage<Brand>> {
  const response = await publicGet(["brands"]);
  return toBrandPage(parsePublicResponse(GetBrandsResponseSchema, response));
}

export async function getBrand(brandId: string): Promise<Brand> {
  const response = await publicGet(["brands", brandId]);
  return toBrand(parsePublicResponse(GetBrandResponseSchema, response).data);
}
