import "server-only";

import { z } from "zod";

import { ProductDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetWishlistResponseSchema = z.object({
  status: z.literal("success"),
  count: z.number().int().nonnegative(),
  data: z.array(ProductDtoSchema),
});

export type GetWishlistResponse = z.infer<typeof GetWishlistResponseSchema>;
