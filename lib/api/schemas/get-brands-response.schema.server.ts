import "server-only";

import { z } from "zod";

import { BrandDtoSchema } from "@/lib/api/schemas/catalog-entities.schema.server";
import { ListEnvelopeShape } from "@/lib/api/schemas/pagination.schema.server";

export const GetBrandsResponseSchema = z.object({
  ...ListEnvelopeShape,
  data: z.array(BrandDtoSchema),
});

export type GetBrandsResponse = z.infer<typeof GetBrandsResponseSchema>;
