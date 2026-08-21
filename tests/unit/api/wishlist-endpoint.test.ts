// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedGetMock } = vi.hoisted(() => ({
  protectedGetMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedGet: protectedGetMock,
}));

import { getWishlist } from "@/lib/api/endpoints/protected/wishlist.server";

import getWishlistFixture from "../../fixtures/api/get-wishlist.success.json";

beforeEach(() => {
  protectedGetMock.mockReset();
});

describe("getWishlist endpoint", () => {
  it("calls protectedGet with ['wishlist'] and returns adapted data using fixture", async () => {
    protectedGetMock.mockResolvedValueOnce(getWishlistFixture);

    const result = await getWishlist();
    expect(protectedGetMock).toHaveBeenCalledWith(["wishlist"]);
    expect(result.count).toBe(1);
    expect(result.items[0].id).toBe("64a1234567890");
  });

  it("handles empty wishlist", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "success",
      count: 0,
      data: [],
    });

    const result = await getWishlist();
    expect(protectedGetMock).toHaveBeenCalledWith(["wishlist"]);
    expect(result.count).toBe(0);
    expect(result.items).toEqual([]);
  });

  it("throws error when schema parsing fails", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "error",
      data: null,
    });

    await expect(getWishlist()).rejects.toThrow();
  });
});