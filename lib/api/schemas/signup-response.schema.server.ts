import "server-only";

import { z } from "zod";

export const signupResponseSchema = z.object({ token: z.string().min(1) });
