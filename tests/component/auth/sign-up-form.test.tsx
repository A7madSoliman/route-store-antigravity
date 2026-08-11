import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { SignUpForm } from "@/features/auth/components/sign-up-form";

afterEach(() => cleanup());

describe("sign-up form", () => {
  it("renders the five API-backed fields without consent placeholders", () => {
    render(<SignUpForm returnTo="/" />);
    expect(screen.getByRole("textbox", { name: "Full Name" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Email Address" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Phone Number" })).toBeTruthy();
    expect(document.getElementById("password")).toBeTruthy();
    expect(document.getElementById("rePassword")).toBeTruthy();
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByText(/terms|privacy/i)).toBeNull();
  });
});
