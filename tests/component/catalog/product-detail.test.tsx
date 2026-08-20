import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/cart/actions/add-to-cart.action", () => ({
  addToCartAction: vi.fn(),
}));
vi.mock("@/features/wishlist/actions/add-to-wishlist.action", () => ({
  addToWishlistAction: vi.fn(),
}));

import { ProductDetail, buildDisplayMedia } from "@/features/catalog/components/product-detail";

afterEach(() => cleanup());

const cover = "https://ecommerce.routemisr.com/images/cover.webp";
const gallery = "https://ecommerce.routemisr.com/images/gallery.webp";
const product = {
  id: "product-1",
  title: "Verified product",
  slug: "verified-product",
  price: 2379,
  imageUrl: cover,
  category: { id: "category-1", name: "Category", slug: "category", imageUrl: null },
  brand: { id: "brand-1", name: "Brand", slug: "brand", imageUrl: null },
  description: "First line\nSecond line",
  gallery: [cover, gallery],
  subcategories: [],
} as const;

describe("C04 product detail presentation", () => {
  it("puts the cover first and removes exact duplicate media", () => {
    expect(buildDisplayMedia(product)).toEqual([cover, gallery]);
    expect(buildDisplayMedia({ imageUrl: null, gallery: [gallery, cover] })).toEqual([gallery, cover]);
  });

  it("renders verified product fields, add to cart action, and add to wishlist action", () => {
    render(<ProductDetail state={{ status: "ready", product }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Verified product" })).toBeTruthy();
    expect(screen.getByText("Category")).toBeTruthy();
    expect(screen.getByText("Brand")).toBeTruthy();
    expect(screen.getByText("Price 2,379")).toBeTruthy();
    expect(screen.getByText((_, element) => element?.textContent === "First line\nSecond line")).toBeTruthy();
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /add to wishlist/i })).toBeTruthy();
    expect(screen.queryByText(/currency|rating|review|stock|discount|sale|variant|color|size/i)).toBeNull();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByText("Verified product").getAttribute("aria-current")).toBe("page");
  });

  it("renders a safe unavailable state without product actions", () => {
    render(<ProductDetail state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toContain("Product unavailable");
    expect(screen.getByRole("link", { name: "Return to products" }).getAttribute("href")).toBe("/products");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("omits a whitespace-only description", () => {
    render(<ProductDetail state={{ status: "ready", product: { ...product, description: "  \n  " } }} />);
    expect(screen.queryByRole("heading", { name: "Product description" })).toBeNull();
  });
});
