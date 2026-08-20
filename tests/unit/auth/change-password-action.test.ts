// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { requireSessionMock, changePasswordMock, setSessionMock } = vi.hoisted(() => ({
  requireSessionMock: vi.fn(),
  changePasswordMock: vi.fn(),
  setSessionMock: vi.fn(),
}));

vi.mock("@/lib/auth/require-session.server", () => ({
  requireSession: requireSessionMock,
}));

vi.mock("@/lib/auth/session.server", () => ({
  setSession: setSessionMock,
}));

vi.mock("@/lib/api/endpoints/protected/change-password.server", () => ({
  changePassword: changePasswordMock,
  ChangePasswordApiError: class ChangePasswordApiError extends Error {
    constructor(readonly code: string) {
      super(code);
    }
  },
}));

import { changePasswordAction } from "@/features/account/security/actions/change-password.action";
import { initialPasswordChangeState } from "@/features/account/security/security-state";
import { ChangePasswordApiError } from "@/lib/api/endpoints/protected/change-password.server";

beforeEach(() => {
  requireSessionMock.mockReset();
  changePasswordMock.mockReset();
  setSessionMock.mockReset();

  requireSessionMock.mockResolvedValue({
    expiresAt: new Date(Date.now() + 3600000),
    user: { name: "Current User", email: "current@example.com" },
  });
});

describe("changePasswordAction Server Action", () => {
  it("rejects empty current password without calling endpoint", async () => {
    const formData = new FormData();
    formData.set("currentPassword", "");
    formData.set("password", "new-password-123");
    formData.set("rePassword", "new-password-123");

    const result = await changePasswordAction(initialPasswordChangeState, formData);
    expect(result).toMatchObject({
      status: "error",
      field: "currentPassword",
      message: "Current password is required.",
    });
    expect(changePasswordMock).not.toHaveBeenCalled();
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it("rejects new password shorter than 8 characters without calling endpoint", async () => {
    const formData = new FormData();
    formData.set("currentPassword", "old-password");
    formData.set("password", "short");
    formData.set("rePassword", "short");

    const result = await changePasswordAction(initialPasswordChangeState, formData);
    expect(result).toMatchObject({
      status: "error",
      field: "password",
      message: "New password must be at least 8 characters.",
    });
    expect(changePasswordMock).not.toHaveBeenCalled();
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it("rejects mismatched password confirmation without calling endpoint", async () => {
    const formData = new FormData();
    formData.set("currentPassword", "old-password");
    formData.set("password", "new-password-123");
    formData.set("rePassword", "mismatched-password");

    const result = await changePasswordAction(initialPasswordChangeState, formData);
    expect(result).toMatchObject({
      status: "error",
      field: "rePassword",
      message: "Passwords do not match.",
    });
    expect(changePasswordMock).not.toHaveBeenCalled();
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it("changes password successfully and rotates session token in-place via setSession", async () => {
    changePasswordMock.mockResolvedValueOnce({
      user: { name: "Current User", email: "current@example.com" },
      token: "rotated-new-token-999",
    });

    const formData = new FormData();
    formData.set("currentPassword", "old-password-123");
    formData.set("password", "brand-new-password-123");
    formData.set("rePassword", "brand-new-password-123");

    const result = await changePasswordAction(initialPasswordChangeState, formData);
    expect(result).toMatchObject({
      status: "success",
      message: "Your password has been changed successfully.",
    });

    expect(changePasswordMock).toHaveBeenCalledWith({
      currentPassword: "old-password-123",
      password: "brand-new-password-123",
      rePassword: "brand-new-password-123",
    });

    // Confirmed token rotation: setSession called with rotated token
    expect(setSessionMock).toHaveBeenCalledWith("rotated-new-token-999", {
      name: "Current User",
      email: "current@example.com",
    });
  });

  it("maps wrong-current-password error to field error without modifying session", async () => {
    changePasswordMock.mockRejectedValueOnce(new ChangePasswordApiError("wrong-current-password"));

    const formData = new FormData();
    formData.set("currentPassword", "wrong-old-password");
    formData.set("password", "brand-new-password-123");
    formData.set("rePassword", "brand-new-password-123");

    const result = await changePasswordAction(initialPasswordChangeState, formData);
    expect(result).toMatchObject({
      status: "error",
      field: "currentPassword",
      message: "Current password is incorrect.",
    });
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it("maps unauthorized error to session-expired message without modifying session", async () => {
    changePasswordMock.mockRejectedValueOnce(new ChangePasswordApiError("unauthorized"));

    const formData = new FormData();
    formData.set("currentPassword", "old-password-123");
    formData.set("password", "brand-new-password-123");
    formData.set("rePassword", "brand-new-password-123");

    const result = await changePasswordAction(initialPasswordChangeState, formData);
    expect(result).toMatchObject({
      status: "error",
      message: "Your session has expired. Please sign in again.",
    });
    expect(setSessionMock).not.toHaveBeenCalled();
  });

  it("maps unavailable error to safe service unavailable message without modifying session", async () => {
    changePasswordMock.mockRejectedValueOnce(new ChangePasswordApiError("unavailable"));

    const formData = new FormData();
    formData.set("currentPassword", "old-password-123");
    formData.set("password", "brand-new-password-123");
    formData.set("rePassword", "brand-new-password-123");

    const result = await changePasswordAction(initialPasswordChangeState, formData);
    expect(result).toMatchObject({
      status: "error",
      message: "Security service is temporarily unavailable. Please try again.",
    });
    expect(setSessionMock).not.toHaveBeenCalled();
  });
});
