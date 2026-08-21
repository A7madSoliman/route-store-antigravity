import "server-only";

import { z } from "zod";

const orderProductSchema = z.object({
  _id: z.string().optional().default(""),
  id: z.string().optional(),
  title: z.string().optional().default(""),
  imageCover: z.string().optional().default(""),
  ratingsAverage: z.number().optional().default(0),
  ratingsQuantity: z.number().optional().default(0),
  category: z
    .object({
      _id: z.string().optional().default(""),
      name: z.string().optional().default(""),
      slug: z.string().optional().default(""),
      image: z.string().optional(),
    })
    .optional(),
  brand: z
    .object({
      _id: z.string().optional().default(""),
      name: z.string().optional().default(""),
      slug: z.string().optional().default(""),
      image: z.string().optional(),
    })
    .optional(),
  subcategory: z
    .array(
      z.object({
        _id: z.string().optional().default(""),
        name: z.string().optional().default(""),
        slug: z.string().optional().default(""),
        category: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

const userOrderCartItemSchema = z.object({
  _id: z.string().optional().default(""),
  count: z.number().default(0),
  price: z.number().default(0),
  product: z.union([z.string(), orderProductSchema]).optional(),
});

const orderUserSchema = z.object({
  _id: z.string().optional().default(""),
  name: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional(),
});

export const orderItemRecordSchema = z.object({
  _id: z.string().optional().default(""),
  id: z.union([z.number(), z.string()]).optional(),
  user: z.union([z.string(), orderUserSchema]).optional().default(""),
  cartItems: z.array(userOrderCartItemSchema).default([]),
  totalOrderPrice: z.number().default(0),
  taxPrice: z.number().default(0),
  shippingPrice: z.number().default(0),
  paymentMethodType: z.string().default("cash"),
  isPaid: z.boolean().default(false),
  isDelivered: z.boolean().default(false),
  paidAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  shippingAddress: z
    .object({
      details: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      city: z.string().optional().default(""),
    })
    .optional(),
  createdAt: z.string().optional().default(""),
  updatedAt: z.string().optional().default(""),
});

export const getOrdersResponseSchema = z.array(orderItemRecordSchema);

export type RawOrderRecord = z.infer<typeof orderItemRecordSchema>;
