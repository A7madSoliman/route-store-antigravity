"use server";

import { requestPasswordReset, ForgotPasswordApiError } from "@/lib/api/endpoints/public/forgot-password.server";
import { parseForgotPasswordFormData } from "@/features/auth/forgot-password-form.schema.server";
import {
  forgotPasswordConfirmation,
  type ForgotPasswordState,
} from "@/features/auth/forgot-password-state";

const recoveryErrorMessage = "We couldn't start password recovery. Please try again.";

export async function forgotPasswordAction(
  _previous: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = parseForgotPasswordFormData(formData);

  if (!parsed.success) {
    return { status: "error", email: parsed.email, message: parsed.message };
  }

  try {
    await requestPasswordReset({ email: parsed.data.email });
    return {
      status: "success",
      email: "",
      message: forgotPasswordConfirmation,
    };
  } catch (error) {
    if (error instanceof ForgotPasswordApiError) {
      return {
        status: "error",
        email: parsed.data.email,
        message: recoveryErrorMessage,
      };
    }

    throw error;
  }
}
