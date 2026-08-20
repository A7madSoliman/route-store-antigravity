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

import SignUpPage from "@/app/(auth)/sign-up/page";

beforeEach(() => {
  normalize.mockClear();
  getSessionMock.mockReset();
  redirectMock.mockReset();
  getSessionMock.mockResolvedValue(null);
});

describe("signup page", () => {
  it("is an async server page", () => {
    expect(SignUpPage.constructor.name).toBe("AsyncFunction");
  });

  it("only forwards a scalar returnTo candidate", async () => {
    await SignUpPage({ searchParams: Promise.resolve({ returnTo: ["/products", "/brands"] }) });
    expect(normalize).toHaveBeenCalledWith(undefined);
    await SignUpPage({ searchParams: Promise.resolve({ returnTo: "/products" }) });
    expect(normalize).toHaveBeenLastCalledWith("/products");
  });

  it("redirects authenticated users to returnTo destination or /account/profile", async () => {
    getSessionMock.mockResolvedValueOnce({
      expiresAt: new Date(),
      user: { name: "User", email: "user@example.com" },
    });

    await SignUpPage({ searchParams: Promise.resolve({ returnTo: "/account/profile" }) });
    expect(redirectMock).toHaveBeenCalledWith("/account/profile");
  });
});
