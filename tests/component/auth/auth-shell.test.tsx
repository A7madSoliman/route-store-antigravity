import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AuthShell } from "@/components/layout/auth-shell";

afterEach(() => cleanup());

describe("AuthShell", () => {
  it("renders stable auth regions and supplied children", () => {
    render(<AuthShell><h1>Sign in</h1></AuthShell>);

    expect(screen.getByRole("banner")).not.toBeNull();
    expect(screen.getByRole("main").getAttribute("id")).toBe("main-content");
    expect(screen.getByRole("heading", { name: "Sign in" })).not.toBeNull();
    expect(screen.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe("#main-content");
    expect(screen.queryByRole("link", { name: /sign-up|sign-in|login/i })).toBeNull();
  });

  it("renders optional presentation slots without owning route destinations", () => {
    render(
      <AuthShell footer={<span>Provided footer</span>} headerAction={<span>Provided action</span>}>
        <p>Content</p>
      </AuthShell>,
    );

    expect(screen.getByText("Provided footer")).not.toBeNull();
    expect(screen.getByText("Provided action")).not.toBeNull();
    expect(screen.queryByRole("link", { name: /terms|privacy/i })).toBeNull();
  });
});
