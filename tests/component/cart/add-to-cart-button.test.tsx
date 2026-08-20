import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/cart/actions/add-to-cart.action", () => ({
  addToCartAction: vi.fn(),
}));

import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";

afterEach(() => cleanup());

describe("AddToCartButton Component", () => {
  it("renders primary variant with label and hidden productId input", () => {
    render(<AddToCartButton productId="prod-123" variant="primary" />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).not.toBeNull();
    expect(button.getAttribute("type")).toBe("submit");

    const input = document.querySelector("input[name='productId']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("prod-123");
  });

  it("renders compact variant with custom label", () => {
    render(<AddToCartButton productId="prod-456" variant="compact" label="Add to Bag" />);

    const button = screen.getByRole("button", { name: "Add to Bag" });
    expect(button).not.toBeNull();

    const input = document.querySelector("input[name='productId']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("prod-456");
  });
});
