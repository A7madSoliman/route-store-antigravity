import "server-only";

import { publicGet } from "@/lib/api/transport/public-request.server";
import { serializeProductQuery } from "@/lib/api/query/product-query.server";
import { parsePublicResponse } from "@/lib/api/schemas/parse-response.server";
import { GetProductsResponseSchema } from "@/lib/api/schemas/get-products-response.schema.server";
import { GetProductResponseSchema } from "@/lib/api/schemas/get-product-response.schema.server";
import { toProductDetails, toProductPage } from "@/lib/api/adapters/product.adapter.server";
import type { CatalogPage } from "@/types/catalog-page";
import type { ProductDetails, ProductQuery, ProductSummary } from "@/types/product";

export async function getProducts(query?: ProductQuery): Promise<CatalogPage<ProductSummary>> {
  const response = await publicGet(["products"], serializeProductQuery(query));
  return toProductPage(parsePublicResponse(GetProductsResponseSchema, response));
}

export async function getProduct(productId: string): Promise<ProductDetails> {
  const response = await publicGet(["products", productId]);
  return toProductDetails(parsePublicResponse(GetProductResponseSchema, response).data);
}
