import "server-only";

import { z } from "zod";

export const CartProductSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string().optional().default(""),
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
  _id: z.string().optional().default(""),
  product: z.union([CartProductSchema, z.string(), z.record(z.string(), z.unknown())]).optional(),
  price: z.number().nonnegative().optional().default(0),
  count: z.number().positive().optional().default(1),
});

export const GetCartDataSchema = z.object({
  _id: z.string().optional().default(""),
  cartOwner: z.string().optional().default(""),
  products: z.array(CartItemSchema).optional().default([]),
  totalCartPrice: z.number().nonnegative().optional().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

export const GetCartResponseSchema = z.object({
  status: z.string().optional(),
  numOfCartItems: z.number().nonnegative().optional().default(0),
  cartId: z.string().optional(),
  data: GetCartDataSchema.nullable().optional(),
});

export type GetCartResponse = z.infer<typeof GetCartResponseSchema>;
