// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedDeleteMock } = vi.hoisted(() => ({
  protectedDeleteMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedDelete: protectedDeleteMock,
}));

import { removeFromCart } from "@/lib/api/endpoints/protected/remove-from-cart.server";

beforeEach(() => {
  protectedDeleteMock.mockReset();
});

describe("removeFromCart endpoint adapter", () => {
  it("serializes productId in path and returns adapted cart", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 200,
      body: {
        status: "success",
        numOfCartItems: 0,
        cartId: "cart-1",
        data: {
          _id: "cart-1",
          cartOwner: "user-1",
          products: [],
          totalCartPrice: 0,
        },
      },
    });

    const result = await removeFromCart({ productId: "prod-1" });
    expect(protectedDeleteMock).toHaveBeenCalledWith(["cart", "prod-1"]);
    expect(result.id).toBe("cart-1");
    expect(result.numOfCartItems).toBe(0);
    expect(result.items).toHaveLength(0);
    expect(result.totalCartPrice).toBe(0);
  });

  it("rejects invalid or empty productId", async () => {
    await expect(removeFromCart({ productId: "" })).rejects.toMatchObject({
      code: "rejected",
    });
    expect(protectedDeleteMock).not.toHaveBeenCalled();
  });

  it("maps 401 unauthorized status", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(removeFromCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps 404 not found status", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 404,
      body: { statusMsg: "fail", message: "Product not found" },
    });

    await expect(removeFromCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it("maps 400 rejected status", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 400,
      body: { statusMsg: "fail", message: "Invalid product id" },
    });

    await expect(removeFromCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "rejected",
    });
  });

  it("maps 500 status to upstream-failure", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 500,
      body: { message: "Internal server error" },
    });

    await expect(removeFromCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });
});
