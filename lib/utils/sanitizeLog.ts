/**
 * Utility to sanitize objects before logging to avoid leaking secrets or PII.
 * Redacts fields like token, password, email, phone, and any key containing 'secret' or 'key'.
 */
export function sanitizeLog<T extends object>(data: T): string {
  const redacted = /^(token|password|email|phone|.*secret.*|.*key.*)$/i;
  const replacer = (key: string, value: unknown) => {
    if (redacted.test(key)) {
      return '[REDACTED]';
    }
    return value;
  };
  return JSON.stringify(data, replacer, 2);
}
