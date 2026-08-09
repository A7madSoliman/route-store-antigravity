import "server-only";

import { z } from "zod";

import { SubcategoryDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetSubcategoryResponseSchema = z.object({ data: SubcategoryDtoSchema });
export type GetSubcategoryResponse = z.infer<typeof GetSubcategoryResponseSchema>;
