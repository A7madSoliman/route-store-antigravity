import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WishlistEmpty } from "@/features/wishlist/components/wishlist-empty";

afterEach(() => cleanup());

describe("WishlistEmpty Component", () => {
  it("renders empty state heading, copy, and link to explore products", () => {
    render(<WishlistEmpty />);

    expect(screen.getByRole("heading", { name: "Your wishlist is empty" })).not.toBeNull();
    expect(
      screen.getByText("Save items you love to review them later and keep track of your favorite products.")
    ).not.toBeNull();

    const link = screen.getByRole("link", { name: "Explore Products" });
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("/products");
  });
});