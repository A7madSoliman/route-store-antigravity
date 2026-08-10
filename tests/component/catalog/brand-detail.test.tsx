import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BrandDetailError from "@/app/(shop)/brands/[brandId]/error";
import BrandDetailLoading from "@/app/(shop)/brands/[brandId]/loading";
import BrandDetailNotFound from "@/app/(shop)/brands/[brandId]/not-found";
import { BrandDetail } from "@/features/catalog/components/brand-detail";

afterEach(() => cleanup());

const brand = { id: "brand/one", name: "Brand One", slug: "brand-one", imageUrl: "https://ecommerce.routemisr.com/images/brand.webp" } as const;

describe("C08 brand detail presentation", () => {
  it("renders verified identity, decorative media, and the exact brand-filter link", () => {
    render(<BrandDetail state={{ status: "ready", brand }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Brand One" })).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(breadcrumb).getByRole("link", { name: "Brands" }).getAttribute("href")).toBe("/brands");
    expect(within(breadcrumb).getByText("Brand One").getAttribute("aria-current")).toBe("page");
    expect(document.querySelector('img[alt=""]')).not.toBeNull();
    expect(screen.getByRole("link", { name: "View products from this brand" }).getAttribute("href")).toBe("/products?brand=brand%2Fone");
    expect(screen.queryByRole("list", { name: "Products" })).toBeNull();
    expect(screen.queryByText(/description|product count|popular|trending|rating|review|wishlist|cart|sale|discount|currency|stock|variant|country/i)).toBeNull();
  });

  it("renders a safe unavailable state without product content", () => {
    render(<BrandDetail state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/brand unavailable/i);
    expect(screen.getByRole("link", { name: "Return to brands" }).getAttribute("href")).toBe("/brands");
    expect(screen.queryByRole("list", { name: "Products" })).toBeNull();
  });

  it("provides loading, not-found, and generic unexpected-error route states", () => {
    const retry = vi.fn();
    render(<BrandDetailLoading />);
    expect(screen.getByRole("status", { name: "Loading brand" })).toBeTruthy();

    cleanup();
    render(<BrandDetailNotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "Brand not found" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return to brands" }).getAttribute("href")).toBe("/brands");

    cleanup();
    render(<BrandDetailError error={new Error("private upstream detail")} retry={retry} />);
    expect(screen.getByRole("alert").textContent).not.toMatch(/private upstream detail/i);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
