import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StorefrontShell } from "@/components/layout/storefront-shell";

const navigation = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

describe("StorefrontShell", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    navigation.pathname = "/";
  });

  it("provides the approved shell landmarks and route-backed navigation", () => {
    render(
      <StorefrontShell>
        <h1>Shell content</h1>
      </StorefrontShell>,
    );

    expect(screen.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe("#main-content");
    expect(screen.getByRole("main").getAttribute("id")).toBe("main-content");
    expect(screen.getByRole("banner")).not.toBeNull();
    expect(screen.getByRole("contentinfo")).not.toBeNull();
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).not.toBeNull();
    expect(screen.getAllByRole("link", { name: "Search products" }).every((link) => link.getAttribute("href") === "/products")).toBe(true);
    expect(screen.getAllByRole("link", { name: "Account" }).every((link) => link.getAttribute("href") === "/sign-in?returnTo=%2Faccount%2Fprofile")).toBe(true);
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
  });

  it("does not claim unsupported storefront features", () => {
    render(
      <StorefrontShell>
        <p>Shell content</p>
      </StorefrontShell>,
    );

    expect(screen.queryByText(/free shipping/i)).toBeNull();
    expect(screen.queryByText(/new arrivals/i)).toBeNull();
    expect(screen.queryByText(/orders/i)).toBeNull();
    expect(screen.queryByText(/0/)).toBeNull();
  });
});
