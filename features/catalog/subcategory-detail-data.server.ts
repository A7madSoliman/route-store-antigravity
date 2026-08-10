import "server-only";

import { getSubcategory } from "@/lib/api/endpoints/public/subcategories.server";
import { PublicApiError } from "@/lib/api/errors.server";
import type { Subcategory } from "@/types/subcategory";
import { notFound } from "next/navigation";

export type SubcategoryDetailState =
  | Readonly<{ status: "ready"; subcategory: Subcategory }>
  | Readonly<{ status: "error" }>;

export async function loadSubcategoryDetail(subcategoryId: string): Promise<SubcategoryDetailState> {
  try {
    return { status: "ready", subcategory: await getSubcategory(subcategoryId) };
  } catch (error: unknown) {
    if (error instanceof PublicApiError) {
      if (error.code === "not-found") notFound();
      return { status: "error" };
    }

    throw error;
  }
}
