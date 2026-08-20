import "server-only";

import { z } from "zod";
import { GetCartDataSchema } from "@/lib/api/schemas/get-cart-response.schema.server";

export const AddToCartResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string(),
  numOfCartItems: z.number().nonnegative(),
  cartId: z.string().optional(),
  data: GetCartDataSchema,
});

export type AddToCartResponse = z.infer<typeof AddToCartResponseSchema>;
