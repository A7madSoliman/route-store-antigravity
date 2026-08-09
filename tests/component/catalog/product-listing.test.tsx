import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductsError from "@/app/(shop)/products/error";
import ProductsLoading from "@/app/(shop)/products/loading";
import { ProductListing } from "@/features/catalog/components/product-listing";

afterEach(() => cleanup());

const category = { id: "category-1", name: "Category", slug: "category", imageUrl: null } as const;
const brand = { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } as const;
const product = { id: "product/one", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand } as const;
const ready = { status: "ready" as const, page: { items: [product], total: 1, pagination: { currentPage: 1, numberOfPages: 2, limit: 40, nextPage: 2 } } };

describe("C03 product listing presentation", () => {
  it("renders the heading, accessible breadcrumb, grid card, and only verified page-two navigation", () => {
    render(<ProductListing state={ready} />);

    expect(screen.getByRole("heading", { level: 1, name: "Products" })).not.toBeNull();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb).not.toBeNull();
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(breadcrumb).getByText("Products").getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("list", { name: "Products" })).not.toBeNull();
    expect(screen.getByRole("link", { name: /product/i }).getAttribute("href")).toBe("/products/product%2Fone");
    expect(screen.getByText("Price 149")).not.toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("link", { name: "Page 2" }).getAttribute("href")).toBe("/products?page=2");
    expect(screen.getByText("1").getAttribute("aria-current")).toBe("page");
    expect(screen.queryByText(/\$|USD|EGP|rating|wishlist|cart|discount|sale/i)).toBeNull();
    expect(screen.queryByRole("search")).toBeNull();
    expect(screen.queryByRole("button", { name: /filter|sort/i })).toBeNull();
  });

  it("uses only canonical back navigation for verified page two", () => {
    render(<ProductListing state={{ ...ready, page: { ...ready.page, pagination: { currentPage: 2, numberOfPages: 2, limit: 40, prevPage: 1 } } }} />);

    expect(screen.getByRole("link", { name: "Page 1" }).getAttribute("href")).toBe("/products");
    expect(screen.getByText("2").getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: "Page 3" })).toBeNull();
  });

  it("keeps empty and known error states mutually exclusive", () => {
    render(<ProductListing state={{ status: "empty" }} />);
    expect(screen.getByRole("status").textContent).toMatch(/no products are available/i);
    expect(screen.queryByRole("alert")).toBeNull();

    cleanup();
    render(<ProductListing state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/unavailable right now/i);
    expect(screen.queryByRole("list", { name: "Products" })).toBeNull();
  });

  it("provides an accessible static loading state and generic unexpected-error recovery", () => {
    const reset = vi.fn();
    render(<ProductsLoading />);
    expect(screen.getByRole("status", { name: "Loading products" })).not.toBeNull();

    cleanup();
    render(<ProductsError error={new Error("private upstream detail")} reset={reset} />);
    expect(screen.getByRole("alert").textContent).not.toMatch(/private upstream detail/i);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
