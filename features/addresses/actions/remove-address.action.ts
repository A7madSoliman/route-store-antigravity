"use server";

import { revalidatePath } from "next/cache";

import { removeAddress, RemoveAddressApiError } from "@/lib/api/endpoints/protected/remove-address.server";
import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";

export type RemoveAddressState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };

export async function removeAddressAction(
  _previousState: RemoveAddressState,
  formData: FormData,
): Promise<RemoveAddressState> {
  void _previousState;

  try {
    await requireSession();
  } catch (error) {
    if (error instanceof SessionRequiredError) {
      return {
        status: "unauthorized",
        message: "You must be signed in to manage your addresses.",
      };
    }
    throw error;
  }

  const addressId = formData.get("addressId");
  if (typeof addressId !== "string" || addressId.trim().length === 0) {
    return {
      status: "error",
      message: "Invalid address selection.",
    };
  }

  try {
    const result = await removeAddress(addressId.trim());
    revalidatePath("/account/addresses");
    return {
      status: "success",
      message: result.message || "Address removed successfully.",
    };
  } catch (error) {
    if (error instanceof RemoveAddressApiError) {
      if (error.code === "unauthorized") {
        return {
          status: "unauthorized",
          message: "Your session has expired. Please sign in again.",
        };
      }
      if (error.code === "not-found") {
        return {
          status: "error",
          message: "Address not found or already removed.",
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
        message: "Could not remove address. Please try again.",
      };
    }
    throw error;
  }
}
