"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { addToCart, AddToCartApiError } from "@/lib/api/endpoints/protected/add-to-cart.server";
import { removeFromWishlist, RemoveFromWishlistApiError } from "@/lib/api/endpoints/protected/remove-from-wishlist.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type MoveToBagState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

const MoveToBagFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export async function moveToBagAction(
  previousState: MoveToBagState,
  formData: FormData,
): Promise<MoveToBagState> {
  const rawProductId = formData.get("productId");
  const parsed = MoveToBagFormSchema.safeParse({ productId: rawProductId });

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
        message: "You must be signed in to manage your bag and wishlist.",
      };
    }
    throw error;
  }

  try {
    // 1. Add to cart
    await addToCart({ productId: parsed.data.productId });

    // 2. Remove from wishlist
    try {
      await removeFromWishlist({ productId: parsed.data.productId });
    } catch {
      // Wishlist removal failed, but cart add succeeded
    }

    revalidatePath("/wishlist");
    revalidatePath("/cart");

    return {
      status: "success",
      message: "Item moved to your bag.",
    };
  } catch (error) {
    if (error instanceof AddToCartApiError) {
      if (error.code === "unauthorized") {
        return {
          status: "unauthorized",
          message: "Your session has expired. Please sign in again.",
        };
      }
      return {
        status: "error",
        message: "Could not add product to bag. Please try again.",
      };
    }
    throw error;
  }
}
