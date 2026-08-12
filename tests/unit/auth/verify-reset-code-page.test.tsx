import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import VerifyResetCodePage from "@/app/(auth)/verify-reset-code/page";

afterEach(() => cleanup());

describe("verify-reset-code page", () => {
  it("renders the canonical recovery page and navigation", () => {
    render(<VerifyResetCodePage />);

    expect(VerifyResetCodePage.constructor.name).not.toBe("AsyncFunction");
    expect(screen.getByRole("heading", { name: "Verify Reset Code" })).not.toBeNull();
    expect(screen.getByRole("textbox", { name: "Reset code" })).not.toBeNull();
    expect(screen.getByRole("link", { name: /Back to Login/ }).getAttribute("href")).toBe("/sign-in");
  });

  it("contains no A07/session/protected behavior and exactly one AuthShell", () => {
    const source = readFileSync("app/(auth)/verify-reset-code/page.tsx", "utf8");
    expect(source).not.toMatch(/session|protected|returnTo|cookies|reset-password/iu);
    expect((source.match(/<AuthShell/g) ?? [])).toHaveLength(1);
  });
});
