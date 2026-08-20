// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { RemoveFromCartResponseSchema } from "@/lib/api/schemas/remove-from-cart-response.schema.server";

describe("RemoveFromCartResponseSchema", () => {
  it("parses valid remove-from-cart response", () => {
    const raw = {
      status: "success",
      numOfCartItems: 1,
      cartId: "cart-123",
      data: {
        _id: "cart-123",
        cartOwner: "user-456",
        products: [
          {
            _id: "line-1",
            count: 1,
            price: 250,
            product: {
              _id: "prod-1",
              title: "Product 1",
              price: 250,
            },
          },
        ],
        totalCartPrice: 250,
      },
    };

    const parsed = RemoveFromCartResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.numOfCartItems).toBe(1);
    expect(parsed.data.products).toHaveLength(1);
    expect(parsed.data.totalCartPrice).toBe(250);
  });

  it("parses empty cart response when last item is removed", () => {
    const raw = {
      status: "success",
      numOfCartItems: 0,
      cartId: "cart-123",
      data: {
        _id: "cart-123",
        cartOwner: "user-456",
        products: [],
        totalCartPrice: 0,
      },
    };

    const parsed = RemoveFromCartResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.numOfCartItems).toBe(0);
    expect(parsed.data.products).toHaveLength(0);
    expect(parsed.data.totalCartPrice).toBe(0);
  });

  it("rejects non-success responses", () => {
    expect(() =>
      RemoveFromCartResponseSchema.parse({
        status: "fail",
        numOfCartItems: 0,
      }),
    ).toThrow();
  });
});
