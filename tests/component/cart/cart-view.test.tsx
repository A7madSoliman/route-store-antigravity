import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CartView } from "@/features/cart/components/cart-view";
import type { Cart } from "@/types/cart";

afterEach(() => cleanup());

describe("CartView Component", () => {
  it("renders empty state when cart has no items", () => {
    const emptyCart: Cart = {
      id: "cart-0",
      cartOwner: "user-0",
      totalCartPrice: 0,
      numOfCartItems: 0,
      items: [],
    };

    render(<CartView cart={emptyCart} />);
    expect(screen.getByRole("heading", { name: "Your cart is empty" })).not.toBeNull();
    expect(screen.queryByRole("list", { name: "Shopping cart items" })).toBeNull();
  });

  it("renders cart heading, items list, and summary when populated", () => {
    const populatedCart: Cart = {
      id: "cart-1",
      cartOwner: "user-1",
      totalCartPrice: 850,
      numOfCartItems: 2,
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          count: 1,
          price: 850,
          product: {
            id: "prod-1",
            title: "Smart Fitness Watch",
            slug: "smart-fitness-watch",
            price: 850,
            imageUrl: null,
            category: { id: "cat-1", name: "Gadgets", slug: "gadgets" },
            brand: { id: "brand-1", name: "FitTech", slug: "fittech" },
            quantity: 20,
            ratingsAverage: 4.7,
          },
        },
      ],
    };

    render(<CartView cart={populatedCart} />);
    expect(screen.getByRole("heading", { name: "Shopping Cart" })).not.toBeNull();
    expect(screen.getByRole("list", { name: "Shopping cart items" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Smart Fitness Watch" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Order Summary" })).not.toBeNull();
  });
});
