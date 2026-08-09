import "server-only";

import { z } from "zod";

import { ListEnvelopeShape, PaginationSchema } from "@/lib/api/schemas/pagination.schema.server";
import { ProductDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetProductsResponseSchema = z.object({
  ...ListEnvelopeShape,
  data: z.array(ProductDtoSchema),
});

export type GetProductsResponse = z.infer<typeof GetProductsResponseSchema>;
export { PaginationSchema };
