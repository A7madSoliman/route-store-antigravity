import "server-only";

import { z } from "zod";

const requiredText = z.string().refine((value) => value.trim().length > 0, "This field is required.");

export const signUpFormSchema = z
  .object({
    name: requiredText,
    email: requiredText,
    password: requiredText,
    rePassword: requiredText,
    phone: requiredText,
  })
  .superRefine((values, context) => {
    if (values.password !== values.rePassword) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["rePassword"], message: "Passwords do not match." });
    }
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export function parseSignUpFormData(formData: FormData):
  | { success: true; data: SignUpFormValues }
  | { success: false; message: string; name: string; email: string; phone: string } {
  const values = Object.fromEntries(["name", "email", "password", "rePassword", "phone"].map((key) => [key, formData.get(key)]));
  const safe = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");
  const result = signUpFormSchema.safeParse(values);
  const name = safe(formData.get("name"));
  const email = safe(formData.get("email"));
  const phone = safe(formData.get("phone"));
  if (!result.success) {
    return { success: false, message: result.error.issues[0]?.message ?? "Check the highlighted fields.", name, email, phone };
  }
  return { success: true, data: result.data };
}
