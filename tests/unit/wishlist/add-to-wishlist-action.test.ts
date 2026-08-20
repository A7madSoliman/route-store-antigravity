// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { addToWishlistMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  addToWishlistMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/add-to-wishlist.server", () => ({
  addToWishlist: addToWishlistMock,
  AddToWishlistApiError: class AddToWishlistApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "AddToWishlistApiError";
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

import { addToWishlistAction } from "@/features/wishlist/actions/add-to-wishlist.action";
import { AddToWishlistApiError } from "@/lib/api/endpoints/protected/add-to-wishlist.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  addToWishlistMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("addToWishlistAction", () => {
  it("successfully adds product to wishlist and revalidates /wishlist", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    addToWishlistMock.mockResolvedValueOnce({
      wishlistProductIds: ["prod-1", "prod-2"],
    });

    const formData = new FormData();
    formData.set("productId", "prod-2");

    const result = await addToWishlistAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(addToWishlistMock).toHaveBeenCalledWith({ productId: "prod-2" });
    expect(revalidatePathMock).toHaveBeenCalledWith("/wishlist");
    expect(result).toEqual({
      status: "success",
      message: "Product added successfully to your wishlist.",
      wishlistProductIds: ["prod-1", "prod-2"],
    });
  });

  it("returns unauthorized status when session is required", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.set("productId", "prod-1");

    const result = await addToWishlistAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to add items to your wishlist.",
    });
    expect(addToWishlistMock).not.toHaveBeenCalled();
  });

  it("returns error status on missing or empty productId", async () => {
    const formData = new FormData();
    formData.set("productId", "");

    const result = await addToWishlistAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "A valid product ID is required.",
    });
    expect(addToWishlistMock).not.toHaveBeenCalled();
  });

  it("maps not-found error from adapter safely", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    addToWishlistMock.mockRejectedValueOnce(new AddToWishlistApiError("not-found"));

    const formData = new FormData();
    formData.set("productId", "prod-999");

    const result = await addToWishlistAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Product not found.",
    });
  });
});