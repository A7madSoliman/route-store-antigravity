"use server";

import { revalidatePath } from "next/cache";

import { parseChangePasswordFormData } from "@/features/account/security/security-form.schema.server";
import { type PasswordChangeState } from "@/features/account/security/security-state";
import { changePassword, ChangePasswordApiError } from "@/lib/api/endpoints/protected/change-password.server";
import { requireSession } from "@/lib/auth/require-session.server";
import { setSession } from "@/lib/auth/session.server";

export async function changePasswordAction(
  previousState: PasswordChangeState,
  formData: FormData,
): Promise<PasswordChangeState> {
  const session = await requireSession();
  const parsed = parseChangePasswordFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      field: parsed.field,
      message: parsed.message,
    };
  }

  try {
    const result = await changePassword(parsed.data);

    // Re-seal session cookie with the new token returned from PUT /users/changeMyPassword
    await setSession(result.token, {
      name: session.user.name,
      email: session.user.email,
    });

    revalidatePath("/account/security");

    return {
      status: "success",
      message: "Your password has been changed successfully.",
    };
  } catch (error) {
    if (error instanceof ChangePasswordApiError) {
      if (error.code === "wrong-current-password") {
        return {
          status: "error",
          field: "currentPassword",
          message: "Current password is incorrect.",
        };
      }
      if (error.code === "unauthorized") {
        return {
          status: "error",
          message: "Your session has expired. Please sign in again.",
        };
      }
      if (error.code === "unavailable") {
        return {
          status: "error",
          message: "Security service is temporarily unavailable. Please try again.",
        };
      }
      if (error.code === "rejected") {
        return {
          status: "error",
          message: "Could not update password. Please check your inputs and try again.",
        };
      }
      return {
        status: "error",
        message: "We could not change your password. Please try again.",
      };
    }
    throw error;
  }
}
