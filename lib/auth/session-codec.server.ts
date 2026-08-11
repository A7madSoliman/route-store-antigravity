import "server-only";

const cookieVersion = "v1";
const aad = "route-store-session:v1";
const maxTokenCharacters = 2_048;
const maxCookieValueCharacters = 3_800;

export type SessionMetadata = Readonly<{
  expiresAt: Date;
}>;

export class SessionValidationError extends Error {
  constructor() {
    super("The session token was invalid.");
    this.name = "SessionValidationError";
  }
}

function encodeBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function decodeBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) throw new Error("invalid encoding");
  const decoded = Uint8Array.from(Buffer.from(value, "base64url"));
  if (decoded.length === 0 || encodeBase64Url(decoded) !== value) throw new Error("invalid encoding");
  return decoded;
}

function importKey(key: string): Promise<CryptoKey> {
  const bytes = Uint8Array.from(Buffer.from(key, "base64url"));
  if (bytes.length !== 32) throw new Error("invalid key");
  return globalThis.crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}

function parseTokenExpiry(token: string, now: number): Date {
  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > maxTokenCharacters ||
    !/^[\x21-\x7e]+$/u.test(token)
  ) {
    throw new SessionValidationError();
  }

  const segments = token.split(".");
  if (
    segments.length !== 3 ||
    segments.some((segment) => segment.length === 0 || !/^[A-Za-z0-9_-]+$/u.test(segment))
  ) {
    throw new SessionValidationError();
  }

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(segments[1])));
  } catch {
    throw new SessionValidationError();
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new SessionValidationError();
  }

  const exp = (payload as Record<string, unknown>).exp;
  if (typeof exp !== "number" || !Number.isSafeInteger(exp) || exp <= Math.floor(now / 1_000)) {
    throw new SessionValidationError();
  }

  const expiresAt = new Date(exp * 1_000);
  if (!Number.isFinite(expiresAt.getTime()) || expiresAt.getTime() <= now) {
    throw new SessionValidationError();
  }

  return expiresAt;
}

export async function sealSessionToken(
  token: string,
  encryptionKey: string,
  now = Date.now(),
): Promise<Readonly<{ value: string; expiresAt: Date }>> {
  const expiresAt = parseTokenExpiry(token, now);
  const key = await importKey(encryptionKey);
  const iv = new Uint8Array(12);
  globalThis.crypto.getRandomValues(iv);
  const plaintext = new TextEncoder().encode(JSON.stringify({ v: 1, t: token }));
  const ciphertext = new Uint8Array(
    await globalThis.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
        additionalData: new TextEncoder().encode(aad) as BufferSource,
        tagLength: 128,
      },
      key,
      plaintext,
    ),
  );
  const value = `${cookieVersion}.${encodeBase64Url(iv)}.${encodeBase64Url(ciphertext)}`;
  if (value.length > maxCookieValueCharacters) throw new SessionValidationError();
  return Object.freeze({ value, expiresAt });
}

export async function unsealSessionToken(
  value: string | undefined,
  encryptionKey: string,
  now = Date.now(),
): Promise<Readonly<{ token: string; expiresAt: Date }> | null> {
  if (!value || value.length > maxCookieValueCharacters) return null;
  try {
    const [version, encodedIv, encodedCiphertext, extra] = value.split(".");
    if (version !== cookieVersion || !encodedIv || !encodedCiphertext || extra !== undefined) return null;
    const iv = decodeBase64Url(encodedIv);
    const ciphertext = decodeBase64Url(encodedCiphertext);
    if (iv.length !== 12 || ciphertext.length < 16) return null;
    const key = await importKey(encryptionKey);
    const plaintext = await globalThis.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
        additionalData: new TextEncoder().encode(aad) as BufferSource,
        tagLength: 128,
      },
      key,
      ciphertext as BufferSource,
    );
    const parsed: unknown = JSON.parse(new TextDecoder().decode(plaintext));
    const payloadRecord = parsed as Record<string, unknown>;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed) ||
      Object.keys(payloadRecord).length !== 2 ||
      payloadRecord.v !== 1 ||
      typeof payloadRecord.t !== "string"
    ) {
      return null;
    }
    const token = payloadRecord.t as string;
    const expiresAt = parseTokenExpiry(token, now);
    return Object.freeze({ token, expiresAt });
  } catch {
    return null;
  }
}
