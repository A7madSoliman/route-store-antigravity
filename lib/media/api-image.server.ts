import "server-only";

const approvedMediaOrigin = "https://ecommerce.routemisr.com";

export function normalizeApiImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "ecommerce.routemisr.com" ||
      url.port !== "" ||
      url.username !== "" ||
      url.password !== "" ||
      url.origin !== approvedMediaOrigin
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function normalizeApiImageGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const normalized = normalizeApiImageUrl(entry);
    return normalized === null ? [] : [normalized];
  });
}
