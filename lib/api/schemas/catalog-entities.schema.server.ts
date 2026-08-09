import "server-only";

import { z } from "zod";

const mediaValue = z.unknown().optional();

export const CategoryDtoSchema = z.object({
  _id: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  image: mediaValue,
});

export const BrandDtoSchema = z.object({
  _id: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  image: mediaValue,
});

export const SubcategoryDtoSchema = z.object({
  _id: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  category: z.string().min(1),
});

export const ProductDtoSchema = z.object({
  _id: z.string().min(1),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number().finite(),
  imageCover: mediaValue,
  images: z.unknown().optional(),
  subcategory: z.array(SubcategoryDtoSchema),
  category: CategoryDtoSchema,
  brand: BrandDtoSchema,
});
