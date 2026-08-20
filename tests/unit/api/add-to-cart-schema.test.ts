// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { AddToCartResponseSchema } from "@/lib/api/schemas/add-to-cart-response.schema.server";

describe("AddToCartResponseSchema", () => {
  it("parses valid add-to-cart response", () => {
    const raw = {
      status: "success",
      message: "Product added successfully to your cart",
      numOfCartItems: 2,
      cartId: "cart-123",
      data: {
        _id: "cart-123",
        cartOwner: "user-456",
        products: [
          {
            _id: "line-1",
            count: 1,
            price: 299,
            product: {
              _id: "prod-1",
              title: "Product 1",
              price: 299,
            },
          },
        ],
        totalCartPrice: 299,
      },
    };

    const parsed = AddToCartResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.message).toBe("Product added successfully to your cart");
    expect(parsed.numOfCartItems).toBe(2);
    expect(parsed.data?.totalCartPrice).toBe(299);
  });

  it("parses responses with string product references in data", () => {
    const raw = {
      status: "success",
      message: "Product added successfully to your cart",
      numOfCartItems: 1,
      data: {
        _id: "cart-123",
        cartOwner: "user-456",
        products: [
          {
            _id: "line-1",
            count: 1,
            price: 160,
            product: "6428ebc6dc1175abc65ca0b9",
          },
        ],
        totalCartPrice: 160,
      },
    };

    const parsed = AddToCartResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.numOfCartItems).toBe(1);
    expect(parsed.data?.totalCartPrice).toBe(160);
  });
});
