import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/cart/actions/clear-cart.action", () => ({
  clearCartAction: vi.fn(),
}));

import { ClearCartButton } from "@/features/cart/components/clear-cart-button";

afterEach(() => cleanup());

describe("ClearCartButton Component", () => {
  it("renders clear cart button with accessible label and submit type", () => {
    render(<ClearCartButton />);

    const button = screen.getByRole("button", { name: "Clear all items from cart" });
    expect(button).not.toBeNull();
    expect(button.getAttribute("type")).toBe("submit");
    expect(screen.getByText("Clear Cart")).not.toBeNull();
  });
});
