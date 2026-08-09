import "server-only";

import { z } from "zod";

import { CategoryDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetCategoryResponseSchema = z.object({ data: CategoryDtoSchema });
export type GetCategoryResponse = z.infer<typeof GetCategoryResponseSchema>;
