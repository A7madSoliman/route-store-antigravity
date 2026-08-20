import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPutJson } from "@/lib/api/transport/protected-request.server";
import { UpdateCartQuantityResponseSchema } from "@/lib/api/schemas/update-cart-quantity-response.schema.server";
import { adaptCartResponse } from "@/lib/api/adapters/cart.adapter.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";
import type { Cart } from "@/types/cart";

export type UpdateCartQuantityInput = {
  productId: string;
  count: number;
};

export type UpdateCartQuantityErrorCode =
  | "unauthorized"
  | "not-found"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class UpdateCartQuantityApiError extends Error {
  constructor(readonly code: UpdateCartQuantityErrorCode) {
    super("The update cart quantity request could not be completed safely.");
    this.name = "UpdateCartQuantityApiError";
  }
}

export async function updateCartQuantity(input: UpdateCartQuantityInput): Promise<Cart> {
  if (
    !input.productId ||
    typeof input.productId !== "string" ||
    input.productId.trim().length === 0 ||
    typeof input.count !== "number" ||
    input.count < 1 ||
    !Number.isInteger(input.count)
  ) {
    throw new UpdateCartQuantityApiError("rejected");
  }

  try {
    const response = await protectedPutJson(["cart", input.productId], { count: input.count });

    if (response.status === 401) {
      throw new UpdateCartQuantityApiError("unauthorized");
    }
    if (response.status === 404) {
      throw new UpdateCartQuantityApiError("not-found");
    }
    if (response.status === 400) {
      throw new UpdateCartQuantityApiError("rejected");
    }
    if (response.status !== 200) {
      throw new UpdateCartQuantityApiError("upstream-failure");
    }

    const parsed = UpdateCartQuantityResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new UpdateCartQuantityApiError("invalid-response");
    }

    return adaptCartResponse(parsed.data);
  } catch (error) {
    if (error instanceof UpdateCartQuantityApiError) throw error;
    if (error instanceof SessionRequiredError) throw new UpdateCartQuantityApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new UpdateCartQuantityApiError("unavailable");
      if (error.code === "invalid-response") throw new UpdateCartQuantityApiError("invalid-response");
      if (error.status === 401) throw new UpdateCartQuantityApiError("unauthorized");
      if (error.status === 404) throw new UpdateCartQuantityApiError("not-found");
      if (error.status === 400) throw new UpdateCartQuantityApiError("rejected");
    }
    throw new UpdateCartQuantityApiError("upstream-failure");
  }
}
