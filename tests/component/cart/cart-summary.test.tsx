import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CartSummary } from "@/features/cart/components/cart-summary";

afterEach(() => cleanup());

describe("CartSummary Component", () => {
  it("renders order summary with formatted totals and checkout link", () => {
    render(<CartSummary totalCartPrice={1250} itemCount={3} />);

    expect(screen.getByRole("heading", { name: "Order Summary" })).not.toBeNull();
    expect(screen.getByText("Subtotal (3 items)")).not.toBeNull();
    expect(screen.getAllByText("EGP 1,250")).toHaveLength(2);

    const checkoutLink = screen.getByRole("link", { name: "Proceed to Checkout" });
    expect(checkoutLink).not.toBeNull();
    expect(checkoutLink.getAttribute("href")).toBe("/checkout");
  });
});
