import "server-only";

import { z } from "zod";

export const ClearCartResponseSchema = z.object({
  message: z.string(),
});

export type ClearCartResponse = z.infer<typeof ClearCartResponseSchema>;
