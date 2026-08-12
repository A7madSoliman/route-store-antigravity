import "server-only";

import { publicPutJson } from "@/lib/api/transport/public-request.server";
import { resetPasswordResponseSchema } from "@/lib/api/schemas/reset-password-response.schema.server";

export class ResetPasswordApiError extends Error {
  constructor() {
    super("The password reset request could not be completed safely.");
    this.name = "ResetPasswordApiError";
  }
}

function isResetPasswordApiError(error: unknown): error is ResetPasswordApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ResetPasswordApiError"
  );
}

export async function resetPassword(input: {
  email: string;
  newPassword: string;
}): Promise<"reset"> {
  try {
    const response = await publicPutJson(["auth", "resetPassword"], {
      email: input.email,
      newPassword: input.newPassword,
    });

    if (response.status !== 200) {
      throw new ResetPasswordApiError();
    }

    const parsed = resetPasswordResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new ResetPasswordApiError();
    }

    void parsed.data.token;
    return "reset";
  } catch (error) {
    if (isResetPasswordApiError(error)) {
      throw error;
    }

    throw new ResetPasswordApiError();
  }
}

