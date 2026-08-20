import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPutJson } from "@/lib/api/transport/protected-request.server";
import { changePasswordResponseSchema } from "@/lib/api/schemas/change-password-response.schema.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

export type ChangePasswordInput = {
  currentPassword: string;
  password: string;
  rePassword: string;
};

export type ChangePasswordErrorCode =
  | "unauthorized"
  | "wrong-current-password"
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class ChangePasswordApiError extends Error {
  constructor(readonly code: ChangePasswordErrorCode) {
    super("The password change request could not be completed safely.");
    this.name = "ChangePasswordApiError";
  }
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<{ user: { name: string; email: string }; token: string }> {
  if (
    !input ||
    typeof input.currentPassword !== "string" ||
    input.currentPassword.trim().length === 0 ||
    typeof input.password !== "string" ||
    input.password.trim().length === 0 ||
    typeof input.rePassword !== "string" ||
    input.rePassword.trim().length === 0
  ) {
    throw new ChangePasswordApiError("rejected");
  }

  try {
    const response = await protectedPutJson(["users", "changeMyPassword"], input);
    if (response.status === 401) {
      throw new ChangePasswordApiError("unauthorized");
    }
    if (response.status === 400) {
      if (typeof response.body === "object" && response.body !== null) {
        const bodyObj = response.body as Record<string, unknown>;
        const msg = String(bodyObj.message ?? "").toLowerCase();
        const errors = bodyObj.errors as { param?: string; msg?: string } | undefined;
        const errorMsg = String(errors?.msg ?? "").toLowerCase();
        const param = String(errors?.param ?? "");

        if (
          param === "currentPassword" ||
          msg.includes("current") ||
          msg.includes("incorrect") ||
          errorMsg.includes("current") ||
          errorMsg.includes("incorrect")
        ) {
          throw new ChangePasswordApiError("wrong-current-password");
        }
      }
      throw new ChangePasswordApiError("rejected");
    }
    if (response.status !== 200) {
      throw new ChangePasswordApiError("upstream-failure");
    }

    const parsed = changePasswordResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new ChangePasswordApiError("invalid-response");
    }

    return {
      user: {
        name: parsed.data.user.name,
        email: parsed.data.user.email,
      },
      token: parsed.data.token,
    };
  } catch (error) {
    if (error instanceof ChangePasswordApiError) throw error;
    if (error instanceof SessionRequiredError) throw new ChangePasswordApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.code === "unavailable") throw new ChangePasswordApiError("unavailable");
      if (error.code === "invalid-response") throw new ChangePasswordApiError("invalid-response");
      if (error.status === 401) throw new ChangePasswordApiError("unauthorized");
      if (error.status === 400) throw new ChangePasswordApiError("rejected");
    }
    throw new ChangePasswordApiError("upstream-failure");
  }
}
