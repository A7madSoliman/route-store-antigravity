import "server-only";

import { z } from "zod";
import { GetCartDataSchema } from "@/lib/api/schemas/get-cart-response.schema.server";

export const UpdateCartQuantityResponseSchema = z.object({
  status: z.literal("success"),
  numOfCartItems: z.number().nonnegative(),
  cartId: z.string().optional(),
  data: GetCartDataSchema,
});

export type UpdateCartQuantityResponse = z.infer<typeof UpdateCartQuantityResponseSchema>;
