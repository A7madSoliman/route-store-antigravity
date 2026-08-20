import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedGet } from "@/lib/api/transport/protected-request.server";
import { GetAddressesResponseSchema } from "@/lib/api/schemas/get-addresses-response.schema.server";
import { adaptAddressesResponse } from "@/lib/api/adapters/address.adapter.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";
import type { Address } from "@/types/address";

export type GetAddressesErrorCode =
  | "unauthorized"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class GetAddressesApiError extends Error {
  constructor(readonly code: GetAddressesErrorCode) {
    super("Your addresses could not be loaded safely.");
    this.name = "GetAddressesApiError";
  }
}

export async function getAddresses(): Promise<Address[]> {
  try {
    const raw = await protectedGet(["addresses"]);
    if (!raw || typeof raw !== "object") {
      return [];
    }

    const rawObj = raw as Record<string, unknown>;
    if (rawObj.status && rawObj.status !== "success") {
      throw new GetAddressesApiError("invalid-response");
    }

    const parsed = GetAddressesResponseSchema.safeParse(raw);
    if (!parsed.success) {
      if (rawObj.status === "success") {
        return [];
      }
      throw new GetAddressesApiError("invalid-response");
    }

    return adaptAddressesResponse(parsed.data);
  } catch (error) {
    if (error instanceof GetAddressesApiError) throw error;
    if (error instanceof SessionRequiredError) throw new GetAddressesApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.status === 404) return [];
      if (error.status === 401) throw new GetAddressesApiError("unauthorized");
      if (error.code === "unavailable") throw new GetAddressesApiError("unavailable");
      if (error.code === "invalid-response") throw new GetAddressesApiError("invalid-response");
    }
    throw new GetAddressesApiError("upstream-failure");
  }
}
