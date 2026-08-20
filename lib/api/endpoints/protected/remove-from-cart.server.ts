import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedDelete } from "@/lib/api/transport/protected-request.server";
import { RemoveFromCartResponseSchema } from "@/lib/api/schemas/remove-from-cart-response.schema.server";
import { adaptCartResponse } from "@/lib/api/adapters/cart.adapter.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";
import type { Cart } from "@/types/cart";

export type RemoveFromCartInput = {
  productId: string;
};

export type RemoveFromCartErrorCode =
  | "unauthorized"
  | "not-found"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class RemoveFromCartApiError extends Error {
  constructor(readonly code: RemoveFromCartErrorCode) {
    super("The remove from cart request could not be completed safely.");
    this.name = "RemoveFromCartApiError";
  }
}

export async function removeFromCart(input: RemoveFromCartInput): Promise<Cart> {
  if (!input.productId || typeof input.productId !== "string" || input.productId.trim().length === 0) {
    throw new RemoveFromCartApiError("rejected");
  }

  try {
    const response = await protectedDelete(["cart", input.productId]);

    if (response.status === 401) {
      throw new RemoveFromCartApiError("unauthorized");
    }
    if (response.status === 404) {
      throw new RemoveFromCartApiError("not-found");
    }
    if (response.status === 400) {
      throw new RemoveFromCartApiError("rejected");
    }
    if (response.status !== 200) {
      throw new RemoveFromCartApiError("upstream-failure");
    }

    const parsed = RemoveFromCartResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new RemoveFromCartApiError("invalid-response");
    }

    return adaptCartResponse(parsed.data);
  } catch (error) {
    if (error instanceof RemoveFromCartApiError) throw error;
    if (error instanceof SessionRequiredError) throw new RemoveFromCartApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new RemoveFromCartApiError("unavailable");
      if (error.code === "invalid-response") throw new RemoveFromCartApiError("invalid-response");
      if (error.status === 401) throw new RemoveFromCartApiError("unauthorized");
      if (error.status === 404) throw new RemoveFromCartApiError("not-found");
      if (error.status === 400) throw new RemoveFromCartApiError("rejected");
    }
    throw new RemoveFromCartApiError("upstream-failure");
  }
}
