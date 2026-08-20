import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedDelete } from "@/lib/api/transport/protected-request.server";
import { RemoveFromWishlistResponseSchema } from "@/lib/api/schemas/remove-from-wishlist-response.schema.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

export type RemoveFromWishlistInput = {
  productId: string;
};

export type RemoveFromWishlistErrorCode =
  | "unauthorized"
  | "not-found"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class RemoveFromWishlistApiError extends Error {
  constructor(readonly code: RemoveFromWishlistErrorCode) {
    super("The remove from wishlist request could not be completed safely.");
    this.name = "RemoveFromWishlistApiError";
  }
}

export async function removeFromWishlist(input: RemoveFromWishlistInput): Promise<{ remainingProductIds: string[] }> {
  if (!input.productId || typeof input.productId !== "string" || input.productId.trim().length === 0) {
    throw new RemoveFromWishlistApiError("rejected");
  }

  try {
    const response = await protectedDelete(["wishlist", input.productId]);

    if (response.status === 401) {
      throw new RemoveFromWishlistApiError("unauthorized");
    }
    if (response.status === 404) {
      throw new RemoveFromWishlistApiError("not-found");
    }
    if (response.status === 400) {
      throw new RemoveFromWishlistApiError("rejected");
    }
    if (response.status !== 200) {
      throw new RemoveFromWishlistApiError("upstream-failure");
    }

    const parsed = RemoveFromWishlistResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new RemoveFromWishlistApiError("invalid-response");
    }

    return {
      remainingProductIds: parsed.data.data,
    };
  } catch (error) {
    if (error instanceof RemoveFromWishlistApiError) throw error;
    if (error instanceof SessionRequiredError) throw new RemoveFromWishlistApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new RemoveFromWishlistApiError("unavailable");
      if (error.code === "invalid-response") throw new RemoveFromWishlistApiError("invalid-response");
      if (error.status === 401) throw new RemoveFromWishlistApiError("unauthorized");
      if (error.status === 404) throw new RemoveFromWishlistApiError("not-found");
      if (error.status === 400) throw new RemoveFromWishlistApiError("rejected");
    }
    throw new RemoveFromWishlistApiError("upstream-failure");
  }
}
