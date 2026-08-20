import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CartLineItem } from "@/features/cart/components/cart-line-item";
import type { CartItem } from "@/types/cart";

afterEach(() => cleanup());

describe("CartLineItem Component", () => {
  const mockItem: CartItem = {
    id: "line-1",
    productId: "prod-1",
    count: 2,
    price: 350,
    product: {
      id: "prod-1",
      title: "Premium Wireless Earbuds",
      slug: "premium-wireless-earbuds",
      price: 350,
      imageUrl: "https://ecommerce.routemisr.com/earbuds.jpg",
      category: { id: "cat-1", name: "Electronics", slug: "electronics" },
      brand: { id: "brand-1", name: "AudioMax", slug: "audiomax" },
      quantity: 50,
      ratingsAverage: 4.6,
    },
  };

  it("renders product title, image, brand/category, unit price, quantity, and line total", () => {
    render(<CartLineItem item={mockItem} />);

    expect(screen.getByRole("heading", { name: "Premium Wireless Earbuds" })).not.toBeNull();
    expect(screen.getByText(/AudioMax • Electronics/)).not.toBeNull();
    expect(screen.getByText("EGP 350")).not.toBeNull();
    expect(screen.getByText("2")).not.toBeNull();
    expect(screen.getByText("EGP 700")).not.toBeNull();

    const img = screen.getByRole("img", { name: "Premium Wireless Earbuds" });
    expect(img).not.toBeNull();
  });
});
