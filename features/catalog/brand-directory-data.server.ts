import "server-only";

import { getBrands } from "@/lib/api/endpoints/public/brands.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { Brand } from "@/types/brand";
import type { CatalogPage } from "@/types/catalog-page";

export type BrandDirectoryState =
  | Readonly<{ status: "ready"; page: CatalogPage<Brand> }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error" }>;

export async function loadBrandDirectory(): Promise<BrandDirectoryState> {
  try {
    const page = await getBrands();
    return page.items.length === 0 ? { status: "empty" } : { status: "ready", page };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) return { status: "error" };
    throw error;
  }
}
