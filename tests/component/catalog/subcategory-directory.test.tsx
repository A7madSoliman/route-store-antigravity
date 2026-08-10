import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SubcategoriesError from "@/app/(shop)/subcategories/error";
import SubcategoriesLoading from "@/app/(shop)/subcategories/loading";
import { SubcategoryDirectory } from "@/features/catalog/components/subcategory-directory";

afterEach(() => cleanup());

const subcategories = [
  { id: "subcategory/one", name: "Subcategory One", slug: "subcategory-one", categoryId: "category-1" },
  { id: "subcategory two", name: "Subcategory Two", slug: "subcategory-two", categoryId: "category-2" },
] as const;
const ready = { status: "ready" as const, page: { items: subcategories, total: 2, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } };

describe("C07 subcategory directory presentation", () => {
  it("renders verified identity, semantic navigation, and exactly-once encoded detail links", () => {
    render(<SubcategoryDirectory state={ready} />);
    expect(screen.getByRole("heading", { level: 1, name: "Subcategories" })).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(breadcrumb).getByText("Subcategories").getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("list", { name: "Subcategories" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Subcategory One" }).getAttribute("href")).toBe("/subcategories/subcategory%2Fone");
    expect(screen.getByRole("link", { name: "Subcategory Two" }).getAttribute("href")).toBe("/subcategories/subcategory%20two");
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByRole("search")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText(/product|popular|trending|rating|review|wishlist|cart|sale|discount|currency|stock|variant/i)).toBeNull();
  });

  it("keeps empty and known error states mutually exclusive", () => {
    render(<SubcategoryDirectory state={{ status: "empty" }} />);
    expect(screen.getByRole("status").textContent).toMatch(/no subcategories are available/i);
    expect(screen.queryByRole("alert")).toBeNull();

    cleanup();
    render(<SubcategoryDirectory state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/subcategories are unavailable/i);
    expect(screen.queryByRole("list", { name: "Subcategories" })).toBeNull();
  });

  it("provides static loading semantics and generic unexpected-error recovery", () => {
    const retry = vi.fn();
    render(<SubcategoriesLoading />);
    expect(screen.getByRole("status", { name: "Loading subcategories" })).toBeTruthy();

    cleanup();
    render(<SubcategoriesError error={new Error("private upstream detail")} retry={retry} />);
    expect(screen.getByRole("alert").textContent).not.toMatch(/private upstream detail/i);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
