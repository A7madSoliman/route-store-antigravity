// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedGetMock } = vi.hoisted(() => ({
  protectedGetMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedGet: protectedGetMock,
}));

import { getCart } from "@/lib/api/endpoints/protected/cart.server";
import { ProtectedApiError } from "@/lib/api/errors.server";

import getCartFixture from "../../fixtures/api/get-cart.success.json";

beforeEach(() => {
  protectedGetMock.mockReset();
});

describe("getCart endpoint adapter", () => {
  it("fetches and adapts populated cart data using fixture", async () => {
    protectedGetMock.mockResolvedValueOnce(getCartFixture);

    const result = await getCart();
    expect(protectedGetMock).toHaveBeenCalledWith(["cart"]);
    expect(result.id).toBe(getCartFixture.cartId);
    expect(result.totalCartPrice).toBe(getCartFixture.data.totalCartPrice);
    expect(result.items).toHaveLength(1);
  });

  it("handles 404 upstream status by returning a clean empty cart", async () => {
    protectedGetMock.mockRejectedValueOnce(new ProtectedApiError("upstream-failure", 404));

    const result = await getCart();
    expect(result.items).toHaveLength(0);
    expect(result.totalCartPrice).toBe(0);
    expect(result.numOfCartItems).toBe(0);
  });

  it("maps 401 unauthorized status to unauthorized error", async () => {
    protectedGetMock.mockRejectedValueOnce(new ProtectedApiError("upstream-failure", 401));

    await expect(getCart()).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps unavailable transport error to unavailable error", async () => {
    protectedGetMock.mockRejectedValueOnce(new ProtectedApiError("unavailable"));

    await expect(getCart()).rejects.toMatchObject({
      code: "unavailable",
    });
  });

  it("maps malformed payload to invalid-response error", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "fail",
      data: null,
    });

    await expect(getCart()).rejects.toMatchObject({
      code: "invalid-response",
    });
  });
});
