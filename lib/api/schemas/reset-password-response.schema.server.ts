import "server-only";

import { z } from "zod";

export const resetPasswordResponseSchema = z.object({
  token: z.string().min(1),
});

