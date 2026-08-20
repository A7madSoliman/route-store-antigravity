import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/cart/actions/remove-from-cart.action", () => ({
  removeFromCartAction: vi.fn(),
}));

import { RemoveFromCartButton } from "@/features/cart/components/remove-from-cart-button";

afterEach(() => cleanup());

describe("RemoveFromCartButton Component", () => {
  it("renders button with accessible label and hidden productId input", () => {
    render(<RemoveFromCartButton productId="prod-123" title="Noise Cancelling Headphones" />);

    const button = screen.getByRole("button", {
      name: "Remove Noise Cancelling Headphones from cart",
    });
    expect(button).not.toBeNull();
    expect(button.getAttribute("type")).toBe("submit");

    const input = document.querySelector("input[name='productId']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("prod-123");
  });

  it("renders generic label when title is omitted", () => {
    render(<RemoveFromCartButton productId="prod-456" />);

    const button = screen.getByRole("button", { name: "Remove item from cart" });
    expect(button).not.toBeNull();
  });
});
