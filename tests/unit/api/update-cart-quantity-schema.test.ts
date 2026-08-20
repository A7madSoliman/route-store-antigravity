// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { UpdateCartQuantityResponseSchema } from "@/lib/api/schemas/update-cart-quantity-response.schema.server";

describe("UpdateCartQuantityResponseSchema", () => {
  it("parses valid quantity update response", () => {
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
            count: 3,
            price: 150,
            product: {
              _id: "prod-1",
              title: "Product 1",
              price: 150,
            },
          },
        ],
        totalCartPrice: 450,
      },
    };

    const parsed = UpdateCartQuantityResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.numOfCartItems).toBe(1);
    expect(parsed.data.products[0].count).toBe(3);
    expect(parsed.data.totalCartPrice).toBe(450);
  });

  it("rejects non-success responses", () => {
    expect(() =>
      UpdateCartQuantityResponseSchema.parse({
        status: "fail",
        numOfCartItems: 0,
      }),
    ).toThrow();
  });
});
