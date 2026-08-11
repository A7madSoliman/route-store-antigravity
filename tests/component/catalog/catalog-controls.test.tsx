import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CatalogControls } from "@/features/catalog/components/catalog-controls";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
afterEach(() => { cleanup(); push.mockReset(); });

const props = {
  query: { kind: "baseline" as const },
  categories: [{ id: "category-1", name: "Category" }],
  categoryStatus: "ready" as const,
  brands: [{ id: "brand-1", name: "Brand" }, { id: "brand-2", name: "Brand 2" }],
  brandStatus: "ready" as const,
};

describe("C09 catalog controls", () => {
  it("offers only verified sort values and no search control", () => {
    render(<CatalogControls {...props} />);
    expect(screen.getByRole("option", { name: "Price: low to high" })).not.toBeNull();
    expect(screen.getByRole("option", { name: "Price: high to low" })).not.toBeNull();
    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("navigates through the canonical builder for sort changes", () => {
    render(<CatalogControls {...props} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Sort products" }), { target: { value: "price" } });
    expect(push).toHaveBeenCalledWith("/products?sort=price", { scroll: false });
  });

  it("does not offer sort controls for standalone brand state", () => {
    render(<CatalogControls {...props} query={{ kind: "brand", brandId: "brand-1" }} />);
    expect(screen.queryByRole("combobox", { name: "Sort products" })).toBeNull();
  });

  it("retains the category when replacing a category brand", () => {
    render(<CatalogControls {...props} query={{ kind: "category-brand", categoryId: "category-1", brandId: "brand-1" }} />);
    fireEvent.change(screen.getAllByRole("combobox", { name: "Brand" })[0], { target: { value: "brand-2" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply filters", hidden: true }));
    expect(push).toHaveBeenCalledWith("/products?category%5Bin%5D=category-1&brand=brand-2", { scroll: false });
  });

  it("opens and closes the responsive filter dialog", () => {
    render(<CatalogControls {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog", { name: "Filters" })).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close filters" }));
    expect(screen.queryByRole("dialog", { name: "Filters" })).toBeNull();
  });
});
