import "server-only";

import { z } from "zod";

const resetCodeValue = z
  .string()
  .refine((value) => value.trim().length > 0, "Enter the reset code.");

export const verifyResetCodeFormSchema = z.object({ resetCode: resetCodeValue });

export type VerifyResetCodeFormValues = z.infer<typeof verifyResetCodeFormSchema>;

export function parseVerifyResetCodeFormData(
  formData: FormData,
):
  | { success: true; data: VerifyResetCodeFormValues }
  | { success: false; message: string } {
  const resetCodeValueFromForm = formData.get("resetCode");
  const result = verifyResetCodeFormSchema.safeParse({ resetCode: resetCodeValueFromForm });

  if (!result.success) {
    return { success: false, message: "Enter the reset code." };
  }

  return { success: true, data: result.data };
}
