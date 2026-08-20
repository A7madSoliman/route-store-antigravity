// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedDeleteMock } = vi.hoisted(() => ({
  protectedDeleteMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedDelete: protectedDeleteMock,
}));

import { removeFromWishlist } from "@/lib/api/endpoints/protected/remove-from-wishlist.server";

beforeEach(() => {
  protectedDeleteMock.mockReset();
});

describe("removeFromWishlist endpoint adapter", () => {
  it("serializes productId in path and returns remaining wishlist IDs", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 200,
      body: {
        status: "success",
        message: "Product removed successfully to your wishlist",
        data: ["prod-1"],
      },
    });

    const result = await removeFromWishlist({ productId: "prod-2" });
    expect(protectedDeleteMock).toHaveBeenCalledWith(["wishlist", "prod-2"]);
    expect(result).toEqual({
      remainingProductIds: ["prod-1"],
    });
  });

  it("rejects empty or invalid productId input", async () => {
    await expect(removeFromWishlist({ productId: "" })).rejects.toMatchObject({
      code: "rejected",
    });
    expect(protectedDeleteMock).not.toHaveBeenCalled();
  });

  it("maps 401 unauthorized status", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(removeFromWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps 404 not found status", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 404,
      body: { statusMsg: "fail", message: "this product not found" },
    });

    await expect(removeFromWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it("maps non-200 non-40x status to upstream-failure", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 500,
      body: { message: "Internal server error" },
    });

    await expect(removeFromWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });

  it("maps malformed 200 response to invalid-response", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 200,
      body: { status: "success", data: "not-an-array" },
    });

    await expect(removeFromWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "invalid-response",
    });
  });
});
