import "server-only";

import { z } from "zod";

import { ListEnvelopeShape } from "@/lib/api/schemas/pagination.schema.server";
import { SubcategoryDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetCategorySubcategoriesResponseSchema = z.object({
  ...ListEnvelopeShape,
  data: z.array(SubcategoryDtoSchema),
});

export type GetCategorySubcategoriesResponse = z.infer<
  typeof GetCategorySubcategoriesResponseSchema
>;
