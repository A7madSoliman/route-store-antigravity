// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedDeleteMock } = vi.hoisted(() => ({
  protectedDeleteMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedDelete: protectedDeleteMock,
}));

import { clearCart } from "@/lib/api/endpoints/protected/clear-cart.server";

import clearCartFixture from "../../fixtures/api/clear-cart.success.json";

beforeEach(() => {
  protectedDeleteMock.mockReset();
});

describe("clearCart endpoint adapter", () => {
  it("issues DELETE /cart and returns response message using fixture", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 200,
      body: clearCartFixture,
    });

    const result = await clearCart();
    expect(protectedDeleteMock).toHaveBeenCalledWith(["cart"]);
    expect(result).toEqual({ message: clearCartFixture.message });
  });

  it("maps 401 unauthorized status", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(clearCart()).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps 404 not found status", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 404,
      body: { statusMsg: "fail", message: "Cart not found" },
    });

    await expect(clearCart()).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it("maps non-200 non-40x status to upstream-failure", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 500,
      body: { message: "Internal server error" },
    });

    await expect(clearCart()).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });
});
