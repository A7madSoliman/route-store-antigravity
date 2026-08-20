// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session.server", () => ({ getSession: vi.fn() }));

import { requireSession, SessionRequiredError } from "@/lib/auth/require-session.server";
import { getSession } from "@/lib/auth/session.server";

const getSessionMock = vi.mocked(getSession);

describe("requireSession", () => {
  it("returns only the token-free summary", async () => {
    getSessionMock.mockResolvedValue({
      expiresAt: new Date(1_700_000_000_000),
      user: { name: "User", email: "user@example.com" },
    });
    await expect(requireSession()).resolves.toEqual({
      expiresAt: new Date(1_700_000_000_000),
      user: { name: "User", email: "user@example.com" },
    });
  });

  it("throws a fixed safe error without redirecting", async () => {
    getSessionMock.mockResolvedValue(null);
    await expect(requireSession()).rejects.toBeInstanceOf(SessionRequiredError);
    await expect(requireSession()).rejects.toMatchObject({
      message: "An authenticated session is required.",
    });
  });
});
