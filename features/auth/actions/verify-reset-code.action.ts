"use server";

import { parseVerifyResetCodeFormData } from "@/features/auth/verify-reset-code-form.schema.server";
import {
  initialVerifyResetCodeState,
  verifyResetCodeErrorMessage,
  verifyResetCodeSuccessMessage,
  type VerifyResetCodeState,
} from "@/features/auth/verify-reset-code-state";
import {
  verifyResetCode,
  VerifyResetCodeApiError,
} from "@/lib/api/endpoints/public/verify-reset-code.server";

export async function verifyResetCodeAction(
  _previous: VerifyResetCodeState,
  formData: FormData,
): Promise<VerifyResetCodeState> {
  const parsed = parseVerifyResetCodeFormData(formData);

  if (!parsed.success) {
    return { status: "error", message: parsed.message };
  }

  try {
    await verifyResetCode({ resetCode: parsed.data.resetCode });
    return { status: "success", message: verifyResetCodeSuccessMessage };
  } catch (error) {
    if (error instanceof VerifyResetCodeApiError) {
      return { status: "error", message: verifyResetCodeErrorMessage };
    }

    throw error;
  }
}

export { initialVerifyResetCodeState };
