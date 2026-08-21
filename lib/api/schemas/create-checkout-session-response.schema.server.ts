import "server-only";

import { z } from "zod";

export const createCheckoutSessionResponseSchema = z.object({
  status: z.string(),
  session: z.object({
    url: z.string(),
    success_url: z.string().optional(),
    cancel_url: z.string().optional(),
  }),
});
