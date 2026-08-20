// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { removeFromWishlistMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  removeFromWishlistMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
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

import { removeFromWishlistAction } from "@/features/wishlist/actions/remove-from-wishlist.action";
import { RemoveFromWishlistApiError } from "@/lib/api/endpoints/protected/remove-from-wishlist.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  removeFromWishlistMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("removeFromWishlistAction", () => {
  it("successfully removes product from wishlist and revalidates /wishlist", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    removeFromWishlistMock.mockResolvedValueOnce({
      remainingProductIds: ["prod-1"],
    });

    const formData = new FormData();
    formData.set("productId", "prod-2");

    const result = await removeFromWishlistAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(removeFromWishlistMock).toHaveBeenCalledWith({ productId: "prod-2" });
    expect(revalidatePathMock).toHaveBeenCalledWith("/wishlist");
    expect(result).toEqual({
      status: "success",
      message: "Product removed successfully from your wishlist.",
      remainingProductIds: ["prod-1"],
    });
  });

  it("returns unauthorized status when session is required", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.set("productId", "prod-1");

    const result = await removeFromWishlistAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to manage your wishlist.",
    });
    expect(removeFromWishlistMock).not.toHaveBeenCalled();
  });

  it("returns error status on missing or empty productId", async () => {
    const formData = new FormData();
    formData.set("productId", "");

    const result = await removeFromWishlistAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "A valid product ID is required.",
    });
    expect(removeFromWishlistMock).not.toHaveBeenCalled();
  });

  it("maps not-found error from adapter safely", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    removeFromWishlistMock.mockRejectedValueOnce(new RemoveFromWishlistApiError("not-found"));

    const formData = new FormData();
    formData.set("productId", "prod-999");

    const result = await removeFromWishlistAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Product not found in wishlist.",
    });
  });
});
