import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/cart/actions/add-to-cart.action", () => ({
  addToCartAction: vi.fn(),
}));
import { HomeCategorySection } from "@/features/home/components/home-category-section";
import { HomeProductSection } from "@/features/home/components/home-product-section";
import { NewsletterPromo } from "@/features/home/components/newsletter-promo";

afterEach(() => cleanup());

const category = { id: "category-1", name: "Category", slug: "category", imageUrl: null } as const;
const product = { id: "product-1", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand: { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } } as const;
const productWithImage = { ...product, imageUrl: "https://ecommerce.routemisr.com/images/product.webp" } as const;

describe("homepage sections", () => {
  it("renders route-backed category and product links with media fallbacks", () => {
    render(<><HomeCategorySection state={{ status: "ready", items: [category] }} /><HomeProductSection state={{ status: "ready", items: [product] }} /></>);
    expect(screen.getAllByRole("link").find((link) => link.getAttribute("href") === "/categories/category-1")?.getAttribute("href")).toBe("/categories/category-1");
    expect(screen.getAllByRole("link").find((link) => link.getAttribute("href") === "/products/product-1")?.getAttribute("href")).toBe("/products/product-1");
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Price 149")).not.toBeNull();
    expect(screen.queryByText(/\$|USD|EGP|LE|rating|trend|discount/i)).toBeNull();

    cleanup();
    render(<HomeProductSection state={{ status: "ready", items: [productWithImage] }} />);
    expect(screen.getByRole("img", { name: "Product" })).not.toBeNull();
  });

  it("keeps empty and error states distinct", () => {
    render(<><HomeCategorySection state={{ status: "empty", items: [] }} /><HomeProductSection state={{ status: "error" }} /></>);
    expect(screen.getByRole("status").textContent).toMatch(/no categories/i);
    expect(screen.getByRole("alert").textContent).toMatch(/couldn't load explore products/i);
  });

  it("encodes dynamic catalog identifiers in route links", () => {
    render(<HomeProductSection state={{ status: "ready", items: [{ ...product, id: "product/one" }] }} />);
    expect(screen.getAllByRole("link").find((link) => link.getAttribute("href") === "/products/product%2Fone")).not.toBeUndefined();
  });

  it("keeps homepage product cards in their existing rail layout", () => {
    const { container } = render(<HomeProductSection state={{ status: "ready", items: [product] }} />);
    expect(container.querySelector("li")?.className).toContain("min-w-[72vw]");
  });

  it("keeps newsletter presentation static", () => {
    render(<NewsletterPromo />);
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
