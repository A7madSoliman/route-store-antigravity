import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/account/security/actions/change-password.action", () => ({
  changePasswordAction: vi.fn(),
}));

import { SecurityForm } from "@/features/account/security/components/security-form";

afterEach(() => cleanup());

describe("SecurityForm Component", () => {
  it("renders all three password fields, security note, and submit button", () => {
    render(<SecurityForm />);

    expect(screen.getByRole("heading", { name: "Change Password" })).not.toBeNull();

    const currentPassInput = document.getElementById("currentPassword") as HTMLInputElement;
    expect(currentPassInput).not.toBeNull();
    expect(currentPassInput.type).toBe("password");
    expect(currentPassInput.name).toBe("currentPassword");
    expect(currentPassInput.autocomplete).toBe("current-password");

    const newPassInput = document.getElementById("password") as HTMLInputElement;
    expect(newPassInput).not.toBeNull();
    expect(newPassInput.type).toBe("password");
    expect(newPassInput.name).toBe("password");
    expect(newPassInput.autocomplete).toBe("new-password");

    const rePassInput = document.getElementById("rePassword") as HTMLInputElement;
    expect(rePassInput).not.toBeNull();
    expect(rePassInput.type).toBe("password");
    expect(rePassInput.name).toBe("rePassword");
    expect(rePassInput.autocomplete).toBe("new-password");

    expect(screen.getByRole("button", { name: "Update Password" })).not.toBeNull();

    // Security notice assertions: must state session update and NOT promise cross-device logout
    expect(screen.getByText("Your current session will be updated.")).not.toBeNull();
    expect(screen.queryByText(/all devices/i)).toBeNull();
  });
});
