import "server-only";

import { z } from "zod";

const requiredEmail = z
  .string()
  .refine((value) => value.trim().length > 0, "This field is required.")
  .refine((value) => z.string().email().safeParse(value).success, "Enter a valid email address.");

export const forgotPasswordFormSchema = z.object({ email: requiredEmail });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export function parseForgotPasswordFormData(
  formData: FormData,
):
  | { success: true; data: ForgotPasswordFormValues }
  | { success: false; email: string; message: string } {
  const emailValue = formData.get("email");
  const email = typeof emailValue === "string" ? emailValue : "";
  const result = forgotPasswordFormSchema.safeParse({ email: emailValue });

  if (!result.success) {
    return {
      success: false,
      email,
      message: result.error.issues[0]?.message ?? "Check the highlighted fields.",
    };
  }

  return { success: true, data: result.data };
}
