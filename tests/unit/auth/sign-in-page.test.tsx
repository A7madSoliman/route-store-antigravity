import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { normalize, getSessionMock, redirectMock } = vi.hoisted(() => ({
  normalize: vi.fn((value: unknown) => (typeof value === "string" ? value : "/")),
  getSessionMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("@/lib/auth/return-to.server", () => ({ normalizeReturnTo: normalize }));
vi.mock("@/lib/auth/session.server", () => ({ getSession: getSessionMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import SignInPage from "@/app/(auth)/sign-in/page";

beforeEach(() => {
  normalize.mockClear();
  getSessionMock.mockReset();
  redirectMock.mockReset();
  getSessionMock.mockResolvedValue(null);
});

describe("signin page", () => {
  it("is async and treats arrays as absent", async () => {
    expect(SignInPage.constructor.name).toBe("AsyncFunction");
    await SignInPage({ searchParams: Promise.resolve({ returnTo: ["/products", "/brands"] }) });
    expect(normalize).toHaveBeenCalledWith(undefined);
  });

  it("redirects authenticated users to returnTo destination or /account/profile", async () => {
    getSessionMock.mockResolvedValueOnce({
      expiresAt: new Date(),
      user: { name: "User", email: "user@example.com" },
    });

    await SignInPage({ searchParams: Promise.resolve({ returnTo: "/wishlist" }) });
    expect(redirectMock).toHaveBeenCalledWith("/wishlist");
  });
});
