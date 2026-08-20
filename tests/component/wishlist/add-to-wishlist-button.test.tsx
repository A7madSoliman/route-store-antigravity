import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/wishlist/actions/add-to-wishlist.action", () => ({
  addToWishlistAction: vi.fn(),
}));

import { AddToWishlistButton } from "@/features/wishlist/components/add-to-wishlist-button";

afterEach(() => cleanup());

describe("AddToWishlistButton Component", () => {
  it("renders button variant with label and hidden productId input", () => {
    render(<AddToWishlistButton productId="prod-123" variant="button" />);

    const button = screen.getByRole("button", { name: /add to wishlist/i });
    expect(button).not.toBeNull();
    expect(button.getAttribute("type")).toBe("submit");

    const input = document.querySelector("input[name='productId']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("prod-123");
  });

  it("renders icon variant with aria-label", () => {
    render(<AddToWishlistButton productId="prod-456" variant="icon" />);

    const button = screen.getByRole("button", { name: "Add to wishlist" });
    expect(button).not.toBeNull();

    const input = document.querySelector("input[name='productId']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("prod-456");
  });
});