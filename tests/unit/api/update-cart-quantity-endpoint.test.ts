// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedPutJsonMock } = vi.hoisted(() => ({
  protectedPutJsonMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPutJson: protectedPutJsonMock,
}));

import { updateCartQuantity } from "@/lib/api/endpoints/protected/update-cart-quantity.server";

import updateCartQuantityFixture from "../../fixtures/api/update-cart-quantity.success.json";

beforeEach(() => {
  protectedPutJsonMock.mockReset();
});

describe("updateCartQuantity endpoint adapter", () => {
  it("serializes productId in path and count in body using fixture", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 200,
      body: updateCartQuantityFixture,
    });

    const result = await updateCartQuantity({ productId: "prod-1", count: 2 });
    expect(protectedPutJsonMock).toHaveBeenCalledWith(["cart", "prod-1"], { count: 2 });
    expect(result.id).toBe(updateCartQuantityFixture.cartId);
    expect(result.totalCartPrice).toBe(updateCartQuantityFixture.data.totalCartPrice);
    expect(result.items[0].count).toBe(2);
  });

  it("rejects invalid input (empty productId or count < 1)", async () => {
    await expect(updateCartQuantity({ productId: "", count: 2 })).rejects.toMatchObject({
      code: "rejected",
    });
    await expect(updateCartQuantity({ productId: "prod-1", count: 0 })).rejects.toMatchObject({
      code: "rejected",
    });
    await expect(updateCartQuantity({ productId: "prod-1", count: 1.5 })).rejects.toMatchObject({
      code: "rejected",
    });
    expect(protectedPutJsonMock).not.toHaveBeenCalled();
  });

  it("maps 401 unauthorized status", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(updateCartQuantity({ productId: "prod-1", count: 2 })).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps 404 not found status", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 404,
      body: { statusMsg: "fail", message: "Product not found" },
    });

    await expect(updateCartQuantity({ productId: "prod-1", count: 2 })).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it("maps 400 rejected status", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 400,
      body: { statusMsg: "fail", message: "Invalid count" },
    });

    await expect(updateCartQuantity({ productId: "prod-1", count: 2 })).rejects.toMatchObject({
      code: "rejected",
    });
  });

  it("maps 500 status to upstream-failure", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 500,
      body: { message: "Internal server error" },
    });

    await expect(updateCartQuantity({ productId: "prod-1", count: 2 })).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });
});
