// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("@/lib/api/endpoints/public/reset-password.server", () => ({
  resetPassword: request,
  ResetPasswordApiError: class ResetPasswordApiError extends Error {},
}));

import { resetPasswordAction } from "@/features/auth/actions/reset-password.action";
import {
  initialResetPasswordState,
  resetPasswordErrorMessage,
  resetPasswordSuccessMessage,
} from "@/features/auth/reset-password-state";
import { ResetPasswordApiError, resetPassword } from "@/lib/api/endpoints/public/reset-password.server";

beforeEach(() => request.mockReset());

function formDataWith(values: Record<string, FormDataEntryValue | null>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value !== null) data.set(key, value);
  }
  return data;
}

const valid = { email: "person@example.test", newPassword: "new-value", rePassword: "new-value" };

describe("reset-password action", () => {
  it("rejects missing, malformed, blank, non-string, and File values without calling the endpoint", async () => {
    const missing = await resetPasswordAction(initialResetPasswordState, formDataWith({}));
    expect(missing.status).toBe("error");
    expect(resetPassword).not.toHaveBeenCalled();

    const malformed = await resetPasswordAction(initialResetPasswordState, formDataWith({ ...valid, email: "not-an-email" }));
    expect(malformed).toMatchObject({ status: "error", message: "Enter a valid email address." });

    const blank = await resetPasswordAction(initialResetPasswordState, formDataWith({ ...valid, newPassword: "   ", rePassword: "   " }));
    expect(blank).toMatchObject({ status: "error", message: "This field is required." });

    const nonString = { get: (name: string) => (name === "email" ? 42 : valid[name as keyof typeof valid]) } as unknown as FormData;
    await expect(resetPasswordAction(initialResetPasswordState, nonString)).resolves.toMatchObject({ status: "error" });

    const file = new File(["secret"], "password.txt", { type: "text/plain" });
    await expect(resetPasswordAction(initialResetPasswordState, formDataWith({ ...valid, newPassword: file }))).resolves.toMatchObject({ status: "error" });
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("rejects confirmation mismatch and never sends rePassword upstream", async () => {
    const result = await resetPasswordAction(
      initialResetPasswordState,
      formDataWith({ ...valid, rePassword: "different" }),
    );
    expect(result).toMatchObject({ status: "error", message: "Passwords do not match." });
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("forwards accepted email and password unchanged exactly once", async () => {
    request.mockResolvedValueOnce("reset");
    const result = await resetPasswordAction(initialResetPasswordState, formDataWith(valid));
    expect(result).toEqual({ status: "success", message: resetPasswordSuccessMessage });
    expect(resetPassword).toHaveBeenCalledOnce();
    expect(resetPassword).toHaveBeenCalledWith({ email: valid.email, newPassword: valid.newPassword });
    expect(JSON.stringify(result)).not.toContain(valid.email);
    expect(JSON.stringify(result)).not.toContain(valid.newPassword);
  });

  it("maps endpoint failure safely and retains only the email for correction", async () => {
    request.mockRejectedValueOnce(new ResetPasswordApiError());
    const result = await resetPasswordAction(initialResetPasswordState, formDataWith(valid));
    expect(result).toEqual({ status: "error", email: valid.email, message: resetPasswordErrorMessage });
    expect(JSON.stringify(result)).not.toContain(valid.newPassword);
  });
});

