import "server-only";

import { z } from "zod";

export const AddressItemSchema = z.object({
  _id: z.string().optional().default(""),
  name: z.string().optional().default(""),
  details: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  city: z.string().optional().default(""),
});

export const GetAddressesResponseSchema = z.object({
  status: z.string().optional(),
  results: z.number().optional(),
  message: z.string().optional(),
  data: z.array(AddressItemSchema).optional().default([]),
});

export type AddressItemResponse = z.infer<typeof AddressItemSchema>;
export type GetAddressesResponse = z.infer<typeof GetAddressesResponseSchema>;
