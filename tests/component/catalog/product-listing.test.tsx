import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductsError from "@/app/(shop)/products/error";
import ProductsLoading from "@/app/(shop)/products/loading";
import { ProductListing } from "@/features/catalog/components/product-listing";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
afterEach(() => cleanup());

const category = { id: "category-1", name: "Category", slug: "category", imageUrl: null } as const;
const brand = { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } as const;
const product = { id: "product/one", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand } as const;
const readyView = {
  query: { kind: "baseline" as const },
  products: { status: "ready" as const, page: { items: [product], total: 1, pagination: { currentPage: 1, numberOfPages: 2, limit: 40, nextPage: 2 } } },
  categories: { status: "ready" as const, items: [category] },
  brands: { status: "ready" as const, items: [brand] },
};

describe("C09 product listing presentation", () => {
  it("renders verified controls and only baseline page-two navigation", () => {
    render(<ProductListing view={readyView} />);
    expect(screen.getByRole("heading", { level: 1, name: "Products" })).not.toBeNull();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByText("Products").getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("list", { name: "Products" })).not.toBeNull();
    expect(screen.getByRole("link", { name: /product/i }).getAttribute("href")).toBe("/products/product%2Fone");
    expect(screen.getByText("Showing 1 products")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Page 2" }).getAttribute("href")).toBe("/products?page=2");
    expect(screen.queryByRole("search")).toBeNull();
    expect(screen.queryByText(/sustainab|color|rating/i)).toBeNull();
  });

  it("places the sidebar and server result subtree under one catalog layout", () => {
    render(<ProductListing view={readyView} />);
    const aside = screen.getByRole("complementary", { name: "Product filters" });
    const products = screen.getByRole("region", { name: "Products" });
    const layout = aside.parentElement;
    expect(layout).not.toBeNull();
    expect(layout?.className).toContain("lg:grid-cols-[16rem_minmax(0,1fr)]");
    expect(layout?.contains(products)).toBe(true);
    expect(products.className).not.toContain("lg:pl-[17.5rem]");
  });

  it("suppresses pagination for filtered states and renders a removable chip", () => {
    render(<ProductListing view={{ ...readyView, query: { kind: "brand", brandId: "brand-1" } }} />);
    expect(screen.queryByRole("link", { name: "Page 2" })).toBeNull();
    expect(screen.getByRole("link", { name: /Remove Brand/i }).getAttribute("href")).toBe("/products");
  });

  it("keeps filtered empty and product error states distinct", () => {
    render(<ProductListing view={{ ...readyView, query: { kind: "brand", brandId: "brand-1" }, products: { status: "empty" } }} />);
    expect(screen.getByRole("status").textContent).toMatch(/no matching products/i);
    cleanup();
    render(<ProductListing view={{ ...readyView, products: { status: "error" } }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/unavailable right now/i);
    expect(screen.queryByRole("list", { name: "Products" })).toBeNull();
  });

  it("provides an accessible loading state and generic unexpected-error recovery", () => {
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
