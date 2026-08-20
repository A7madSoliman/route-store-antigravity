// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { clearCartMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  clearCartMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/clear-cart.server", () => ({
  clearCart: clearCartMock,
  ClearCartApiError: class ClearCartApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "ClearCartApiError";
    }
  },
}));

vi.mock("@/lib/auth/require-session.server", () => ({
  requireSession: requireSessionMock,
  SessionRequiredError: class SessionRequiredError extends Error {
    constructor() {
      super();
      this.name = "SessionRequiredError";
    }
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

import { clearCartAction } from "@/features/cart/actions/clear-cart.action";
import { ClearCartApiError } from "@/lib/api/endpoints/protected/clear-cart.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  clearCartMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("clearCartAction", () => {
  it("successfully clears cart and revalidates /cart", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    clearCartMock.mockResolvedValueOnce({
      message: "success",
    });

    const result = await clearCartAction({ status: "idle" }, new FormData());

    expect(requireSessionMock).toHaveBeenCalled();
    expect(clearCartMock).toHaveBeenCalled();
    expect(revalidatePathMock).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({
      status: "success",
      message: "success",
    });
  });

  it("returns unauthorized status when session is required", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const result = await clearCartAction({ status: "idle" }, new FormData());

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to manage your cart.",
    });
    expect(clearCartMock).not.toHaveBeenCalled();
  });

  it("maps unavailable error safely", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    clearCartMock.mockRejectedValueOnce(new ClearCartApiError("unavailable"));

    const result = await clearCartAction({ status: "idle" }, new FormData());

    expect(result).toEqual({
      status: "error",
      message: "Cart service is temporarily unavailable. Please try again.",
    });
  });
});
