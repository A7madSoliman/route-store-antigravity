"use server";

import {
  resetPassword,
  ResetPasswordApiError,
} from "@/lib/api/endpoints/public/reset-password.server";
import { parseResetPasswordFormData } from "@/features/auth/reset-password-form.schema.server";
import {
  initialResetPasswordState,
  resetPasswordErrorMessage,
  resetPasswordSuccessMessage,
  type ResetPasswordState,
} from "@/features/auth/reset-password-state";

export async function resetPasswordAction(
  _previous: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = parseResetPasswordFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      email: parsed.email,
      message: parsed.message,
      fieldErrors: parsed.fieldErrors,
    };
  }

  try {
    await resetPassword({
      email: parsed.data.email,
      newPassword: parsed.data.newPassword,
    });
    return { status: "success", message: resetPasswordSuccessMessage };
  } catch (error) {
    if (error instanceof ResetPasswordApiError) {
      return { status: "error", email: parsed.data.email, message: resetPasswordErrorMessage };
    }

    throw error;
  }
}

export { initialResetPasswordState };

