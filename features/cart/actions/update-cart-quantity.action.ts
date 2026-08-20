"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  updateCartQuantity,
  UpdateCartQuantityApiError,
} from "@/lib/api/endpoints/protected/update-cart-quantity.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type UpdateCartQuantityState =
  | { status: "idle" }
  | { status: "success"; message: string; count?: number }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

const UpdateCartQuantityFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  count: z.coerce.number().int().min(1, "Count must be at least 1"),
});

export async function updateCartQuantityAction(
  previousState: UpdateCartQuantityState,
  formData: FormData,
): Promise<UpdateCartQuantityState> {
  const rawProductId = formData.get("productId");
  const rawCount = formData.get("count");

  const parsed = UpdateCartQuantityFormSchema.safeParse({
    productId: rawProductId,
    count: rawCount,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "A valid product ID and positive count are required.",
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
    await updateCartQuantity({
      productId: parsed.data.productId,
      count: parsed.data.count,
    });
    revalidatePath("/cart");
    return {
      status: "success",
      message: "Cart quantity updated successfully.",
      count: parsed.data.count,
    };
  } catch (error) {
    if (error instanceof UpdateCartQuantityApiError) {
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
          message: "Could not update quantity (stock limit reached).",
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
        message: "Could not update quantity. Please try again.",
      };
    }
    throw error;
  }
}
