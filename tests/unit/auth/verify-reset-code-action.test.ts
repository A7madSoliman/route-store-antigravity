// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("@/lib/api/endpoints/public/verify-reset-code.server", () => ({
  verifyResetCode: request,
  VerifyResetCodeApiError: class VerifyResetCodeApiError extends Error {},
}));

import { verifyResetCodeAction } from "@/features/auth/actions/verify-reset-code.action";
import {
  initialVerifyResetCodeState,
  verifyResetCodeErrorMessage,
  verifyResetCodeSuccessMessage,
} from "@/features/auth/verify-reset-code-state";
import { VerifyResetCodeApiError, verifyResetCode } from "@/lib/api/endpoints/public/verify-reset-code.server";

beforeEach(() => request.mockReset());

function formDataWith(value: FormDataEntryValue | null): FormData {
  const data = new FormData();
  if (value !== null) data.set("resetCode", value);
  return data;
}

describe("verify-reset-code action", () => {
  it.each([
    ["missing", null],
    ["blank", ""],
    ["whitespace-only", "   "],
  ])("rejects %s without calling the endpoint", async (_label, value) => {
    const result = await verifyResetCodeAction(initialVerifyResetCodeState, formDataWith(value));
    expect(result).toEqual({ status: "error", message: "Enter the reset code." });
    expect(verifyResetCode).not.toHaveBeenCalled();
  });

  it("rejects a non-string value and a File", async () => {
    const nonStringFormData = { get: () => 42 } as unknown as FormData;
    await expect(verifyResetCodeAction(initialVerifyResetCodeState, nonStringFormData)).resolves.toEqual({
      status: "error",
      message: "Enter the reset code.",
    });

    const file = new File(["code"], "reset-code.txt", { type: "text/plain" });
    await expect(verifyResetCodeAction(initialVerifyResetCodeState, formDataWith(file))).resolves.toEqual({
      status: "error",
      message: "Enter the reset code.",
    });
    expect(verifyResetCode).not.toHaveBeenCalled();
  });

  it.each(["abc123456789", "A-code_with.symbols"])("forwards arbitrary input unchanged: %s", async (resetCode) => {
    request.mockResolvedValueOnce("verified");
    await expect(verifyResetCodeAction(initialVerifyResetCodeState, formDataWith(resetCode))).resolves.toEqual({
      status: "success",
      message: verifyResetCodeSuccessMessage,
    });
    expect(verifyResetCode).toHaveBeenCalledTimes(1);
    expect(verifyResetCode).toHaveBeenCalledWith({ resetCode });
  });

  it("maps endpoint failure generically without returning the code or provider text", async () => {
    request.mockRejectedValueOnce(new VerifyResetCodeApiError());
    const result = await verifyResetCodeAction(initialVerifyResetCodeState, formDataWith("abc123456789"));
    expect(result).toEqual({ status: "error", message: verifyResetCodeErrorMessage });
    expect(JSON.stringify(result)).not.toContain("abc123456789");
  });
});
