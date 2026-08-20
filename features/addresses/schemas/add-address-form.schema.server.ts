import "server-only";

import { z } from "zod";

export const AddAddressFormSchema = z.object({
  name: z.string().trim().min(1, "Address label is required (e.g. Home, Work)"),
  details: z.string().trim().min(1, "Street and building details are required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9+ ]{8,20}$/, "Please enter a valid phone number"),
  city: z.string().trim().min(1, "City is required"),
});

export type AddAddressFormData = z.infer<typeof AddAddressFormSchema>;

export type AddAddressFormValidationResult =
  | { success: true; data: AddAddressFormData }
  | { success: false; fieldErrors: Partial<Record<keyof AddAddressFormData, string>>; error: string };

export function parseAddAddressFormData(formData: FormData): AddAddressFormValidationResult {
  const raw = {
    name: typeof formData.get("name") === "string" ? formData.get("name") : "",
    details: typeof formData.get("details") === "string" ? formData.get("details") : "",
    phone: typeof formData.get("phone") === "string" ? formData.get("phone") : "",
    city: typeof formData.get("city") === "string" ? formData.get("city") : "",
  };

  const result = AddAddressFormSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: Partial<Record<keyof AddAddressFormData, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof AddAddressFormData;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return {
    success: false,
    fieldErrors,
    error: "Please correct the highlighted errors.",
  };
}
