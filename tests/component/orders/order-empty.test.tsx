import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { OrderEmpty } from "@/features/orders/components/order-empty";

afterEach(() => cleanup());

describe("OrderEmpty Component", () => {
  it("renders empty state heading and explore products button", () => {
    render(<OrderEmpty />);

    expect(screen.getByRole("heading", { name: "No orders placed yet" })).not.toBeNull();
    const link = screen.getByRole("link", { name: "Explore Products" });
    expect(link.getAttribute("href")).toBe("/products");
  });
});
