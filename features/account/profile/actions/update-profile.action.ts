"use server";

import { revalidatePath } from "next/cache";

import { parseProfileFieldFormData } from "@/features/account/profile/profile-form.schema.server";
import { type ProfileUpdateState } from "@/features/account/profile/profile-state";
import { updateProfile, UpdateProfileApiError } from "@/lib/api/endpoints/protected/update-profile.server";
import { requireSession } from "@/lib/auth/require-session.server";
import { updateSessionIdentity } from "@/lib/auth/session.server";

export async function updateProfileAction(
  previousState: ProfileUpdateState,
  formData: FormData,
): Promise<ProfileUpdateState> {
  const session = await requireSession();
  const parsed = parseProfileFieldFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      field: parsed.field,
      message: parsed.message,
    };
  }

  try {
    if (parsed.field === "name") {
      const result = await updateProfile({ name: parsed.value });
      await updateSessionIdentity({
        name: result.user.name,
        email: session.user.email,
      });
      revalidatePath("/account/profile");
      return {
        status: "success",
        field: "name",
        message: "Your name has been updated successfully.",
        updatedValue: result.user.name,
      };
    }

    if (parsed.field === "email") {
      const result = await updateProfile({ email: parsed.value });
      await updateSessionIdentity({
        name: session.user.name,
        email: result.user.email,
      });
      revalidatePath("/account/profile");
      return {
        status: "success",
        field: "email",
        message: "Your email has been updated successfully.",
        updatedValue: result.user.email,
      };
    }

    if (parsed.field === "phone") {
      await updateProfile({ phone: parsed.value });
      revalidatePath("/account/profile");
      return {
        status: "success",
        field: "phone",
        message: "Your phone number has been updated successfully.",
        updatedValue: parsed.value,
      };
    }

    return {
      status: "error",
      message: "Unsupported profile update field.",
    };
  } catch (error) {
    if (error instanceof UpdateProfileApiError) {
      if (error.code === "duplicate-email") {
        return {
          status: "error",
          field: "email",
          message: "An account with this email already exists.",
        };
      }
      if (error.code === "unauthorized") {
        return {
          status: "error",
          message: "Your session has expired. Please sign in again.",
        };
      }
      if (error.code === "unavailable") {
        return {
          status: "error",
          message: "Profile service is temporarily unavailable. Please try again.",
        };
      }
      return {
        status: "error",
        message: "We could not update your profile. Please try again.",
      };
    }
    throw error;
  }
}
