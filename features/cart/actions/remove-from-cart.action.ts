"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  removeFromCart,
  RemoveFromCartApiError,
} from "@/lib/api/endpoints/protected/remove-from-cart.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type RemoveFromCartState =
  | { status: "idle" }
  | { status: "success"; message: string; productId?: string }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

const RemoveFromCartFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export async function removeFromCartAction(
  previousState: RemoveFromCartState,
  formData: FormData,
): Promise<RemoveFromCartState> {
  const rawProductId = formData.get("productId");
  const parsed = RemoveFromCartFormSchema.safeParse({ productId: rawProductId });

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
        message: "You must be signed in to manage your cart.",
      };
    }
    throw error;
  }

  try {
    await removeFromCart({ productId: parsed.data.productId });
    revalidatePath("/cart");
    return {
      status: "success",
      message: "Item removed from cart.",
      productId: parsed.data.productId,
    };
  } catch (error) {
    if (error instanceof RemoveFromCartApiError) {
      if (error.code === "unauthorized") {
        return {
          status: "unauthorized",
          message: "Your session has expired. Please sign in again.",
        };
      }
      if (error.code === "not-found") {
        return {
          status: "error",
          message: "Product not found in cart.",
        };
      }
      if (error.code === "rejected") {
        return {
          status: "error",
          message: "Could not remove product from cart.",
        };
      }
      if (error.code === "unavailable") {
        return {
          status: "error",
          message: "Cart service is temporarily unavailable. Please try again.",
        };
      }
      return {
        status: "error",
        message: "Could not remove product from cart. Please try again.",
      };
    }
    throw error;
  }
}
