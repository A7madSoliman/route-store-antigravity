import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/cart/actions/update-cart-quantity.action", () => ({
  updateCartQuantityAction: vi.fn(),
}));

import { QuantityStepper } from "@/features/cart/components/quantity-stepper";

afterEach(() => cleanup());

describe("QuantityStepper Component", () => {
  it("renders count and disabled decrement button when count is 1", () => {
    render(<QuantityStepper productId="prod-1" count={1} />);

    expect(screen.getByText("1")).not.toBeNull();

    const decrementBtn = screen.getByRole("button", { name: "Decrease quantity" });
    expect(decrementBtn.hasAttribute("disabled")).toBe(true);

    const incrementBtn = screen.getByRole("button", { name: "Increase quantity" });
    expect(incrementBtn.hasAttribute("disabled")).toBe(false);
  });

  it("enables decrement when count is greater than 1", () => {
    render(<QuantityStepper productId="prod-1" count={3} />);

    expect(screen.getByText("3")).not.toBeNull();

    const decrementBtn = screen.getByRole("button", { name: "Decrease quantity" });
    expect(decrementBtn.hasAttribute("disabled")).toBe(false);
  });

  it("disables increment when count reaches max", () => {
    render(<QuantityStepper productId="prod-1" count={5} max={5} />);

    const incrementBtn = screen.getByRole("button", { name: "Increase quantity" });
    expect(incrementBtn.hasAttribute("disabled")).toBe(true);
  });
});
