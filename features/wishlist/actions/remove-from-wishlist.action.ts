"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { removeFromWishlist, RemoveFromWishlistApiError } from "@/lib/api/endpoints/protected/remove-from-wishlist.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type RemoveFromWishlistState =
  | { status: "idle" }
  | { status: "success"; message: string; remainingProductIds?: string[] }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

const RemoveFromWishlistFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export async function removeFromWishlistAction(
  previousState: RemoveFromWishlistState,
  formData: FormData,
): Promise<RemoveFromWishlistState> {
  const rawProductId = formData.get("productId");
  const parsed = RemoveFromWishlistFormSchema.safeParse({ productId: rawProductId });

  if (!parsed.success) {
    return {
      status: "error",
      message: "A valid product ID is required.",
    };
  }

  try {
    await requireSession();
  } catch (error) {
    if (error instanceof SessionRequiredError) {
      return {
        status: "unauthorized",
        message: "You must be signed in to manage your wishlist.",
      };
    }
    throw error;
  }

  try {
    const result = await removeFromWishlist({ productId: parsed.data.productId });
    revalidatePath("/wishlist");
    return {
      status: "success",
      message: "Product removed successfully from your wishlist.",
      remainingProductIds: result.remainingProductIds,
    };
  } catch (error) {
    if (error instanceof RemoveFromWishlistApiError) {
      if (error.code === "unauthorized") {
        return {
          status: "unauthorized",
          message: "Your session has expired. Please sign in again.",
        };
      }
      if (error.code === "not-found") {
        return {
          status: "error",
          message: "Product not found in wishlist.",
        };
      }
      if (error.code === "unavailable") {
        return {
          status: "error",
          message: "Wishlist service is temporarily unavailable. Please try again.",
        };
      }
      return {
        status: "error",
        message: "Could not remove product from wishlist. Please try again.",
      };
    }
    throw error;
  }
}
