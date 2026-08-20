// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedPostJsonMock } = vi.hoisted(() => ({
  protectedPostJsonMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPostJson: protectedPostJsonMock,
}));

import { addToCart } from "@/lib/api/endpoints/protected/add-to-cart.server";

beforeEach(() => {
  protectedPostJsonMock.mockReset();
});

describe("addToCart endpoint adapter", () => {
  it("serializes productId and returns cart summary", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 200,
      body: {
        status: "success",
        message: "Product added successfully to your cart",
        numOfCartItems: 1,
        cartId: "cart-1",
        data: {
          _id: "cart-1",
          cartOwner: "user-1",
          products: [],
          totalCartPrice: 199,
        },
      },
    });

    const result = await addToCart({ productId: "prod-101" });
    expect(protectedPostJsonMock).toHaveBeenCalledWith(["cart"], { productId: "prod-101" });
    expect(result).toEqual({
      message: "Product added successfully to your cart",
      numOfCartItems: 1,
      totalCartPrice: 199,
    });
  });

  it("rejects empty or invalid productId input", async () => {
    await expect(addToCart({ productId: "" })).rejects.toMatchObject({
      code: "rejected",
    });
    expect(protectedPostJsonMock).not.toHaveBeenCalled();
  });

  it("maps 401 unauthorized status", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(addToCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps 404 not found status", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 404,
      body: { statusMsg: "fail", message: "Product not found" },
    });

    await expect(addToCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it("maps 400 rejected status (e.g. stock conflict)", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 400,
      body: { statusMsg: "fail", message: "Out of stock" },
    });

    await expect(addToCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "rejected",
    });
  });

  it("maps non-200 non-40x status to upstream-failure", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 500,
      body: { message: "Internal server error" },
    });

    await expect(addToCart({ productId: "prod-1" })).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });
});
