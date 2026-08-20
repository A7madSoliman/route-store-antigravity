import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CartEmpty } from "@/features/cart/components/cart-empty";

afterEach(() => cleanup());

describe("CartEmpty Component", () => {
  it("renders empty state heading and link to products catalog", () => {
    render(<CartEmpty />);

    expect(screen.getByRole("heading", { name: "Your cart is empty" })).not.toBeNull();
    const link = screen.getByRole("link", { name: "Start Shopping" });
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("/products");
  });
});
