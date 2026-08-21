// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedPostJsonMock } = vi.hoisted(() => ({
  protectedPostJsonMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPostJson: protectedPostJsonMock,
}));

import { addToWishlist } from "@/lib/api/endpoints/protected/add-to-wishlist.server";

import addToWishlistFixture from "../../fixtures/api/add-to-wishlist.success.json";

beforeEach(() => {
  protectedPostJsonMock.mockReset();
});

describe("addToWishlist endpoint adapter", () => {
  it("serializes productId and returns updated wishlist IDs using fixture", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 200,
      body: addToWishlistFixture,
    });

    const result = await addToWishlist({ productId: "prod-2" });
    expect(protectedPostJsonMock).toHaveBeenCalledWith(["wishlist"], { productId: "prod-2" });
    expect(result).toEqual({
      wishlistProductIds: addToWishlistFixture.data,
    });
  });

  it("rejects empty or invalid productId input", async () => {
    await expect(addToWishlist({ productId: "" })).rejects.toMatchObject({
      code: "rejected",
    });
    expect(protectedPostJsonMock).not.toHaveBeenCalled();
  });

  it("maps 401 unauthorized status", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(addToWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps 404 not found status", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 404,
      body: { statusMsg: "fail", message: "this product not found" },
    });

    await expect(addToWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it("maps non-200 non-40x status to upstream-failure", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 500,
      body: { message: "Internal server error" },
    });

    await expect(addToWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });

  it("maps malformed 200 response to invalid-response", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 200,
      body: { status: "success", data: "not-an-array" },
    });

    await expect(addToWishlist({ productId: "prod-1" })).rejects.toMatchObject({
      code: "invalid-response",
    });
  });
});