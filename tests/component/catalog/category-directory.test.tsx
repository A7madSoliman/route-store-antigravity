import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CategoriesError from "@/app/(shop)/categories/error";
import CategoriesLoading from "@/app/(shop)/categories/loading";
import { CategoryDirectory } from "@/features/catalog/components/category-directory";

afterEach(() => cleanup());

const categories = [
  { id: "category/one", name: "Category One", slug: "category-one", imageUrl: "https://ecommerce.routemisr.com/images/category.webp" },
  { id: "category two", name: "Category Two", slug: "category-two", imageUrl: null },
] as const;
const ready = { status: "ready" as const, page: { items: categories, total: 2, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } };

describe("C05 category directory presentation", () => {
  it("renders verified category fields, media, fallback, encoded links, and semantic navigation", () => {
    render(<CategoryDirectory state={ready} />);
    expect(screen.getByRole("heading", { level: 1, name: "Categories" })).toBeTruthy();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(breadcrumb).getByText("Categories").getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("list", { name: "Categories" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Category One" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Category One" }).getAttribute("href")).toBe("/categories/category%2Fone");
    expect(screen.getByRole("link", { name: "Category Two" }).getAttribute("href")).toBe("/categories/category%20two");
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.queryByText(/products|popular|trending|rating|review|wishlist|cart|sale|discount|currency/i)).toBeNull();
    expect(screen.queryByRole("search")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("keeps empty and known error states mutually exclusive", () => {
    render(<CategoryDirectory state={{ status: "empty" }} />);
    expect(screen.getByRole("status").textContent).toMatch(/no categories are available/i);
    expect(screen.queryByRole("alert")).toBeNull();

    cleanup();
    render(<CategoryDirectory state={{ status: "error" }} />);
    expect(screen.getByRole("alert").textContent).toMatch(/categories are unavailable/i);
    expect(screen.queryByRole("list", { name: "Categories" })).toBeNull();
  });

  it("provides static loading semantics and generic unexpected-error recovery", () => {
    const retry = vi.fn();
    render(<CategoriesLoading />);
    expect(screen.getByRole("status", { name: "Loading categories" })).toBeTruthy();

    cleanup();
    render(<CategoriesError error={new Error("private upstream detail")} retry={retry} />);
    expect(screen.getByRole("alert").textContent).not.toMatch(/private upstream detail/i);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
