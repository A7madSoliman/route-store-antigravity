import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedDelete } from "@/lib/api/transport/protected-request.server";
import { RemoveAddressResponseSchema } from "@/lib/api/schemas/remove-address-response.schema.server";
import { adaptAddressesResponse } from "@/lib/api/adapters/address.adapter.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";
import type { Address } from "@/types/address";

export type RemoveAddressErrorCode =
  | "unauthorized"
  | "not-found"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class RemoveAddressApiError extends Error {
  constructor(readonly code: RemoveAddressErrorCode) {
    super("The address could not be removed safely.");
    this.name = "RemoveAddressApiError";
  }
}

export async function removeAddress(
  addressId: string,
): Promise<{ message: string; addresses: Address[] }> {
  if (!addressId || typeof addressId !== "string" || addressId.trim().length === 0) {
    throw new RemoveAddressApiError("rejected");
  }

  try {
    const response = await protectedDelete(["addresses", addressId]);

    if (response.status === 401) {
      throw new RemoveAddressApiError("unauthorized");
    }
    if (response.status === 404) {
      throw new RemoveAddressApiError("not-found");
    }
    if (response.status !== 200) {
      throw new RemoveAddressApiError("upstream-failure");
    }

    const parsed = RemoveAddressResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      return {
        message: "Address removed successfully to your addresses",
        addresses: [],
      };
    }

    return {
      message: parsed.data.message,
      addresses: adaptAddressesResponse(parsed.data),
    };
  } catch (error) {
    if (error instanceof RemoveAddressApiError) throw error;
    if (error instanceof SessionRequiredError) throw new RemoveAddressApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new RemoveAddressApiError("unavailable");
      if (error.code === "invalid-response") throw new RemoveAddressApiError("invalid-response");
      if (error.status === 401) throw new RemoveAddressApiError("unauthorized");
      if (error.status === 404) throw new RemoveAddressApiError("not-found");
    }
    throw new RemoveAddressApiError("upstream-failure");
  }
}
