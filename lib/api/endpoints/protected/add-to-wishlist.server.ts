import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPostJson } from "@/lib/api/transport/protected-request.server";
import { AddToWishlistResponseSchema } from "@/lib/api/schemas/add-to-wishlist-response.schema.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

export type AddToWishlistInput = {
  productId: string;
};

export type AddToWishlistErrorCode =
  | "unauthorized"
  | "not-found"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class AddToWishlistApiError extends Error {
  constructor(readonly code: AddToWishlistErrorCode) {
    super("The add to wishlist request could not be completed safely.");
    this.name = "AddToWishlistApiError";
  }
}

export async function addToWishlist(input: AddToWishlistInput): Promise<{ wishlistProductIds: string[] }> {
  if (!input.productId || typeof input.productId !== "string" || input.productId.trim().length === 0) {
    throw new AddToWishlistApiError("rejected");
  }

  try {
    const response = await protectedPostJson(["wishlist"], { productId: input.productId });

    if (response.status === 401) {
      throw new AddToWishlistApiError("unauthorized");
    }
    if (response.status === 404) {
      throw new AddToWishlistApiError("not-found");
    }
    if (response.status === 400) {
      throw new AddToWishlistApiError("rejected");
    }
    if (response.status !== 200) {
      throw new AddToWishlistApiError("upstream-failure");
    }

    const parsed = AddToWishlistResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new AddToWishlistApiError("invalid-response");
    }

    return {
      wishlistProductIds: parsed.data.data,
    };
  } catch (error) {
    if (error instanceof AddToWishlistApiError) throw error;
    if (error instanceof SessionRequiredError) throw new AddToWishlistApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new AddToWishlistApiError("unavailable");
      if (error.code === "invalid-response") throw new AddToWishlistApiError("invalid-response");
      if (error.status === 401) throw new AddToWishlistApiError("unauthorized");
      if (error.status === 404) throw new AddToWishlistApiError("not-found");
      if (error.status === 400) throw new AddToWishlistApiError("rejected");
    }
    throw new AddToWishlistApiError("upstream-failure");
  }
}
