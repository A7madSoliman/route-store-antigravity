import "server-only";

import type { PublicApiErrorCode } from "@/lib/api/errors.server";
import { forgotPasswordResponseSchema } from "@/lib/api/schemas/forgot-password-response.schema.server";
import { publicPostJson } from "@/lib/api/transport/public-request.server";

export type ForgotPasswordErrorCode =
  | "rejected"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class ForgotPasswordApiError extends Error {
  constructor(readonly code: ForgotPasswordErrorCode) {
    super("The password-recovery request could not be completed safely.");
    this.name = "ForgotPasswordApiError";
  }
}

export type ForgotPasswordRequestResult = "confirmation";

function isPublicTransportError(
  error: unknown,
): error is { code: PublicApiErrorCode; status?: number } {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  const code = error.code;
  return (
    code === "invalid-request" ||
    code === "not-found" ||
    code === "unavailable" ||
    code === "invalid-response" ||
    code === "upstream-failure"
  );
}

function isForgotPasswordApiError(error: unknown): error is ForgotPasswordApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ForgotPasswordApiError"
  );
}

export function mapForgotPasswordTransportFailure(
  error: unknown,
): ForgotPasswordRequestResult {
  if (isPublicTransportError(error)) {
    if (error.status === 404) {
      return "confirmation";
    }
    if (error.status && error.status >= 400 && error.status < 500) {
      throw new ForgotPasswordApiError("rejected");
    }
    if (error.code === "unavailable") {
      throw new ForgotPasswordApiError("unavailable");
    }
    if (error.code === "invalid-response") {
      throw new ForgotPasswordApiError("invalid-response");
    }
  }

  throw new ForgotPasswordApiError("upstream-failure");
}

export async function requestPasswordReset(input: {
  email: string;
}): Promise<ForgotPasswordRequestResult> {
  try {
    const response = await publicPostJson(["auth", "forgotPasswords"], {
      email: input.email,
    });

    if (response.status === 404) {
      return "confirmation";
    }

    if (response.status !== 200) {
      throw new ForgotPasswordApiError("upstream-failure");
    }

    const parsed = forgotPasswordResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new ForgotPasswordApiError("invalid-response");
    }

    return "confirmation";
  } catch (error) {
    if (isForgotPasswordApiError(error)) {
      throw error;
    }
    return mapForgotPasswordTransportFailure(error);
  }
}
