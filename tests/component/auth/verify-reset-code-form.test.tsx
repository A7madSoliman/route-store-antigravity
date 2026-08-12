import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { actionState } = vi.hoisted(() => ({
  actionState: {
    current: { status: "idle" } as { status: "idle" | "error" | "success"; message?: string },
  },
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useActionState: () => [actionState.current, vi.fn()] };
});

import { VerifyResetCodeForm } from "@/features/auth/components/verify-reset-code-form";

afterEach(() => {
  actionState.current = { status: "idle" };
  cleanup();
});

describe("verify-reset-code form", () => {
  it("renders one unconstrained semantic text input", () => {
    render(<VerifyResetCodeForm />);

    const input = screen.getByRole("textbox", { name: "Reset code" }) as HTMLInputElement;
    expect(document.querySelectorAll('input[name="resetCode"]')).toHaveLength(1);
    expect(input.type).toBe("text");
    expect(input.required).toBe(true);
    expect(input.maxLength).toBe(-1);
    expect(input.getAttribute("maxlength")).toBeNull();
    expect(input.getAttribute("pattern")).toBeNull();
    expect(input.getAttribute("inputmode")).toBeNull();
    expect(screen.getByText("Enter the reset code.").id).toBe("resetCode-description");
    expect(screen.getByRole("button", { name: "Verify Code" })).not.toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByText(/resend|countdown|password|reset proof/i)).toBeNull();
  });

  it("supports arbitrary typing, paste, and deletion without fixed-format behavior", async () => {
    const user = userEvent.setup();
    render(<VerifyResetCodeForm />);
    const input = screen.getByRole("textbox", { name: "Reset code" }) as HTMLInputElement;

    await user.type(input, "abc123456789");
    expect(input.value).toBe("abc123456789");
    await user.clear(input);
    await user.paste("A-code_with.symbols");
    expect(input.value).toBe("A-code_with.symbols");
    await user.clear(input);
    expect(input.value).toBe("");
  });

  it("announces error and success states without returning the code", () => {
    actionState.current = { status: "error", message: "We couldn't verify that reset code. Please try again." };
    const { rerender } = render(<VerifyResetCodeForm />);
    const input = screen.getByRole("textbox", { name: "Reset code" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toContain("resetCode-error");
    expect(screen.getAllByRole("alert")).toHaveLength(2);

    actionState.current = { status: "success", message: "Reset code verified." };
    rerender(<VerifyResetCodeForm />);
    expect(screen.getByRole("status").textContent).toBe("Reset code verified.");
    expect(screen.queryByRole("textbox", { name: "Reset code" })).toBeNull();
  });
});
