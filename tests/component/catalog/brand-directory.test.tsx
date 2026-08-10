import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BrandsError from "@/app/(shop)/brands/error";
import BrandsLoading from "@/app/(shop)/brands/loading";
import { BrandDirectory } from "@/features/catalog/components/brand-directory";

afterEach(() => cleanup());

const brands = [
  { id: "brand/one", name: "Brand One", slug: "brand-one", imageUrl: "https://ecommerce.routemisr.com/images/brand.webp" },
  { id: "brand two", name: "Brand Two", slug: "brand-two", imageUrl: null },
] as const;
const ready = { status: "ready" as const, page: { items: brands, total: 2, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } };

describe("C08 brand directory presentation", () => {
  it("renders verified brand fields, media/fallback, and encoded detail links", () => {
    render(<BrandDirectory state={ready} />);
    expect(screen.getByRole("heading", { level: 1, name: "Brands" })).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(breadcrumb).getByText("Brands").getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("list", { name: "Brands" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Brand One" }).getAttribute("href")).toBe("/brands/brand%2Fone");
    expect(screen.getByRole("link", { name: "Brand Two" }).getAttribute("href")).toBe("/brands/brand%20two");
    expect(document.querySelector('img[alt=""]')).not.toBeNull();
    expect(document.querySelectorAll("img")).toHaveLength(1);
    expect(screen.queryByText(/product|popular|trending|rating|review|wishlist|cart|sale|discount|currency|stock|variant/i)).toBeNull();
    expect(screen.queryByRole("search")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("keeps empty and known error states mutually exclusive", () => {
    render(<BrandDirectory state={{ status: "empty" }} />);
    expect(screen.getByRole("status").textContent).toMatch(/no brands are available/i);
    expect(screen.queryByRole("alert")).toBeNull();

    cleanup();
    render(<BrandDirectory state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/brands are unavailable/i);
    expect(screen.queryByRole("list", { name: "Brands" })).toBeNull();
  });

  it("provides static loading semantics and generic unexpected-error recovery", () => {
    const retry = vi.fn();
    render(<BrandsLoading />);
    expect(screen.getByRole("status", { name: "Loading brands" })).toBeTruthy();

    cleanup();
    render(<BrandsError error={new Error("private upstream detail")} retry={retry} />);
    expect(screen.getByRole("alert").textContent).not.toMatch(/private upstream detail/i);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
