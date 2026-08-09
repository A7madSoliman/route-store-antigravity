import "server-only";

import { z } from "zod";

export const PaginationSchema = z.object({
  currentPage: z.number().int().nonnegative(),
  numberOfPages: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  nextPage: z.number().int().positive().optional(),
  prevPage: z.number().int().positive().optional(),
});

export const ListEnvelopeShape = {
  results: z.number().int().nonnegative(),
  metadata: PaginationSchema,
};
