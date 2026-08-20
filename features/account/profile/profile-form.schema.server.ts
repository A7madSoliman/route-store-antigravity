import "server-only";

import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(50, "Name cannot exceed 50 characters.");

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.")
  .max(100, "Email cannot exceed 100 characters.");

const phoneSchema = z
  .string()
  .trim()
  .min(10, "Please enter a valid phone number.")
  .max(20, "Phone number cannot exceed 20 characters.");

export type ParsedProfileFieldInput =
  | { success: true; field: "name"; value: string }
  | { success: true; field: "email"; value: string }
  | { success: true; field: "phone"; value: string }
  | { success: false; field: "name" | "email" | "phone"; message: string };

export function parseProfileFieldFormData(formData: FormData): ParsedProfileFieldInput {
  const field = formData.get("field");
  if (field === "name") {
    const raw = formData.get("name");
    if (typeof raw !== "string" || raw.trim().length === 0) {
      return { success: false, field: "name", message: "Name is required." };
    }
    const parsed = nameSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, field: "name", message: parsed.error.issues[0]?.message ?? "Invalid name." };
    }
    return { success: true, field: "name", value: parsed.data };
  }

  if (field === "email") {
    const raw = formData.get("email");
    if (typeof raw !== "string" || raw.trim().length === 0) {
      return { success: false, field: "email", message: "Email is required." };
    }
    const parsed = emailSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, field: "email", message: parsed.error.issues[0]?.message ?? "Invalid email." };
    }
    return { success: true, field: "email", value: parsed.data };
  }

  if (field === "phone") {
    const raw = formData.get("phone");
    if (typeof raw !== "string" || raw.trim().length === 0) {
      return { success: false, field: "phone", message: "Phone number is required." };
    }
    const parsed = phoneSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, field: "phone", message: parsed.error.issues[0]?.message ?? "Invalid phone number." };
    }
    return { success: true, field: "phone", value: parsed.data };
  }

  return { success: false, field: "name", message: "Invalid form submission." };
}
