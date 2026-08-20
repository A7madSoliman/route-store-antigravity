import "server-only";

import { z } from "zod";

export const signupResponseSchema = z.object({
  token: z.string().min(1),
  user: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      role: z.string().optional(),
    })
    .optional(),
});
