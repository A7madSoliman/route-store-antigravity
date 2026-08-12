import "server-only";

import { redirect } from "next/navigation";

import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";
import { normalizeReturnTo } from "@/lib/auth/return-to.server";
import type { SessionState } from "@/lib/auth/session.server";

export function buildProtectedSignInPath(candidate: unknown): string {
  const destination = normalizeReturnTo(candidate);
  return `/sign-in?${new URLSearchParams({ returnTo: destination }).toString()}`;
}

export async function requireProtectedRoute(candidate: unknown): Promise<SessionState> {
  try {
    return await requireSession();
  } catch (error) {
    if (!(error instanceof SessionRequiredError)) throw error;
  }

  redirect(buildProtectedSignInPath(candidate));
}
