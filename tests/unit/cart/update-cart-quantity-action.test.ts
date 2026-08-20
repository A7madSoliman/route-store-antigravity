// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { updateCartQuantityMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  updateCartQuantityMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/update-cart-quantity.server", () => ({
  updateCartQuantity: updateCartQuantityMock,
  UpdateCartQuantityApiError: class UpdateCartQuantityApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "UpdateCartQuantityApiError";
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

import { updateCartQuantityAction } from "@/features/cart/actions/update-cart-quantity.action";
import { UpdateCartQuantityApiError } from "@/lib/api/endpoints/protected/update-cart-quantity.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  updateCartQuantityMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("updateCartQuantityAction", () => {
  it("successfully updates quantity and revalidates /cart", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    updateCartQuantityMock.mockResolvedValueOnce({
      id: "cart-1",
      totalCartPrice: 600,
      numOfCartItems: 1,
      items: [{ id: "line-1", productId: "prod-1", count: 3, price: 200 }],
    });

    const formData = new FormData();
    formData.set("productId", "prod-1");
    formData.set("count", "3");

    const result = await updateCartQuantityAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(updateCartQuantityMock).toHaveBeenCalledWith({ productId: "prod-1", count: 3 });
    expect(revalidatePathMock).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({
      status: "success",
      message: "Cart quantity updated successfully.",
      count: 3,
    });
  });

  it("returns unauthorized status when session is required", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.set("productId", "prod-1");
    formData.set("count", "2");

    const result = await updateCartQuantityAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to manage your cart.",
    });
    expect(updateCartQuantityMock).not.toHaveBeenCalled();
  });

  it("returns error status on missing or invalid count", async () => {
    const formData = new FormData();
    formData.set("productId", "prod-1");
    formData.set("count", "0");

    const result = await updateCartQuantityAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "A valid product ID and positive count are required.",
    });
    expect(updateCartQuantityMock).not.toHaveBeenCalled();
  });

  it("maps rejected error (e.g. stock limit) safely", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    updateCartQuantityMock.mockRejectedValueOnce(new UpdateCartQuantityApiError("rejected"));

    const formData = new FormData();
    formData.set("productId", "prod-1");
    formData.set("count", "99");

    const result = await updateCartQuantityAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Could not update quantity (stock limit reached).",
    });
  });
});
