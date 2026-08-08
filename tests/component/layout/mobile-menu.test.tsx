import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { primaryNavigation } from "@/components/layout/navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("MobileMenu", () => {
  afterEach(() => cleanup());

  it("opens, closes with Escape, and restores focus to its trigger", async () => {
    const user = userEvent.setup();
    render(<MobileMenu primaryItems={primaryNavigation} />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("navigation", { name: "Mobile menu" })).not.toBeNull();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open menu" }));
  });

  it("closes after choosing a route-backed menu link", async () => {
    const user = userEvent.setup();
    render(<MobileMenu primaryItems={primaryNavigation} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(within(screen.getByRole("navigation", { name: "Mobile menu" })).getByRole("link", { name: "Categories" }));

    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });
});
