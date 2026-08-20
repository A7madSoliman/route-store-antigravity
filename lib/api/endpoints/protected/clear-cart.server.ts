import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedDelete } from "@/lib/api/transport/protected-request.server";
import { ClearCartResponseSchema } from "@/lib/api/schemas/clear-cart-response.schema.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

export type ClearCartErrorCode =
  | "unauthorized"
  | "not-found"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class ClearCartApiError extends Error {
  constructor(readonly code: ClearCartErrorCode) {
    super("The clear cart request could not be completed safely.");
    this.name = "ClearCartApiError";
  }
}

export async function clearCart(): Promise<{ message: string }> {
  try {
    const response = await protectedDelete(["cart"]);

    if (response.status === 401) {
      throw new ClearCartApiError("unauthorized");
    }
    if (response.status === 404) {
      throw new ClearCartApiError("not-found");
    }
    if (response.status !== 200) {
      throw new ClearCartApiError("upstream-failure");
    }

    const parsed = ClearCartResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new ClearCartApiError("invalid-response");
    }

    return { message: parsed.data.message };
  } catch (error) {
    if (error instanceof ClearCartApiError) throw error;
    if (error instanceof SessionRequiredError) throw new ClearCartApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new ClearCartApiError("unavailable");
      if (error.code === "invalid-response") throw new ClearCartApiError("invalid-response");
      if (error.status === 401) throw new ClearCartApiError("unauthorized");
      if (error.status === 404) throw new ClearCartApiError("not-found");
    }
    throw new ClearCartApiError("upstream-failure");
  }
}
