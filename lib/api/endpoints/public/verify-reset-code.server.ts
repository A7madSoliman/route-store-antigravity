import "server-only";

import type { PublicApiErrorCode } from "@/lib/api/errors.server";
import { publicPostJson } from "@/lib/api/transport/public-request.server";
import { verifyResetCodeResponseSchema } from "@/lib/api/schemas/verify-reset-code-response.schema.server";

export class VerifyResetCodeApiError extends Error {
  constructor() {
    super("The reset-code verification request could not be completed safely.");
    this.name = "VerifyResetCodeApiError";
  }
}

function isPublicTransportError(
  error: unknown,
): error is { code: PublicApiErrorCode } {
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

function isVerifyResetCodeApiError(error: unknown): error is VerifyResetCodeApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "VerifyResetCodeApiError"
  );
}

function mapTransportFailure(error: unknown): never {
  if (isPublicTransportError(error)) {
    throw new VerifyResetCodeApiError();
  }

  throw new VerifyResetCodeApiError();
}

export async function verifyResetCode(input: { resetCode: string }): Promise<"verified"> {
  try {
    const response = await publicPostJson(["auth", "verifyResetCode"], {
      resetCode: input.resetCode,
    });

    if (response.status !== 200) {
      throw new VerifyResetCodeApiError();
    }

    const parsed = verifyResetCodeResponseSchema.safeParse(response.body);
    if (!parsed.success) {
      throw new VerifyResetCodeApiError();
    }

    return "verified";
  } catch (error) {
    if (isVerifyResetCodeApiError(error)) {
      throw error;
    }

    return mapTransportFailure(error);
  }
}
