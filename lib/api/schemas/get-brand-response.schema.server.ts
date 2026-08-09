import "server-only";

import { z } from "zod";

import { BrandDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";

export const GetBrandResponseSchema = z.object({ data: BrandDtoSchema });
export type GetBrandResponse = z.infer<typeof GetBrandResponseSchema>;
