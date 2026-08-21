// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedPutJsonMock } = vi.hoisted(() => ({
  protectedPutJsonMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPutJson: protectedPutJsonMock,
}));

import { updateProfile } from "@/lib/api/endpoints/protected/update-profile.server";

import updateProfileFixture from "../../fixtures/api/update-profile.success.json";

beforeEach(() => {
  protectedPutJsonMock.mockReset();
});

describe("updateProfile endpoint adapter", () => {
  it("serializes single-field name mutation and returns parsed user identity using fixture", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 200,
      body: updateProfileFixture,
    });

    const result = await updateProfile({ name: "Updated Name" });
    expect(protectedPutJsonMock).toHaveBeenCalledWith(["users", "updateMe"], { name: "Updated Name" });
    expect(result).toEqual({
      user: {
        name: updateProfileFixture.user.name,
        email: updateProfileFixture.user.email,
      },
    });
  });

  it("serializes single-field email mutation and returns parsed user identity", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 200,
      body: {
        message: "success",
        user: {
          name: "Original Name",
          email: "newemail@example.com",
          role: "user",
        },
      },
    });

    const result = await updateProfile({ email: "newemail@example.com" });
    expect(protectedPutJsonMock).toHaveBeenCalledWith(["users", "updateMe"], { email: "newemail@example.com" });
    expect(result).toEqual({
      user: {
        name: "Original Name",
        email: "newemail@example.com",
      },
    });
  });

  it("serializes single-field phone mutation", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 200,
      body: {
        message: "success",
        user: {
          name: "Original Name",
          email: "test@example.com",
          role: "user",
        },
      },
    });

    const result = await updateProfile({ phone: "01012345678" });
    expect(protectedPutJsonMock).toHaveBeenCalledWith(["users", "updateMe"], { phone: "01012345678" });
    expect(result).toEqual({
      user: {
        name: "Original Name",
        email: "test@example.com",
      },
    });
  });

  it("rejects multi-field or invalid payload inputs", async () => {
    // @ts-expect-error Testing runtime payload validation
    await expect(updateProfile({ name: "Name", email: "email@example.com" })).rejects.toMatchObject({
      code: "rejected",
    });
    expect(protectedPutJsonMock).not.toHaveBeenCalled();
  });

  it("maps 400 duplicate email error code", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 400,
      body: {
        message: "fail",
        errors: {
          value: "existing@example.com",
          msg: "Account Already Exists",
          param: "email",
          location: "body",
        },
      },
    });

    await expect(updateProfile({ email: "existing@example.com" })).rejects.toMatchObject({
      code: "duplicate-email",
    });
  });

  it("maps 401 unauthorized error code", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "Invalid Token. please login again" },
    });

    await expect(updateProfile({ name: "Name" })).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps malformed 200 response to invalid-response", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 200,
      body: { message: "success", user: null },
    });

    await expect(updateProfile({ name: "Name" })).rejects.toMatchObject({
      code: "invalid-response",
    });
  });
});
