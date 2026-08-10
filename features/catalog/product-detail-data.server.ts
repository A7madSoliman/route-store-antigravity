import "server-only";

import { getProduct } from "@/lib/api/endpoints/public/products.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { ProductDetails } from "@/types/product";
import { notFound } from "next/navigation";

export type ProductDetailState =
  | Readonly<{ status: "ready"; product: ProductDetails }>
  | Readonly<{ status: "error" }>;

export async function loadProductDetail(productId: string): Promise<ProductDetailState> {
  try {
    return { status: "ready", product: await getProduct(productId) };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) {
      if (error.code === "not-found") notFound();
      return { status: "error" };
    }

    throw error;
  }
}
