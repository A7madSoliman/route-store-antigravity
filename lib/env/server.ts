import "server-only";

import { z } from "zod";

const verifiedApiHost = "ecommerce.routemisr.com";
const verifiedApiPath = "/api/v1";

const environmentSchema = z.object({
  ECOMMERCE_API_BASE_URL: z.string().min(1),
  APP_ORIGIN: z.string().min(1),
});

const sessionEnvironmentSchema = z.object({
  SESSION_ENCRYPTION_KEY: z.string().min(1),
});

export type ServerEnvironment = Readonly<{
  ecommerceApiBaseUrl: string;
  appOrigin: string;
}>;

export type SessionEnvironment = Readonly<{
  sessionEncryptionKey: string;
}>;

export class EnvironmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvironmentValidationError";
  }
}

function parseUrl(value: string, variableName: string): URL {
  try {
    return new URL(value);
  } catch {
    throw new EnvironmentValidationError(`${variableName} must be an absolute URL.`);
  }
}

function validateApiBase(value: string): string {
  const url = parseUrl(value, "ECOMMERCE_API_BASE_URL");

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.hostname !== verifiedApiHost ||
    url.pathname.replace(/\/$/, "") !== verifiedApiPath
  ) {
    throw new EnvironmentValidationError(
      "ECOMMERCE_API_BASE_URL must use the verified API host and /api/v1 path without credentials, query, or fragment.",
    );
  }

  return `${url.protocol}//${url.host}${verifiedApiPath}`;
}

function validateAppOrigin(value: string): string {
  const url = parseUrl(value, "APP_ORIGIN");
  const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    (!isLocalhost && url.protocol !== "https:")
  ) {
    throw new EnvironmentValidationError(
      "APP_ORIGIN must be an origin without credentials, path, query, or fragment; external origins require HTTPS.",
    );
  }

  return url.origin;
}

export function parseServerEnvironment(input: Record<string, string | undefined>): ServerEnvironment {
  const parsed = environmentSchema.safeParse(input);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => issue.path[0])
      .filter((name): name is string => typeof name === "string")
      .join(", ");
    throw new EnvironmentValidationError(`Missing environment variable: ${missing}.`);
  }

  return Object.freeze({
    ecommerceApiBaseUrl: validateApiBase(parsed.data.ECOMMERCE_API_BASE_URL),
    appOrigin: validateAppOrigin(parsed.data.APP_ORIGIN),
  });
}

export function getServerEnvironment(): ServerEnvironment {
  return parseServerEnvironment({
    ECOMMERCE_API_BASE_URL: process.env.ECOMMERCE_API_BASE_URL ?? "https://ecommerce.routemisr.com/api/v1",
    APP_ORIGIN: process.env.APP_ORIGIN ?? "http://localhost:3000",
  });
}

function validateSessionEncryptionKey(value: string): string {
  if (!/^[A-Za-z0-9_-]{43}$/u.test(value)) {
    throw new EnvironmentValidationError(
      "SESSION_ENCRYPTION_KEY must be 32 bytes encoded as 43 unpadded base64url characters.",
    );
  }

  let decoded: Uint8Array;
  try {
    decoded = Uint8Array.from(Buffer.from(value, "base64url"));
  } catch {
    throw new EnvironmentValidationError("SESSION_ENCRYPTION_KEY is invalid.");
  }

  if (decoded.length !== 32) {
    throw new EnvironmentValidationError(
      "SESSION_ENCRYPTION_KEY must decode to exactly 32 bytes.",
    );
  }

  return value;
}

export function parseSessionEnvironment(
  input: Record<string, string | undefined>,
): SessionEnvironment {
  const parsed = sessionEnvironmentSchema.safeParse(input);

  if (!parsed.success) {
    throw new EnvironmentValidationError("Missing environment variable: SESSION_ENCRYPTION_KEY.");
  }

  return Object.freeze({
    sessionEncryptionKey: validateSessionEncryptionKey(parsed.data.SESSION_ENCRYPTION_KEY),
  });
}

export function getSessionEnvironment(): SessionEnvironment {
  return parseSessionEnvironment(process.env);
}
