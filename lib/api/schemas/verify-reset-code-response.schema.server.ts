import "server-only";

import { z } from "zod";

export const verifyResetCodeResponseSchema = z.object({
  status: z.string(),
});
