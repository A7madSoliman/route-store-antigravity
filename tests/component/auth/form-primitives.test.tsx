import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { AlertBanner } from "@/components/ui/alert-banner";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";

afterEach(() => cleanup());

describe("auth form primitives", () => {
  it("associates a field with its description and error", () => {
    render(
      <FormField
        control={<input />}
        description="Use your account email."
        error="Email is required."
        id="email"
        label="Email"
        required
      />,
    );

    const input = document.getElementById("email") as HTMLInputElement;
    expect(input.getAttribute("aria-describedby")).toBe("email-description email-error");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.hasAttribute("required")).toBe(true);
    expect(screen.getByText("Use your account email.").id).toBe("email-description");
    expect(screen.getByText("Email is required.").id).toBe("email-error");
  });

  it("toggles password visibility with an accessible button", async () => {
    const user = userEvent.setup();
    render(<PasswordField id="password" label="Password" name="password" />);

    const input = document.getElementById("password") as HTMLInputElement;
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(input.type).toBe("password");
    await user.click(toggle);
    expect(input.type).toBe("text");
    expect(screen.getByRole("button", { name: "Hide password" }).getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{Enter}");
    expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe("password");
  });

  it("forwards native input attributes through PasswordField", () => {
    render(<PasswordField aria-describedby="external-help" aria-invalid id="password" label="Password" name="password" defaultValue="saved" disabled placeholder="Password" required />);

    const input = document.getElementById("password") as HTMLInputElement;
    expect(input.name).toBe("password");
    expect(input.defaultValue).toBe("saved");
    expect(input.disabled).toBe(true);
    expect(input.placeholder).toBe("Password");
    expect(input.required).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("external-help");
  });

  it("renders safe alert and status semantics", () => {
    const { rerender } = render(<AlertBanner>Invalid credentials.</AlertBanner>);
    expect(screen.getByRole("alert")).not.toBeNull();
    rerender(<AlertBanner tone="info">Check your inbox.</AlertBanner>);
    expect(screen.getByRole("status")).not.toBeNull();
  });

  it("renders the idle submit state inside a form", () => {
    render(<form><SubmitButton pendingLabel="Working...">Continue</SubmitButton></form>);
    const button = screen.getByRole("button", { name: "Continue" });
    expect((button as HTMLButtonElement).disabled).toBe(false);
    expect(button.getAttribute("type")).toBe("submit");
  });

  it("renders the pending submit state for a controlled synthetic action", async () => {
    let release: (() => void) | undefined;
    const action = () => new Promise<void>((resolve) => {
      release = resolve;
    });
    const user = userEvent.setup();

    render(<form action={action}><SubmitButton pendingLabel="Working...">Continue</SubmitButton></form>);
    const button = screen.getByRole("button", { name: "Continue" }) as HTMLButtonElement;
    await user.click(button);
    expect(button.disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Working..." })).not.toBeNull();
    expect(button.getAttribute("aria-busy")).toBe("true");

    release?.();
    await waitFor(() => expect((screen.getByRole("button", { name: "Continue" }) as HTMLButtonElement).disabled).toBe(false));
  });

  it("does not add terms or privacy controls", () => {
    render(<PasswordField label="Password" />);
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByRole("link", { name: /terms|privacy/i })).toBeNull();
    expect(screen.queryByDisplayValue(/token|jwt/i)).toBeNull();
  });
});
