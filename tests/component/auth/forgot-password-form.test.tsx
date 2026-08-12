import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { actionState } = vi.hoisted(() => ({
  actionState: {
    current: { status: "idle", email: "" } as {
      status: "idle" | "error" | "success";
      email: string;
      message?: string;
    },
  },
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useActionState: () => [actionState.current, vi.fn()],
  };
});

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

afterEach(() => {
  actionState.current = { status: "idle", email: "" };
  cleanup();
});

describe("forgot-password form", () => {
  it("renders exactly the approved email submission controls", () => {
    render(<ForgotPasswordForm />);

    const email = screen.getByRole("textbox", { name: "Email Address" }) as HTMLInputElement;
    expect(email.name).toBe("email");
    expect(email.type).toBe("email");
    expect(email.required).toBe(true);
    expect(email.autocomplete).toBe("email");
    expect(email.placeholder).toBe("name@company.com");
    expect(screen.getByRole("button", { name: "Send Reset Code" })).not.toBeNull();
    expect(screen.queryByLabelText(/password|reset code/i)).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByText(/resend|open email|social|terms/i)).toBeNull();
  });

  it("keeps the form free of browser storage and recovery-token controls", () => {
    render(<ForgotPasswordForm />);

    expect(document.querySelectorAll("input")).toHaveLength(1);
    expect(screen.queryByDisplayValue(/token|jwt|cookie/i)).toBeNull();
  });

  it("associates the error with the email field and announces it safely", () => {
    actionState.current = {
      status: "error",
      email: "person@example.test",
      message: "We couldn't start password recovery. Please try again.",
    };

    render(<ForgotPasswordForm />);

    const email = screen.getByRole("textbox", { name: "Email Address" });
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(email.getAttribute("aria-describedby")).toContain("email-error");
    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(screen.getAllByText("We couldn't start password recovery. Please try again.")).toHaveLength(2);
    expect(document.activeElement).toBe(screen.getAllByRole("alert")[0]?.parentElement);
  });

  it("replaces the form with the exact enumeration-safe confirmation", () => {
    actionState.current = {
      status: "success",
      email: "",
      message: "If an account exists for this email, reset instructions will be sent.",
    };

    render(<ForgotPasswordForm />);

    expect(screen.getByRole("status").textContent).toBe(
      "If an account exists for this email, reset instructions will be sent.",
    );
    expect(screen.queryByRole("textbox", { name: "Email Address" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Send Reset Code" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("status").parentElement);
  });
});
