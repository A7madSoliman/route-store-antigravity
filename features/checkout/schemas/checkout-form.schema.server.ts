import "server-only";

import { z } from "zod";

export const checkoutFormSchema = z.object({
  cartId: z.string().min(1, "Cart ID is required"),
  paymentMethod: z.union([z.literal("cash"), z.literal("card")]),
  details: z.string().min(3, "Address details must be at least 3 characters").max(200, "Address details must be less than 200 characters"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/u, "Must be a valid Egyptian phone number (e.g. 01012345678)"),
  city: z.string().min(2, "City must be at least 2 characters").max(50, "City must be less than 50 characters"),
});
