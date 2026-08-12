import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { actionState } = vi.hoisted(() => ({
  actionState: {
    current: { status: "idle" } as {
      status: "idle" | "error" | "success";
      email?: string;
      message?: string;
      fieldErrors?: Record<string, string>;
    },
  },
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useActionState: () => [actionState.current, vi.fn()] };
});

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

afterEach(() => {
  actionState.current = { status: "idle" };
  cleanup();
});

describe("reset-password form", () => {
  it("renders one email field and two new-password fields with approved semantics", () => {
    render(<ResetPasswordForm />);
    expect(document.querySelectorAll('input[name="email"]')).toHaveLength(1);
    expect(document.querySelectorAll('input[name="newPassword"]')).toHaveLength(1);
    expect(document.querySelectorAll('input[name="rePassword"]')).toHaveLength(1);
    const email = screen.getByRole("textbox", { name: /Email Address/ }) as HTMLInputElement;
    const newPassword = document.querySelector('input[name="newPassword"]') as HTMLInputElement;
    const rePassword = document.querySelector('input[name="rePassword"]') as HTMLInputElement;
    expect(email.getAttribute("autocomplete")).toBe("email");
    expect(newPassword.getAttribute("autocomplete")).toBe("new-password");
    expect(rePassword.getAttribute("autocomplete")).toBe("new-password");
    expect(email.required).toBe(true);
    expect(newPassword.required).toBe(true);
    expect(rePassword.required).toBe(true);
    expect(screen.queryByText(/8 characters|uppercase|lowercase|symbol|strength/i)).toBeNull();
    expect(screen.queryByRole("textbox", { name: /reset code|proof/i })).toBeNull();
  });

  it("supports password reveal/remask controls", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    const password = document.querySelector('input[name="newPassword"]') as HTMLInputElement;
    const toggle = screen.getAllByRole("button", { name: "Show password" })[0];
    expect(password.type).toBe("password");
    await user.click(toggle);
    expect(password.type).toBe("text");
    expect(screen.getByRole("button", { name: "Hide password" }).getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{Enter}");
    expect(password.type).toBe("password");
  });

  it("associates field errors and renders the safe success navigation", () => {
    actionState.current = {
      status: "error",
      email: "person@example.test",
      message: "Passwords do not match.",
      fieldErrors: { rePassword: "Passwords do not match." },
    };
    const { rerender } = render(<ResetPasswordForm />);
    const confirmation = document.querySelector('input[name="rePassword"]') as HTMLInputElement;
    expect(confirmation.getAttribute("aria-invalid")).toBe("true");
    expect(confirmation.getAttribute("aria-describedby")).toContain("rePassword-error");

    actionState.current = {
      status: "success",
      message: "Your password has been successfully reset. You can now sign in with your new credentials.",
    };
    rerender(<ResetPasswordForm />);
    expect(screen.getByRole("link", { name: "Go to Sign In" }).getAttribute("href")).toBe("/sign-in");
    expect(screen.queryByRole("textbox", { name: /New Password/ })).toBeNull();
  });
});
