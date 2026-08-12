import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

afterEach(() => cleanup());

describe("forgot-password page", () => {
  it("is a server page with one auth shell and approved navigation", () => {
    render(<ForgotPasswordPage />);

    expect(ForgotPasswordPage.constructor.name).not.toBe("AsyncFunction");
    expect(screen.getByRole("heading", { name: "Forgot Password" })).not.toBeNull();
    expect(screen.getByRole("link", { name: "Back to Login" }).getAttribute("href")).toBe("/sign-in");
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Login" }).getAttribute("href")).toBe("/sign-in");
  });

  it("does not import session, protected-route, or returnTo behavior", () => {
    const source = readFileSync("app/(auth)/forgot-password/page.tsx", "utf8");

    expect(source).not.toMatch(/session|protected-route|returnTo|cookies/iu);
    expect((source.match(/<AuthShell/g) ?? [])).toHaveLength(1);
  });
});
