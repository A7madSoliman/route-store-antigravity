import "server-only";

import { z } from "zod";

import { CategoryDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";
import { ListEnvelopeShape } from "@/lib/api/schemas/pagination.schema.server";

export const GetCategoriesResponseSchema = z.object({
  ...ListEnvelopeShape,
  data: z.array(CategoryDtoSchema),
});

export type GetCategoriesResponse = z.infer<typeof GetCategoriesResponseSchema>;
