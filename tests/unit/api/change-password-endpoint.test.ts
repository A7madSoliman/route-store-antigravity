// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedPutJsonMock } = vi.hoisted(() => ({
  protectedPutJsonMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPutJson: protectedPutJsonMock,
}));

import { changePassword } from "@/lib/api/endpoints/protected/change-password.server";

beforeEach(() => {
  protectedPutJsonMock.mockReset();
});

describe("changePassword endpoint adapter", () => {
  it("serializes password change payload and returns user identity plus rotated token", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 200,
      body: {
        message: "success",
        user: {
          name: "Test User",
          email: "test@example.com",
          role: "user",
        },
        token: "new-rotated-token-12345",
      },
    });

    const result = await changePassword({
      currentPassword: "old-password",
      password: "new-password-123",
      rePassword: "new-password-123",
    });

    expect(protectedPutJsonMock).toHaveBeenCalledWith(
      ["users", "changeMyPassword"],
      {
        currentPassword: "old-password",
        password: "new-password-123",
        rePassword: "new-password-123",
      },
    );
    expect(result).toEqual({
      user: {
        name: "Test User",
        email: "test@example.com",
      },
      token: "new-rotated-token-12345",
    });
  });

  it("rejects empty or whitespace inputs without calling transport", async () => {
    await expect(
      changePassword({
        currentPassword: "",
        password: "new-password",
        rePassword: "new-password",
      }),
    ).rejects.toMatchObject({
      code: "rejected",
    });
    expect(protectedPutJsonMock).not.toHaveBeenCalled();
  });

  it("maps 400 wrong current password error code", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 400,
      body: {
        message: "fail",
        errors: {
          value: "wrong-pass",
          msg: "incorrect current password",
          param: "currentPassword",
          location: "body",
        },
      },
    });

    await expect(
      changePassword({
        currentPassword: "wrong-pass",
        password: "new-password",
        rePassword: "new-password",
      }),
    ).rejects.toMatchObject({
      code: "wrong-current-password",
    });
  });

  it("maps 400 generic error code to rejected", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 400,
      body: {
        message: "fail",
        errors: {
          msg: "password confirmation does not match",
        },
      },
    });

    await expect(
      changePassword({
        currentPassword: "correct-pass",
        password: "new-password",
        rePassword: "mismatched-pass",
      }),
    ).rejects.toMatchObject({
      code: "rejected",
    });
  });

  it("maps 401 unauthorized error code", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "Invalid Token. please login again" },
    });

    await expect(
      changePassword({
        currentPassword: "old-password",
        password: "new-password",
        rePassword: "new-password",
      }),
    ).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps non-200 non-40x status to upstream-failure", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 500,
      body: { message: "Internal server error" },
    });

    await expect(
      changePassword({
        currentPassword: "old-password",
        password: "new-password",
        rePassword: "new-password",
      }),
    ).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });

  it("maps malformed 200 response missing token to invalid-response", async () => {
    protectedPutJsonMock.mockResolvedValueOnce({
      status: 200,
      body: {
        message: "success",
        user: {
          name: "Test User",
          email: "test@example.com",
        },
        // missing token
      },
    });

    await expect(
      changePassword({
        currentPassword: "old-password",
        password: "new-password",
        rePassword: "new-password",
      }),
    ).rejects.toMatchObject({
      code: "invalid-response",
    });
  });
});
