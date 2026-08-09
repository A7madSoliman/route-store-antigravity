import "server-only";

import { z } from "zod";

import { ProductDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetProductResponseSchema = z.object({ data: ProductDtoSchema });
export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;
