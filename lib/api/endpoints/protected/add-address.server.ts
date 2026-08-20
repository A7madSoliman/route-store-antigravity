import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPostJson } from "@/lib/api/transport/protected-request.server";
import {
  AddAddressInputSchema,
  AddAddressResponseSchema,
  type AddAddressInput,
} from "@/lib/api/schemas/add-address-response.schema.server";
import { adaptAddressesResponse } from "@/lib/api/adapters/address.adapter.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";
import type { Address } from "@/types/address";

export type AddAddressErrorCode =
  | "unauthorized"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class AddAddressApiError extends Error {
  constructor(readonly code: AddAddressErrorCode) {
    super("The address could not be added safely.");
    this.name = "AddAddressApiError";
  }
}

export async function addAddress(
  input: AddAddressInput,
): Promise<{ message: string; addresses: Address[] }> {
  const inputValidation = AddAddressInputSchema.safeParse(input);
  if (!inputValidation.success) {
    throw new AddAddressApiError("rejected");
  }

  try {
    const response = await protectedPostJson(["addresses"], inputValidation.data);

    if (response.status === 401) {
      throw new AddAddressApiError("unauthorized");
    }
    if (response.status === 400) {
      throw new AddAddressApiError("rejected");
    }
    if (response.status !== 200 && response.status !== 201) {
      throw new AddAddressApiError("upstream-failure");
    }

    const parsed = AddAddressResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      return {
        message: "Address added successfully to your addresses",
        addresses: [],
      };
    }

    return {
      message: parsed.data.message,
      addresses: adaptAddressesResponse(parsed.data),
    };
  } catch (error) {
    if (error instanceof AddAddressApiError) throw error;
    if (error instanceof SessionRequiredError) throw new AddAddressApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new AddAddressApiError("unavailable");
      if (error.code === "invalid-response") throw new AddAddressApiError("invalid-response");
      if (error.status === 401) throw new AddAddressApiError("unauthorized");
      if (error.status === 400) throw new AddAddressApiError("rejected");
    }
    throw new AddAddressApiError("upstream-failure");
  }
}
