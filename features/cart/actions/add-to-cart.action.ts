"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { addToCart, AddToCartApiError } from "@/lib/api/endpoints/protected/add-to-cart.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type AddToCartState =
  | { status: "idle" }
  | { status: "success"; message: string; numOfCartItems?: number }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

const AddToCartFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export async function addToCartAction(
  previousState: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const rawProductId = formData.get("productId");
  const parsed = AddToCartFormSchema.safeParse({ productId: rawProductId });

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
        message: "You must be signed in to add items to your cart.",
      };
    }
    throw error;
  }

  try {
    const result = await addToCart({ productId: parsed.data.productId });
    revalidatePath("/cart");
    return {
      status: "success",
      message: result.message || "Product added successfully to your cart.",
      numOfCartItems: result.numOfCartItems,
    };
  } catch (error) {
    if (error instanceof AddToCartApiError) {
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
      if (error.code === "rejected") {
        return {
          status: "error",
          message: "Could not add product to cart (invalid product or stock limit reached).",
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
        message: "Could not add product to cart. Please try again.",
      };
    }
    throw error;
  }
}
