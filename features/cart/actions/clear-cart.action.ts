"use server";

import { revalidatePath } from "next/cache";

import { clearCart, ClearCartApiError } from "@/lib/api/endpoints/protected/clear-cart.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type ClearCartState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

export async function clearCartAction(
  _previousState: ClearCartState,
  _formData: FormData,
): Promise<ClearCartState> {
  void _previousState;
  void _formData;
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
    const result = await clearCart();
    revalidatePath("/cart");
    return {
      status: "success",
      message: result.message || "Cart cleared successfully.",
    };
  } catch (error) {
    if (error instanceof ClearCartApiError) {
      if (error.code === "unauthorized") {
        return {
          status: "unauthorized",
          message: "Your session has expired. Please sign in again.",
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
        message: "Could not clear cart. Please try again.",
      };
    }
    throw error;
  }
}
