import "server-only";

import { z } from "zod";

import { PublicApiError } from "@/lib/api/errors.server";

export function parsePublicResponse<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new PublicApiError("invalid-response");
  }
  return parsed.data;
}
