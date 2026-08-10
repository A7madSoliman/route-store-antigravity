import "server-only";

import { getBrand } from "@/lib/api/endpoints/public/brands.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { Brand } from "@/types/brand";
import { notFound } from "next/navigation";

export type BrandDetailState =
  | Readonly<{ status: "ready"; brand: Brand }>
  | Readonly<{ status: "error" }>;

export async function loadBrandDetail(brandId: string): Promise<BrandDetailState> {
  try {
    return { status: "ready", brand: await getBrand(brandId) };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) {
      if (error.code === "not-found") notFound();
      return { status: "error" };
    }

    throw error;
  }
}
