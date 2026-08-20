// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { adaptCartResponse, createEmptyCart } from "@/lib/api/adapters/cart.adapter.server";
import type { GetCartResponse } from "@/lib/api/schemas/get-cart-response.schema.server";

describe("Cart Domain Adapter", () => {
  it("adapts populated cart response into domain Cart model", () => {
    const raw: GetCartResponse = {
      status: "success",
      numOfCartItems: 3,
      cartId: "cart-999",
      data: {
        _id: "cart-999",
        cartOwner: "user-888",
        products: [
          {
            _id: "line-item-1",
            count: 3,
            price: 250,
            product: {
              _id: "prod-101",
              title: "Test Running Shoes",
              slug: "test-running-shoes",
              price: 250,
              imageCover: "shoes.jpg",
              category: { _id: "cat-1", name: "Footwear", slug: "footwear" },
              brand: { _id: "brand-1", name: "Nike", slug: "nike" },
              quantity: 15,
              ratingsAverage: 4.8,
            },
          },
        ],
        totalCartPrice: 750,
      },
    };

    const domain = adaptCartResponse(raw);

    expect(domain.id).toBe("cart-999");
    expect(domain.cartOwner).toBe("user-888");
    expect(domain.totalCartPrice).toBe(750);
    expect(domain.numOfCartItems).toBe(3);
    expect(domain.items).toHaveLength(1);

    const item = domain.items[0];
    expect(item.id).toBe("line-item-1");
    expect(item.productId).toBe("prod-101");
    expect(item.count).toBe(3);
    expect(item.price).toBe(250);
    expect(item.product.title).toBe("Test Running Shoes");
    expect(item.product.category.name).toBe("Footwear");
    expect(item.product.brand.name).toBe("Nike");
  });

  it("createEmptyCart returns an empty cart model", () => {
    const empty = createEmptyCart();
    expect(empty.id).toBe("");
    expect(empty.cartOwner).toBe("");
    expect(empty.totalCartPrice).toBe(0);
    expect(empty.numOfCartItems).toBe(0);
    expect(empty.items).toEqual([]);
  });
});
