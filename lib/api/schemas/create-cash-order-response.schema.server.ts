import "server-only";

import { z } from "zod";

const orderItemSchema = z.object({
  _id: z.string().optional(),
  count: z.number().default(0),
  price: z.number().default(0),
  product: z.string().optional().default(""), // For cash order creation, product is just a string ID
});

export const createCashOrderResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    _id: z.string().optional().default(""),
    user: z.string().optional().default(""),
    cartItems: z.array(orderItemSchema).default([]),
    totalOrderPrice: z.number().default(0),
    taxPrice: z.number().default(0),
    shippingPrice: z.number().default(0),
    paymentMethodType: z.string().default("cash"),
    isPaid: z.boolean().default(false),
    isDelivered: z.boolean().default(false),
    shippingAddress: z.object({
      details: z.string().default(""),
      phone: z.string().default(""),
      city: z.string().default(""),
    }).optional(),
    createdAt: z.string().optional().default(""),
    updatedAt: z.string().optional().default(""),
  }),
});
