import "server-only";

import { z } from "zod";
import type { SecurityField } from "@/features/account/security/security-state";

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    password: z.string().min(8, "New password must be at least 8 characters."),
    rePassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });

export type ParsedChangePasswordInput =
  | {
      success: true;
      data: {
        currentPassword: string;
        password: string;
        rePassword: string;
      };
    }
  | {
      success: false;
      field?: SecurityField;
      message: string;
    };

export function parseChangePasswordFormData(formData: FormData): ParsedChangePasswordInput {
  const currentPasswordRaw = formData.get("currentPassword");
  const passwordRaw = formData.get("password");
  const rePasswordRaw = formData.get("rePassword");

  const rawValues = {
    currentPassword: typeof currentPasswordRaw === "string" ? currentPasswordRaw : "",
    password: typeof passwordRaw === "string" ? passwordRaw : "",
    rePassword: typeof rePasswordRaw === "string" ? rePasswordRaw : "",
  };

  const parsed = changePasswordFormSchema.safeParse(rawValues);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const issuePath = firstIssue?.path[0] as SecurityField | undefined;
    return {
      success: false,
      field: issuePath,
      message: firstIssue?.message ?? "Invalid password submission.",
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}
