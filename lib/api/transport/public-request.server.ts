import "server-only";

import { getServerEnvironment } from "@/lib/env/server";
import { PublicApiError } from "@/lib/api/errors.server";

const requestTimeoutMs = 10_000;

function assertPathSegment(segment: string): void {
  if (
    typeof segment !== "string" ||
    segment.length === 0 ||
    segment.trim().length === 0 ||
    /[\u0000-\u001f\u007f]/u.test(segment)
  ) {
    throw new PublicApiError("invalid-request");
  }
}

function buildUrl(
  baseUrl: string,
  pathSegments: readonly string[],
  searchParams?: URLSearchParams,
): URL {
  if (pathSegments.length === 0) {
    throw new PublicApiError("invalid-request");
  }
  pathSegments.forEach(assertPathSegment);
  const base = new URL(`${baseUrl}/`);
  const relativePath = pathSegments.map((segment) => encodeURIComponent(segment)).join("/");
  const url = new URL(relativePath, base);
  if (searchParams) {
    url.search = searchParams.toString();
  }
  return url;
}

function isAbortLike(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

export async function publicPostJson(
  pathSegments: readonly string[],
  body: Record<string, string>,
): Promise<{ status: number; body: unknown }> {
  const environment = getServerEnvironment();
  const url = buildUrl(environment.ecommerceApiBaseUrl, pathSegments);
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      credentials: "omit",
      redirect: "manual",
      cache: "no-store",
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch {
    throw new PublicApiError("unavailable");
  }
  if (!response.ok) throw new PublicApiError("upstream-failure", response.status);
  try {
    return { status: response.status, body: await response.json() };
  } catch {
    throw new PublicApiError("invalid-response", response.status);
  }
}

export async function publicGet(
  pathSegments: readonly string[],
  searchParams?: URLSearchParams,
): Promise<unknown> {
  const environment = getServerEnvironment();
  const url = buildUrl(environment.ecommerceApiBaseUrl, pathSegments, searchParams);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "omit",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch (error) {
    if (isAbortLike(error) || error instanceof TypeError) {
      throw new PublicApiError("unavailable");
    }
    throw new PublicApiError("unavailable");
  }

  if (response.status === 404) {
    throw new PublicApiError("not-found", response.status);
  }

  if (response.status >= 300 && response.status < 400) {
    throw new PublicApiError("upstream-failure", response.status);
  }

  if (!response.ok) {
    throw new PublicApiError("upstream-failure", response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new PublicApiError("invalid-response", response.status);
  }
}
