import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPutJson } from "@/lib/api/transport/protected-request.server";
import { updateProfileResponseSchema } from "@/lib/api/schemas/update-profile-response.schema.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

export type UpdateProfileInput =
  | { name: string; email?: never; phone?: never }
  | { email: string; name?: never; phone?: never }
  | { phone: string; name?: never; email?: never };

export type UpdateProfileErrorCode =
  | "unauthorized"
  | "duplicate-email"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class UpdateProfileApiError extends Error {
  constructor(readonly code: UpdateProfileErrorCode) {
    super("The profile update request could not be completed safely.");
    this.name = "UpdateProfileApiError";
  }
}

export async function updateProfile(input: UpdateProfileInput): Promise<{ user: { name: string; email: string } }> {
  const keys = Object.keys(input);
  if (keys.length !== 1 || !["name", "email", "phone"].includes(keys[0])) {
    throw new UpdateProfileApiError("rejected");
  }

  try {
    const response = await protectedPutJson(["users", "updateMe"], input);
    if (response.status === 401) {
      throw new UpdateProfileApiError("unauthorized");
    }
    if (response.status === 400) {
      if (
        typeof response.body === "object" &&
        response.body !== null &&
        "errors" in response.body &&
        typeof (response.body as Record<string, unknown>).errors === "object"
      ) {
        const errors = (response.body as { errors?: { param?: string; msg?: string } }).errors;
        if (errors?.param === "email" || errors?.msg?.toLowerCase().includes("exist")) {
          throw new UpdateProfileApiError("duplicate-email");
        }
      }
      throw new UpdateProfileApiError("rejected");
    }
    if (response.status !== 200) {
      throw new UpdateProfileApiError("upstream-failure");
    }

    const parsed = updateProfileResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new UpdateProfileApiError("invalid-response");
    }

    return {
      user: {
        name: parsed.data.user.name,
        email: parsed.data.user.email,
      },
    };
  } catch (error) {
    if (error instanceof UpdateProfileApiError) throw error;
    if (error instanceof SessionRequiredError) throw new UpdateProfileApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new UpdateProfileApiError("unavailable");
      if (error.code === "invalid-response") throw new UpdateProfileApiError("invalid-response");
      if (error.status === 401) throw new UpdateProfileApiError("unauthorized");
      if (error.status === 400) throw new UpdateProfileApiError("rejected");
    }
    throw new UpdateProfileApiError("upstream-failure");
  }
}
