// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { removeFromCartMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  removeFromCartMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/remove-from-cart.server", () => ({
  removeFromCart: removeFromCartMock,
  RemoveFromCartApiError: class RemoveFromCartApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "RemoveFromCartApiError";
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

import { removeFromCartAction } from "@/features/cart/actions/remove-from-cart.action";
import { RemoveFromCartApiError } from "@/lib/api/endpoints/protected/remove-from-cart.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  removeFromCartMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("removeFromCartAction", () => {
  it("successfully removes product from cart and revalidates /cart", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    removeFromCartMock.mockResolvedValueOnce({
      id: "cart-1",
      totalCartPrice: 0,
      numOfCartItems: 0,
      items: [],
    });

    const formData = new FormData();
    formData.set("productId", "prod-101");

    const result = await removeFromCartAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(removeFromCartMock).toHaveBeenCalledWith({ productId: "prod-101" });
    expect(revalidatePathMock).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({
      status: "success",
      message: "Item removed from cart.",
      productId: "prod-101",
    });
  });

  it("returns unauthorized status when session is required", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.set("productId", "prod-101");

    const result = await removeFromCartAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to manage your cart.",
    });
    expect(removeFromCartMock).not.toHaveBeenCalled();
  });

  it("returns error status on missing productId", async () => {
    const formData = new FormData();
    formData.set("productId", "");

    const result = await removeFromCartAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "A valid product ID is required.",
    });
    expect(removeFromCartMock).not.toHaveBeenCalled();
  });

  it("maps not-found error from adapter safely", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    removeFromCartMock.mockRejectedValueOnce(new RemoveFromCartApiError("not-found"));

    const formData = new FormData();
    formData.set("productId", "prod-999");

    const result = await removeFromCartAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Product not found in cart.",
    });
  });
});
