"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addAddress, AddAddressApiError } from "@/lib/api/endpoints/protected/add-address.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";
import {
  parseAddAddressFormData,
  type AddAddressFormData,
} from "@/features/addresses/schemas/add-address-form.schema.server";

export type AddAddressState =
  | { status: "idle" }
  | {
      status: "invalid";
      fieldErrors: Partial<Record<keyof AddAddressFormData, string>>;
      message: string;
    }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

export async function addAddressAction(
  _previousState: AddAddressState,
  formData: FormData,
): Promise<AddAddressState> {
  void _previousState;

  try {
    await requireSession();
  } catch (error) {
    if (error instanceof SessionRequiredError) {
      return {
        status: "unauthorized",
        message: "You must be signed in to add an address.",
      };
    }
    throw error;
  }

  const validation = parseAddAddressFormData(formData);
  if (!validation.success) {
    return {
      status: "invalid",
      fieldErrors: validation.fieldErrors,
      message: validation.error,
    };
  }

  try {
    await addAddress(validation.data);
  } catch (error) {
    if (error instanceof AddAddressApiError) {
      if (error.code === "unauthorized") {
        return {
          status: "unauthorized",
          message: "Your session has expired. Please sign in again.",
        };
      }
      if (error.code === "rejected") {
        return {
          status: "error",
          message: "Please verify that all address details and phone number are valid.",
        };
      }
      if (error.code === "unavailable") {
        return {
          status: "error",
          message: "Address service is temporarily unavailable. Please try again.",
        };
      }
      return {
        status: "error",
        message: "Could not save address. Please try again.",
      };
    }
    throw error;
  }

  revalidatePath("/account/addresses");
  redirect("/account/addresses");
}
