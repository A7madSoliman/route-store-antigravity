import "server-only";

import { z } from "zod";

import { ListEnvelopeShape } from "@/lib/api/schemas/pagination.schema.server";
import { SubcategoryDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetSubcategoriesResponseSchema = z.object({
  ...ListEnvelopeShape,
  data: z.array(SubcategoryDtoSchema),
});

export type GetSubcategoriesResponse = z.infer<typeof GetSubcategoriesResponseSchema>;
