import "server-only";

import { z } from "zod";

export const AddToWishlistResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string(),
  data: z.array(z.string()),
});

export type AddToWishlistResponse = z.infer<typeof AddToWishlistResponseSchema>;
