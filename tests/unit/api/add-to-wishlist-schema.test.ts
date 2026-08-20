// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { AddToWishlistResponseSchema } from "@/lib/api/schemas/add-to-wishlist-response.schema.server";

describe("AddToWishlistResponseSchema", () => {
  it("parses valid add-to-wishlist response", () => {
    const raw = {
      status: "success",
      message: "Product added successfully to your wishlist",
      data: ["prod-1", "prod-2"],
    };

    const parsed = AddToWishlistResponseSchema.parse(raw);
    expect(parsed).toEqual(raw);
    expect(parsed.data).toEqual(["prod-1", "prod-2"]);
  });

  it("rejects non-success or malformed responses", () => {
    expect(() =>
      AddToWishlistResponseSchema.parse({
        status: "error",
        message: "Failed",
        data: [],
      })
    ).toThrow();

    expect(() =>
      AddToWishlistResponseSchema.parse({
        status: "success",
        message: "Missing data",
      })
    ).toThrow();
  });
});