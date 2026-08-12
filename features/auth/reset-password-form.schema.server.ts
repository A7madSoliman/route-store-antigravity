import "server-only";

import { z } from "zod";

const requiredText = z.string().refine((value) => value.trim().length > 0, "This field is required.");
const requiredEmail = requiredText.refine(
  (value) => z.string().email().safeParse(value).success,
  "Enter a valid email address.",
);

export const resetPasswordFormSchema = z
  .object({
    email: requiredEmail,
    newPassword: requiredText,
    rePassword: requiredText,
  })
  .superRefine((values, context) => {
    if (values.newPassword !== values.rePassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rePassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export function parseResetPasswordFormData(
  formData: FormData,
):
  | { success: true; data: ResetPasswordFormValues }
  | { success: false; email: string; message: string; fieldErrors: Record<string, string> } {
  const values = {
    email: formData.get("email"),
    newPassword: formData.get("newPassword"),
    rePassword: formData.get("rePassword"),
  };
  const email = typeof values.email === "string" ? values.email : "";
  const result = resetPasswordFormSchema.safeParse(values);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && fieldErrors[field] === undefined) {
        fieldErrors[field] = issue.message;
      }
    }

    return {
      success: false,
      email,
      message: result.error.issues[0]?.message ?? "Check the highlighted fields.",
      fieldErrors,
    };
  }

  return { success: true, data: result.data };
}

