import "server-only";

import { z } from "zod";

export const CartProductSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string(),
  slug: z.string().optional(),
  price: z.number().nonnegative().optional(),
  imageCover: z.string().nullable().optional(),
  category: z
    .object({
      _id: z.string().optional(),
      name: z.string().optional(),
      slug: z.string().optional(),
    })
    .optional(),
  brand: z
    .object({
      _id: z.string().optional(),
      name: z.string().optional(),
      slug: z.string().optional(),
    })
    .optional(),
  quantity: z.number().optional(),
  ratingsAverage: z.number().optional(),
});

export const CartItemSchema = z.object({
  _id: z.string(),
  product: CartProductSchema,
  price: z.number().nonnegative(),
  count: z.number().positive(),
});

export const GetCartDataSchema = z.object({
  _id: z.string(),
  cartOwner: z.string(),
  products: z.array(CartItemSchema),
  totalCartPrice: z.number().nonnegative(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

export const GetCartResponseSchema = z.object({
  status: z.literal("success"),
  numOfCartItems: z.number().nonnegative(),
  cartId: z.string().optional(),
  data: GetCartDataSchema,
});

export type GetCartResponse = z.infer<typeof GetCartResponseSchema>;
