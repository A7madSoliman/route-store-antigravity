import "server-only";

import { z } from "zod";
import { AddressItemSchema } from "@/lib/api/schemas/get-addresses-response.schema.server";

export const RemoveAddressResponseSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional().default("Address removed successfully to your addresses"),
  data: z.array(AddressItemSchema).optional().default([]),
});

export type RemoveAddressResponse = z.infer<typeof RemoveAddressResponseSchema>;
