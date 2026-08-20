import "server-only";

import { z } from "zod";
import { AddressItemSchema } from "@/lib/api/schemas/get-addresses-response.schema.server";

export const AddAddressInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  details: z.string().trim().min(1, "Details are required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  city: z.string().trim().min(1, "City is required"),
});

export const AddAddressResponseSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional().default("Address added successfully to your addresses"),
  data: z.array(AddressItemSchema).optional().default([]),
});

export type AddAddressInput = z.infer<typeof AddAddressInputSchema>;
export type AddAddressResponse = z.infer<typeof AddAddressResponseSchema>;
