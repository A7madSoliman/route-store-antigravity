import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SubcategoryDetailError from "@/app/(shop)/subcategories/[subcategoryId]/error";
import SubcategoryDetailLoading from "@/app/(shop)/subcategories/[subcategoryId]/loading";
import SubcategoryDetailNotFound from "@/app/(shop)/subcategories/[subcategoryId]/not-found";
import { SubcategoryDetail } from "@/features/catalog/components/subcategory-detail";

afterEach(() => cleanup());

const subcategory = { id: "subcategory/one", name: "Subcategory One", slug: "subcategory-one", categoryId: "category-1" } as const;

describe("C07 subcategory detail presentation", () => {
  it("renders only verified identity and the documented breadcrumb", () => {
    render(<SubcategoryDetail state={{ status: "ready", subcategory }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Subcategory One" })).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(breadcrumb).getByRole("link", { name: "Subcategories" }).getAttribute("href")).toBe("/subcategories");
    expect(within(breadcrumb).getByText("Subcategory One").getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: /category/i })).toBeNull();
    expect(screen.queryByRole("list", { name: "Products" })).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByText(/product|description|popular|trending|rating|review|wishlist|cart|sale|discount|currency|stock|variant/i)).toBeNull();
  });

  it("renders a safe unavailable state without unsupported content", () => {
    render(<SubcategoryDetail state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/subcategory unavailable/i);
    expect(screen.getByRole("link", { name: "Return to subcategories" }).getAttribute("href")).toBe("/subcategories");
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("list", { name: "Products" })).toBeNull();
  });

  it("provides loading, not-found, and generic unexpected-error route states", () => {
    const retry = vi.fn();
    render(<SubcategoryDetailLoading />);
    expect(screen.getByRole("status", { name: "Loading subcategory" })).toBeTruthy();

    cleanup();
    render(<SubcategoryDetailNotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "Subcategory not found" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return to subcategories" }).getAttribute("href")).toBe("/subcategories");

    cleanup();
    render(<SubcategoryDetailError error={new Error("private upstream detail")} retry={retry} />);
    expect(screen.getByRole("alert").textContent).not.toMatch(/private upstream detail/i);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
