import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPostJson } from "@/lib/api/transport/protected-request.server";
import { AddToCartResponseSchema } from "@/lib/api/schemas/add-to-cart-response.schema.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

export type AddToCartInput = {
  productId: string;
};

export type AddToCartErrorCode =
  | "unauthorized"
  | "not-found"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class AddToCartApiError extends Error {
  constructor(readonly code: AddToCartErrorCode) {
    super("The add to cart request could not be completed safely.");
    this.name = "AddToCartApiError";
  }
}

export async function addToCart(
  input: AddToCartInput,
): Promise<{ message: string; numOfCartItems: number; totalCartPrice: number }> {
  if (!input.productId || typeof input.productId !== "string" || input.productId.trim().length === 0) {
    throw new AddToCartApiError("rejected");
  }

  try {
    const response = await protectedPostJson(["cart"], { productId: input.productId });

    if (response.status === 401) {
      throw new AddToCartApiError("unauthorized");
    }
    if (response.status === 404) {
      throw new AddToCartApiError("not-found");
    }
    if (response.status === 400) {
      throw new AddToCartApiError("rejected");
    }
    if (response.status !== 200) {
      throw new AddToCartApiError("upstream-failure");
    }

    const parsed = AddToCartResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new AddToCartApiError("invalid-response");
    }

    return {
      message: parsed.data.message,
      numOfCartItems: parsed.data.numOfCartItems,
      totalCartPrice: parsed.data.data.totalCartPrice,
    };
  } catch (error) {
    if (error instanceof AddToCartApiError) throw error;
    if (error instanceof SessionRequiredError) throw new AddToCartApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new AddToCartApiError("unavailable");
      if (error.code === "invalid-response") throw new AddToCartApiError("invalid-response");
      if (error.status === 401) throw new AddToCartApiError("unauthorized");
      if (error.status === 404) throw new AddToCartApiError("not-found");
      if (error.status === 400) throw new AddToCartApiError("rejected");
    }
    throw new AddToCartApiError("upstream-failure");
  }
}
