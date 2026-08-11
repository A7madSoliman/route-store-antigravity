import "server-only";

import { getSession, type SessionState } from "@/lib/auth/session.server";

export class SessionRequiredError extends Error {
  constructor() {
    super("An authenticated session is required.");
    this.name = "SessionRequiredError";
  }
}

export async function requireSession(): Promise<SessionState> {
  const session = await getSession();
  if (!session) throw new SessionRequiredError();
  return session;
}
