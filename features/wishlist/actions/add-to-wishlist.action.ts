"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { addToWishlist, AddToWishlistApiError } from "@/lib/api/endpoints/protected/add-to-wishlist.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type AddToWishlistState =
  | { status: "idle" }
  | { status: "success"; message: string; wishlistProductIds?: string[] }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

const AddToWishlistFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export async function addToWishlistAction(
  previousState: AddToWishlistState,
  formData: FormData,
): Promise<AddToWishlistState> {
  const rawProductId = formData.get("productId");
  const parsed = AddToWishlistFormSchema.safeParse({ productId: rawProductId });

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
        message: "You must be signed in to add items to your wishlist.",
      };
    }
    throw error;
  }

  try {
    const result = await addToWishlist({ productId: parsed.data.productId });
    revalidatePath("/wishlist");
    return {
      status: "success",
      message: "Product added successfully to your wishlist.",
      wishlistProductIds: result.wishlistProductIds,
    };
  } catch (error) {
    if (error instanceof AddToWishlistApiError) {
      if (error.code === "unauthorized") {
        return {
          status: "unauthorized",
          message: "Your session has expired. Please sign in again.",
        };
      }
      if (error.code === "not-found") {
        return {
          status: "error",
          message: "Product not found.",
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
        message: "Could not add product to wishlist. Please try again.",
      };
    }
    throw error;
  }
}