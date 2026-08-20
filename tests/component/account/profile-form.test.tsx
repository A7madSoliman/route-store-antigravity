import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/account/profile/actions/update-profile.action", () => ({
  updateProfileAction: vi.fn(),
}));

import { ProfileForm } from "@/features/account/profile/components/profile-form";

afterEach(() => cleanup());

describe("ProfileForm Component", () => {
  it("renders all three atomic update sections with initial values", () => {
    render(
      <ProfileForm
        initialName="John Doe"
        initialEmail="john@example.com"
        initialPhone="01012345678"
      />,
    );

    expect(screen.getByRole("heading", { name: "Personal Information" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Email Address" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Phone Number" })).not.toBeNull();

    const nameInput = screen.getByRole("textbox", { name: "Full Name" }) as HTMLInputElement;
    expect(nameInput.value).toBe("John Doe");
    expect(nameInput.name).toBe("name");

    const emailInput = screen.getByRole("textbox", { name: "Email Address" }) as HTMLInputElement;
    expect(emailInput.value).toBe("john@example.com");
    expect(emailInput.name).toBe("email");

    const phoneInput = document.getElementById("profile-phone") as HTMLInputElement;
    expect(phoneInput).not.toBeNull();
    expect(phoneInput.value).toBe("01012345678");
    expect(phoneInput.name).toBe("phone");

    expect(screen.getByRole("button", { name: "Update Name" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Update Email" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Update Phone" })).not.toBeNull();
  });
});
