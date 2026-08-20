import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/wishlist/actions/remove-from-wishlist.action", () => ({
  removeFromWishlistAction: vi.fn(),
}));

import { RemoveFromWishlistButton } from "@/features/wishlist/components/remove-from-wishlist-button";

afterEach(() => cleanup());

describe("RemoveFromWishlistButton Component", () => {
  it("renders icon variant with aria-label and hidden productId input", () => {
    render(<RemoveFromWishlistButton productId="prod-123" variant="icon" />);

    const button = screen.getByRole("button", { name: "Remove from wishlist" });
    expect(button).not.toBeNull();
    expect(button.getAttribute("type")).toBe("submit");

    const input = document.querySelector("input[name='productId']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("prod-123");
  });

  it("renders button variant with label", () => {
    render(<RemoveFromWishlistButton productId="prod-456" variant="button" />);

    const button = screen.getByRole("button", { name: /remove/i });
    expect(button).not.toBeNull();

    const input = document.querySelector("input[name='productId']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("prod-456");
  });
});
