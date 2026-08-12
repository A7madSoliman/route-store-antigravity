import "server-only";
import { z } from "zod";
export const signinResponseSchema = z.object({ token: z.string().min(1) });
