import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/wishlist/actions/remove-from-wishlist.action", () => ({
  removeFromWishlistAction: vi.fn(),
}));
vi.mock("@/features/wishlist/actions/move-to-bag.action", () => ({
  moveToBagAction: vi.fn(),
}));
vi.mock("@/features/cart/actions/add-to-cart.action", () => ({
  addToCartAction: vi.fn(),
}));

import { WishlistCard } from "@/features/wishlist/components/wishlist-card";
import type { WishlistItem } from "@/types/wishlist";

afterEach(() => cleanup());

describe("WishlistCard Component", () => {
  const mockItem: WishlistItem = {
    id: "prod-123",
    title: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "High quality noise-cancelling wireless over-ear headphones with superior audio clarity.",
    price: 3499,
    imageUrl: "https://ecommerce.routemisr.com/products/headphones.jpg",
    category: {
      id: "cat-1",
      name: "Electronics",
      slug: "electronics",
      imageUrl: null,
    },
    brand: {
      id: "brand-1",
      name: "AudioBrand",
      slug: "audiobrand",
      imageUrl: null,
    },
  };

  it("renders product title, formatted price, image, and remove button", () => {
    render(<WishlistCard item={mockItem} />);

    expect(screen.getByRole("heading", { name: "Premium Wireless Headphones" })).not.toBeNull();
    expect(screen.getByText("EGP 3,499")).not.toBeNull();

    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/products/prod-123")).toBe(true);

    const img = screen.getByRole("img", { name: "Premium Wireless Headphones" });
    expect(img).not.toBeNull();

    const removeButton = screen.getByRole("button", { name: "Remove from wishlist" });
    expect(removeButton).not.toBeNull();
  });

  it("truncates description over 50 chars with ellipsis", () => {
    render(<WishlistCard item={mockItem} />);

    expect(
      screen.getByText("High quality noise-cancelling wireless over-ear he..."),
    ).not.toBeNull();
  });

  it("renders active Add to Bag button", () => {
    render(<WishlistCard item={mockItem} />);

    const button = screen.getByRole("button", { name: "Add to Bag" });
    expect(button).not.toBeNull();
    expect(button.getAttribute("type")).toBe("submit");
  });
});