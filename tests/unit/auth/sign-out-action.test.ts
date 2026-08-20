// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { clearSessionMock, redirectMock } = vi.hoisted(() => ({
  clearSessionMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("@/lib/auth/session.server", () => ({
  clearSession: clearSessionMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import { signOutAction } from "@/features/auth/actions/sign-out.action";

beforeEach(() => {
  clearSessionMock.mockReset();
  redirectMock.mockReset();
});

describe("signOutAction Server Action", () => {
  it("clears the session and redirects to /sign-in", async () => {
    await signOutAction();

    expect(clearSessionMock).toHaveBeenCalledOnce();
    expect(redirectMock).toHaveBeenCalledWith("/sign-in");
  });
});
