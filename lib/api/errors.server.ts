import "server-only";

export type PublicApiErrorCode =
  | "invalid-request"
  | "not-found"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

const safeMessages: Record<PublicApiErrorCode, string> = {
  "invalid-request": "The catalog request was invalid.",
  "not-found": "The requested catalog resource was not found.",
  unavailable: "The catalog service is temporarily unavailable.",
  "invalid-response": "The catalog service returned an invalid response.",
  "upstream-failure": "The catalog service could not complete the request.",
};

export class PublicApiError extends Error {
  readonly code: PublicApiErrorCode;
  readonly status?: number;

  constructor(code: PublicApiErrorCode, status?: number) {
    super(safeMessages[code]);
    this.name = "PublicApiError";
    this.code = code;
    this.status = status;
  }
}

export function publicApiError(
  code: PublicApiErrorCode,
  status?: number,
): PublicApiError {
  return new PublicApiError(code, status);
}

export type ProtectedApiErrorCode =
  | "invalid-request"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

const protectedSafeMessages: Record<ProtectedApiErrorCode, string> = {
  "invalid-request": "The protected request was invalid.",
  unavailable: "The protected service is temporarily unavailable.",
  "invalid-response": "The protected service returned an invalid response.",
  "upstream-failure": "The protected service could not complete the request.",
};

export class ProtectedApiError extends Error {
  readonly code: ProtectedApiErrorCode;
  readonly status?: number;

  constructor(code: ProtectedApiErrorCode, status?: number) {
    super(protectedSafeMessages[code]);
    this.name = "ProtectedApiError";
    this.code = code;
    this.status = status;
  }
}
