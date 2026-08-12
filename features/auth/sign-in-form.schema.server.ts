import "server-only";
import { z } from "zod";
const requiredText = z.string().refine((value) => value.trim().length > 0, "This field is required.");
export const signInFormSchema = z.object({ email: requiredText, password: requiredText });
export type SignInFormValues = z.infer<typeof signInFormSchema>;
export function parseSignInFormData(formData: FormData): { success: true; data: SignInFormValues } | { success: false; email: string; message: string } {
  const emailValue = formData.get("email"); const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue : "";
  const result = signInFormSchema.safeParse({ email: emailValue, password: passwordValue });
  return result.success ? result : { success: false, email, message: result.error.issues[0]?.message ?? "Check the highlighted fields." };
}
