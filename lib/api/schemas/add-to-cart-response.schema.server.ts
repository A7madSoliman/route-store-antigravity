import "server-only";

import { z } from "zod";
import { GetCartDataSchema } from "@/lib/api/schemas/get-cart-response.schema.server";

export const AddToCartResponseSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional().default("Product added successfully to your cart"),
  numOfCartItems: z.number().nonnegative().optional().default(1),
  cartId: z.string().optional(),
  data: GetCartDataSchema.nullable().optional(),
});

export type AddToCartResponse = z.infer<typeof AddToCartResponseSchema>;
