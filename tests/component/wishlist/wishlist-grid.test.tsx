import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WishlistGrid, WishlistGridSkeleton } from "@/features/wishlist/components/wishlist-grid";
import type { WishlistItem } from "@/types/wishlist";

afterEach(() => cleanup());

describe("WishlistGrid Component", () => {
  const mockItems: WishlistItem[] = [
    {
      id: "prod-1",
      title: "Product 1",
      slug: "product-1",
      description: "Short desc",
      price: 150,
      imageUrl: null,
      category: { id: "cat-1", name: "Cat", slug: "cat", imageUrl: null },
      brand: { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null },
    },
    {
      id: "prod-2",
      title: "Product 2",
      slug: "product-2",
      description: "Another desc",
      price: 300,
      imageUrl: null,
      category: { id: "cat-1", name: "Cat", slug: "cat", imageUrl: null },
      brand: { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null },
    },
  ];

  it("renders list with aria-label and all wishlist cards", () => {
    render(<WishlistGrid items={mockItems} />);

    const list = screen.getByRole("list", { name: "Wishlist items" });
    expect(list).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Product 1" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Product 2" })).not.toBeNull();
  });

  it("renders WishlistGridSkeleton with 6 skeleton items and aria-hidden", () => {
    const { container } = render(<WishlistGridSkeleton />);

    const list = container.querySelector("ul[aria-hidden='true']");
    expect(list).not.toBeNull();
    const items = list?.querySelectorAll("li");
    expect(items?.length).toBe(6);
  });
});