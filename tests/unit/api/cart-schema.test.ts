// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { GetCartResponseSchema } from "@/lib/api/schemas/get-cart-response.schema.server";

describe("GetCartResponseSchema", () => {
  it("parses valid populated cart response", () => {
    const raw = {
      status: "success",
      numOfCartItems: 2,
      cartId: "cart-123",
      data: {
        _id: "cart-123",
        cartOwner: "user-456",
        products: [
          {
            _id: "line-1",
            count: 2,
            price: 150,
            product: {
              _id: "prod-1",
              title: "Product 1",
              price: 150,
              imageCover: "https://ecommerce.routemisr.com/prod1.jpg",
              category: { _id: "cat-1", name: "Cat 1" },
              brand: { _id: "brand-1", name: "Brand 1" },
              quantity: 10,
              ratingsAverage: 4.5,
            },
          },
        ],
        totalCartPrice: 300,
      },
    };

    const parsed = GetCartResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.numOfCartItems).toBe(2);
    expect(parsed.data?.products).toHaveLength(1);
    expect(parsed.data?.totalCartPrice).toBe(300);
  });

  it("parses valid empty cart response", () => {
    const raw = {
      status: "success",
      numOfCartItems: 0,
      data: {
        _id: "cart-empty",
        cartOwner: "user-456",
        products: [],
        totalCartPrice: 0,
      },
    };

    const parsed = GetCartResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.numOfCartItems).toBe(0);
    expect(parsed.data?.products).toHaveLength(0);
    expect(parsed.data?.totalCartPrice).toBe(0);
  });

  it("allows null data when cart is empty/cleared", () => {
    const raw = {
      status: "success",
      numOfCartItems: 0,
      data: null,
    };

    const parsed = GetCartResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.numOfCartItems).toBe(0);
    expect(parsed.data).toBeNull();
  });

  it("rejects invalid numOfCartItems", () => {
    expect(() =>
      GetCartResponseSchema.parse({
        status: "success",
        numOfCartItems: "two",
        data: {},
      }),
    ).toThrow();
  });
});
