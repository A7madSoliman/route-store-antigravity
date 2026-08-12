import "server-only";

import { z } from "zod";

export const forgotPasswordResponseSchema = z.object({
  statusMsg: z.string(),
  message: z.string(),
});
