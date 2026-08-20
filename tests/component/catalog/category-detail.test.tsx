import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/cart/actions/add-to-cart.action", () => ({
  addToCartAction: vi.fn(),
}));
import CategoryDetailError from "@/app/(shop)/categories/[categoryId]/error";
import CategoryDetailLoading from "@/app/(shop)/categories/[categoryId]/loading";
import CategoryDetailNotFound from "@/app/(shop)/categories/[categoryId]/not-found";
import { CategoryDetail } from "@/features/catalog/components/category-detail";

afterEach(() => cleanup());

const category = { id: "category/one", name: "Category", slug: "category", imageUrl: "https://ecommerce.routemisr.com/images/category.webp" } as const;
const subcategory = { id: "subcategory/one", name: "Subcategory", slug: "subcategory", categoryId: category.id } as const;
const product = { id: "product/one", title: "Product", slug: "product", price: 149, imageUrl: null, category, brand: { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null } } as const;
const ready = { status: "ready" as const, category, subcategories: { status: "ready" as const, items: [subcategory] }, products: { status: "ready" as const, items: [product] } };

describe("C06 category detail presentation", () => {
  it("renders verified identity, encoded future subcategory links, and compatible product cards", () => {
    const { container } = render(<CategoryDetail state={ready} />);
    expect(screen.getByRole("heading", { level: 1, name: "Category" })).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(breadcrumb).queryByRole("link", { name: "Products" })).toBeNull();
    expect(within(breadcrumb).getByRole("link", { name: "Categories" }).getAttribute("href")).toBe("/categories");
    expect(within(breadcrumb).getByText("Category").getAttribute("aria-current")).toBe("page");
    expect(container.querySelector('img[alt=""]')).not.toBeNull();
    expect(screen.getByRole("link", { name: "Subcategory" }).getAttribute("href")).toBe("/subcategories/subcategory%2Fone");
    expect(screen.getByRole("list", { name: "Products" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /product/i }).getAttribute("href")).toBe("/products/product%2Fone");
    expect(screen.getByText("Price 149")).toBeTruthy();
    expect(screen.queryByText(/description|popular|trending|rating|review|sale|discount|currency|stock|variant/i)).toBeNull();
    expect(screen.queryByRole("search")).toBeNull();
    expect(screen.getByRole("button", { name: /add to wishlist/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeTruthy();
  });

  it("keeps successful sibling sections visible when one secondary section has a known error", () => {
    render(<CategoryDetail state={{ ...ready, subcategories: { status: "error" } }} />);
    expect(screen.getByText("Subcategories are unavailable right now.")).toBeTruthy();
    expect(screen.getByRole("list", { name: "Products" })).toBeTruthy();
  });

  it("renders truthful empty secondary sections and a safe category-unavailable state", () => {
    render(<CategoryDetail state={{ ...ready, subcategories: { status: "empty" }, products: { status: "empty" } }} />);
    expect(screen.getByText(/no subcategories are available/i)).toBeTruthy();
    expect(screen.getByText(/no products are available/i)).toBeTruthy();

    cleanup();
    render(<CategoryDetail state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/category unavailable/i);
    expect(screen.queryByRole("list", { name: "Products" })).toBeNull();
  });

  it("provides loading, not-found, and generic unexpected-error route states", () => {
    const retry = vi.fn();
    render(<CategoryDetailLoading />);
    expect(screen.getByRole("status", { name: "Loading category" })).toBeTruthy();

    cleanup();
    render(<CategoryDetailNotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "Category not found" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return to categories" }).getAttribute("href")).toBe("/categories");

    cleanup();
    render(<CategoryDetailError error={new Error("private upstream detail")} retry={retry} />);
    expect(screen.getByRole("alert").textContent).not.toMatch(/private upstream detail/i);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
