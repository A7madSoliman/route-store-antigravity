// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("@/lib/api/endpoints/public/forgot-password.server", () => ({
  requestPasswordReset: request,
  ForgotPasswordApiError: class ForgotPasswordApiError extends Error {
    constructor(readonly code: string) {
      super(code);
    }
  },
}));

import { forgotPasswordAction } from "@/features/auth/actions/forgot-password.action";
import { forgotPasswordConfirmation, initialForgotPasswordState } from "@/features/auth/forgot-password-state";
import { ForgotPasswordApiError, requestPasswordReset } from "@/lib/api/endpoints/public/forgot-password.server";

beforeEach(() => request.mockReset());

function formDataWith(email: FormDataEntryValue | null): FormData {
  const data = new FormData();
  if (email !== null) {
    data.set("email", email);
  }
  return data;
}

describe("forgot-password action", () => {
  it.each([
    ["missing", null],
    ["blank", ""],
    ["whitespace-only", "   "],
    ["malformed", "not-an-email"],
  ])("rejects %s email without calling the endpoint", async (_label, email) => {
    const result = await forgotPasswordAction(initialForgotPasswordState, formDataWith(email));

    expect(result.status).toBe("error");
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("rejects a non-string email without calling the endpoint", async () => {
    const nonStringFormData = { get: () => 42 } as unknown as FormData;

    const result = await forgotPasswordAction(initialForgotPasswordState, nonStringFormData);

    expect(result.status).toBe("error");
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("rejects a file email without calling the endpoint", async () => {
    const file = new File(["not an email"], "email.txt", { type: "text/plain" });
    const result = await forgotPasswordAction(initialForgotPasswordState, formDataWith(file));

    expect(result.status).toBe("error");
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("forwards a valid email unchanged exactly once and returns the safe confirmation", async () => {
    request.mockResolvedValueOnce("confirmation");
    const email = "person@example.test";

    await expect(forgotPasswordAction(initialForgotPasswordState, formDataWith(email))).resolves.toEqual({
      status: "success",
      email: "",
      message: forgotPasswordConfirmation,
    });
    expect(requestPasswordReset).toHaveBeenCalledTimes(1);
    expect(requestPasswordReset).toHaveBeenCalledWith({ email });
  });

  it("uses the same confirmation state when the endpoint handles the observed 404", async () => {
    request.mockResolvedValueOnce("confirmation");

    await expect(forgotPasswordAction(initialForgotPasswordState, formDataWith("person@example.test"))).resolves.toMatchObject({
      status: "success",
      email: "",
      message: forgotPasswordConfirmation,
    });
  });

  it("maps endpoint failures to a generic message without raw upstream content", async () => {
    request.mockRejectedValueOnce(new ForgotPasswordApiError("rejected"));

    const result = await forgotPasswordAction(initialForgotPasswordState, formDataWith("person@example.test"));
    expect(result).toEqual({
      status: "error",
      email: "person@example.test",
      message: "We couldn't start password recovery. Please try again.",
    });
    expect(JSON.stringify(result)).not.toContain("rejected");
  });
});
