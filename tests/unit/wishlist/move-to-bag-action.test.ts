// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { addToCartMock, removeFromWishlistMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  addToCartMock: vi.fn(),
  removeFromWishlistMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/add-to-cart.server", () => ({
  addToCart: addToCartMock,
  AddToCartApiError: class AddToCartApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "AddToCartApiError";
    }
  },
}));

vi.mock("@/lib/api/endpoints/protected/remove-from-wishlist.server", () => ({
  removeFromWishlist: removeFromWishlistMock,
  RemoveFromWishlistApiError: class RemoveFromWishlistApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "RemoveFromWishlistApiError";
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

import { moveToBagAction } from "@/features/wishlist/actions/move-to-bag.action";
import { AddToCartApiError } from "@/lib/api/endpoints/protected/add-to-cart.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  addToCartMock.mockReset();
  removeFromWishlistMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("moveToBagAction", () => {
  it("successfully adds to cart, removes from wishlist, and revalidates paths", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    addToCartMock.mockResolvedValueOnce({
      message: "Success",
      numOfCartItems: 3,
    });
    removeFromWishlistMock.mockResolvedValueOnce({
      remainingProductIds: [],
    });

    const formData = new FormData();
    formData.set("productId", "prod-123");

    const result = await moveToBagAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(addToCartMock).toHaveBeenCalledWith({ productId: "prod-123" });
    expect(removeFromWishlistMock).toHaveBeenCalledWith({ productId: "prod-123" });
    expect(revalidatePathMock).toHaveBeenCalledWith("/wishlist");
    expect(revalidatePathMock).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({
      status: "success",
      message: "Item moved to your bag.",
    });
  });

  it("returns unauthorized status when session is missing", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.set("productId", "prod-123");

    const result = await moveToBagAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to manage your bag and wishlist.",
    });
    expect(addToCartMock).not.toHaveBeenCalled();
  });

  it("returns error status on missing or invalid productId", async () => {
    const formData = new FormData();
    formData.set("productId", "");

    const result = await moveToBagAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "A valid product ID is required.",
    });
  });

  it("handles AddToCartApiError gracefully", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    addToCartMock.mockRejectedValueOnce(new AddToCartApiError("unavailable"));

    const formData = new FormData();
    formData.set("productId", "prod-123");

    const result = await moveToBagAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Could not add product to bag. Please try again.",
    });
    expect(removeFromWishlistMock).not.toHaveBeenCalled();
  });
});
