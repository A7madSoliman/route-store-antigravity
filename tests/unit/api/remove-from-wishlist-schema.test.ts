// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { RemoveFromWishlistResponseSchema } from "@/lib/api/schemas/remove-from-wishlist-response.schema.server";

describe("RemoveFromWishlistResponseSchema", () => {
  it("parses valid remove-from-wishlist response", () => {
    const raw = {
      status: "success",
      message: "Product removed successfully to your wishlist",
      data: ["prod-2"],
    };

    const parsed = RemoveFromWishlistResponseSchema.parse(raw);
    expect(parsed).toEqual(raw);
    expect(parsed.data).toEqual(["prod-2"]);
  });

  it("parses empty data array when last item is removed", () => {
    const raw = {
      status: "success",
      message: "Product removed successfully to your wishlist",
      data: [],
    };

    const parsed = RemoveFromWishlistResponseSchema.parse(raw);
    expect(parsed.data).toEqual([]);
  });

  it("rejects non-success or malformed responses", () => {
    expect(() =>
      RemoveFromWishlistResponseSchema.parse({
        status: "fail",
        message: "Failed",
        data: [],
      }),
    ).toThrow();

    expect(() =>
      RemoveFromWishlistResponseSchema.parse({
        status: "success",
        message: "Missing data",
      }),
    ).toThrow();
  });
});
