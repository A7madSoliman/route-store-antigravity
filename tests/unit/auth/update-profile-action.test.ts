// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { requireSessionMock, updateProfileMock, updateSessionIdentityMock } = vi.hoisted(() => ({
  requireSessionMock: vi.fn(),
  updateProfileMock: vi.fn(),
  updateSessionIdentityMock: vi.fn(),
}));

vi.mock("@/lib/auth/require-session.server", () => ({
  requireSession: requireSessionMock,
}));

vi.mock("@/lib/auth/session.server", () => ({
  updateSessionIdentity: updateSessionIdentityMock,
}));

vi.mock("@/lib/api/endpoints/protected/update-profile.server", () => ({
  updateProfile: updateProfileMock,
  UpdateProfileApiError: class UpdateProfileApiError extends Error {
    constructor(readonly code: string) {
      super(code);
    }
  },
}));

import { updateProfileAction } from "@/features/account/profile/actions/update-profile.action";
import { initialProfileUpdateState } from "@/features/account/profile/profile-state";
import { UpdateProfileApiError } from "@/lib/api/endpoints/protected/update-profile.server";

beforeEach(() => {
  requireSessionMock.mockReset();
  updateProfileMock.mockReset();
  updateSessionIdentityMock.mockReset();

  requireSessionMock.mockResolvedValue({
    expiresAt: new Date(Date.now() + 3600000),
    user: { name: "Current User", email: "current@example.com" },
  });
});

describe("updateProfileAction Server Action", () => {
  it("rejects invalid name without calling endpoint", async () => {
    const formData = new FormData();
    formData.set("field", "name");
    formData.set("name", "A");

    const result = await updateProfileAction(initialProfileUpdateState, formData);
    expect(result).toMatchObject({
      status: "error",
      field: "name",
      message: "Name must be at least 2 characters.",
    });
    expect(updateProfileMock).not.toHaveBeenCalled();
  });

  it("rejects invalid email without calling endpoint", async () => {
    const formData = new FormData();
    formData.set("field", "email");
    formData.set("email", "not-an-email");

    const result = await updateProfileAction(initialProfileUpdateState, formData);
    expect(result).toMatchObject({
      status: "error",
      field: "email",
      message: "Please enter a valid email address.",
    });
    expect(updateProfileMock).not.toHaveBeenCalled();
  });

  it("updates name successfully and refreshes session identity in-place", async () => {
    updateProfileMock.mockResolvedValueOnce({
      user: { name: "New Name", email: "current@example.com" },
    });

    const formData = new FormData();
    formData.set("field", "name");
    formData.set("name", "New Name");

    const result = await updateProfileAction(initialProfileUpdateState, formData);
    expect(result).toMatchObject({
      status: "success",
      field: "name",
      message: "Your name has been updated successfully.",
      updatedValue: "New Name",
    });
    expect(updateProfileMock).toHaveBeenCalledWith({ name: "New Name" });
    expect(updateSessionIdentityMock).toHaveBeenCalledWith({
      name: "New Name",
      email: "current@example.com",
    });
  });

  it("updates email successfully and refreshes session identity in-place", async () => {
    updateProfileMock.mockResolvedValueOnce({
      user: { name: "Current User", email: "newemail@example.com" },
    });

    const formData = new FormData();
    formData.set("field", "email");
    formData.set("email", "newemail@example.com");

    const result = await updateProfileAction(initialProfileUpdateState, formData);
    expect(result).toMatchObject({
      status: "success",
      field: "email",
      message: "Your email has been updated successfully.",
      updatedValue: "newemail@example.com",
    });
    expect(updateProfileMock).toHaveBeenCalledWith({ email: "newemail@example.com" });
    expect(updateSessionIdentityMock).toHaveBeenCalledWith({
      name: "Current User",
      email: "newemail@example.com",
    });
  });

  it("updates phone successfully without modifying session identity", async () => {
    updateProfileMock.mockResolvedValueOnce({
      user: { name: "Current User", email: "current@example.com" },
    });

    const formData = new FormData();
    formData.set("field", "phone");
    formData.set("phone", "01012345678");

    const result = await updateProfileAction(initialProfileUpdateState, formData);
    expect(result).toMatchObject({
      status: "success",
      field: "phone",
      message: "Your phone number has been updated successfully.",
      updatedValue: "01012345678",
    });
    expect(updateProfileMock).toHaveBeenCalledWith({ phone: "01012345678" });
    expect(updateSessionIdentityMock).not.toHaveBeenCalled();
  });

  it("maps duplicate email error cleanly", async () => {
    updateProfileMock.mockRejectedValueOnce(new UpdateProfileApiError("duplicate-email"));

    const formData = new FormData();
    formData.set("field", "email");
    formData.set("email", "existing@example.com");

    const result = await updateProfileAction(initialProfileUpdateState, formData);
    expect(result).toMatchObject({
      status: "error",
      field: "email",
      message: "An account with this email already exists.",
    });
  });
});
