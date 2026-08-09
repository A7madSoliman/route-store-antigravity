import "server-only";

import { z } from "zod";

import { PublicApiError } from "@/lib/api/errors.server";
import type { ProductQuery } from "@/types/product";

const idSchema = z.string().refine((value) => value.trim().length > 0, "ID must not be blank");
const priceSchema = z.number().finite().nonnegative();

const querySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("limit"), limit: z.literal(2) }).strict(),
  z.object({ kind: z.literal("page"), page: z.literal(2) }).strict(),
  z.object({ kind: z.literal("sort"), sort: z.enum(["price", "-price"]) }).strict(),
  z
    .object({
      kind: z.literal("price"),
      minimum: priceSchema.optional(),
      maximum: priceSchema.optional(),
    })
    .refine(({ minimum, maximum }) => minimum !== undefined || maximum !== undefined)
    .refine(({ minimum, maximum }) => minimum === undefined || maximum === undefined || minimum <= maximum)
    .strict(),
  z.object({ kind: z.literal("brand"), brandId: idSchema }).strict(),
  z.object({
    kind: z.literal("categories"),
    categoryIds: z
      .array(idSchema)
      .min(1)
      .max(2)
      .refine((ids) => new Set(ids).size === ids.length),
  }).strict(),
  z.object({ kind: z.literal("category-sort"), categoryId: idSchema, sort: z.literal("price") }).strict(),
  z.object({ kind: z.literal("category-brand"), categoryId: idSchema, brandId: idSchema }).strict(),
]);

export function serializeProductQuery(query?: ProductQuery): URLSearchParams {
  if (query === undefined) {
    return new URLSearchParams();
  }

  const parsed = querySchema.safeParse(query);
  if (!parsed.success) {
    throw new PublicApiError("invalid-request");
  }

  const params = new URLSearchParams();
  switch (parsed.data.kind) {
    case "limit":
      params.set("limit", "2");
      break;
    case "page":
      params.set("page", "2");
      break;
    case "sort":
      params.set("sort", parsed.data.sort);
      break;
    case "price":
      if (parsed.data.minimum !== undefined) params.set("price[gte]", String(parsed.data.minimum));
      if (parsed.data.maximum !== undefined) params.set("price[lte]", String(parsed.data.maximum));
      break;
    case "brand":
      params.set("brand", parsed.data.brandId);
      break;
    case "categories":
      parsed.data.categoryIds.forEach((id) => params.append("category[in]", id));
      break;
    case "category-sort":
      params.append("category[in]", parsed.data.categoryId);
      params.set("sort", "price");
      break;
    case "category-brand":
      params.append("category[in]", parsed.data.categoryId);
      params.set("brand", parsed.data.brandId);
      break;
  }
  return params;
}
