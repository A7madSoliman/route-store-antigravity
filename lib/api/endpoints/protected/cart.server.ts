import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedGet } from "@/lib/api/transport/protected-request.server";
import { GetCartResponseSchema } from "@/lib/api/schemas/get-cart-response.schema.server";
import { adaptCartResponse, createEmptyCart } from "@/lib/api/adapters/cart.adapter.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";
import type { Cart } from "@/types/cart";

export type GetCartErrorCode =
  | "unauthorized"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class GetCartApiError extends Error {
  constructor(readonly code: GetCartErrorCode) {
    super("The cart could not be loaded safely.");
    this.name = "GetCartApiError";
  }
}

export async function getCart(): Promise<Cart> {
  try {
    const raw = await protectedGet(["cart"]);
    if (!raw || typeof raw !== "object") {
      return createEmptyCart();
    }

    const rawObj = raw as Record<string, unknown>;
    if (rawObj.status && rawObj.status !== "success") {
      throw new GetCartApiError("invalid-response");
    }

    const parsed = GetCartResponseSchema.safeParse(raw);

    if (!parsed.success) {
      if (rawObj.status === "success" || rawObj.numOfCartItems === 0) {
        return createEmptyCart();
      }
      throw new GetCartApiError("invalid-response");
    }

    return adaptCartResponse(parsed.data);
  } catch (error) {
    if (error instanceof GetCartApiError) throw error;
    if (error instanceof SessionRequiredError) throw new GetCartApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.status === 404) {
        return createEmptyCart();
      }
      if (error.status === 401) throw new GetCartApiError("unauthorized");
      if (error.code === "unavailable") throw new GetCartApiError("unavailable");
      if (error.code === "invalid-response") throw new GetCartApiError("invalid-response");
    }
    throw new GetCartApiError("upstream-failure");
  }
}
