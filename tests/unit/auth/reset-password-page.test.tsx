import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import ResetPasswordPage from "@/app/(auth)/reset-password/page";

afterEach(() => cleanup());

describe("reset-password page", () => {
  it("renders the canonical fields and secure reset composition", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByRole("heading", { name: "Set New Password" })).not.toBeNull();
    expect(screen.getByRole("textbox", { name: "Email Address" })).not.toBeNull();
    expect(document.querySelector('input[name="newPassword"]')).not.toBeNull();
    expect(document.querySelector('input[name="rePassword"]')).not.toBeNull();
    expect(screen.getByRole("button", { name: "Reset Password" })).not.toBeNull();
  });

  it("is a server page with one AuthShell and no recovery/session transport", () => {
    expect(ResetPasswordPage.constructor.name).not.toBe("AsyncFunction");
    const source = readFileSync("app/(auth)/reset-password/page.tsx", "utf8");
    expect((source.match(/<AuthShell/g) ?? [])).toHaveLength(1);
    expect(source).not.toMatch(/session|protected|cookies|localStorage|sessionStorage|resetCode|token/iu);
  });
});
