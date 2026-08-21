// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("@/lib/api/transport/public-request.server", () => ({
  publicPostJson: post,
}));

import { PublicApiError } from "@/lib/api/errors.server";
import {
  ForgotPasswordApiError,
  mapForgotPasswordTransportFailure,
  requestPasswordReset,
} from "@/lib/api/endpoints/public/forgot-password.server";
import { forgotPasswordResponseSchema } from "@/lib/api/schemas/forgot-password-response.schema.server";

import forgotPasswordFixture from "../../fixtures/api/forgot-password.success.json";

beforeEach(() => post.mockReset());

describe("forgot-password endpoint", () => {
  it("sends the exact approved request and returns only confirmation", async () => {
    post.mockResolvedValue({
      status: 200,
      body: forgotPasswordFixture,
    });

    await expect(requestPasswordReset({ email: "person@example.test" })).resolves.toBe("confirmation");
    expect(post).toHaveBeenCalledWith(["auth", "forgotPasswords"], {
      email: "person@example.test",
    });
    expect(forgotPasswordResponseSchema.parse(forgotPasswordFixture)).toEqual({
      statusMsg: forgotPasswordFixture.statusMsg,
      message: forgotPasswordFixture.message,
    });
  });

  it("uses the privacy-preserving confirmation result for an observed 404", async () => {
    expect(
      mapForgotPasswordTransportFailure(new PublicApiError("upstream-failure", 404)),
    ).toBe("confirmation");
  });

  it.each([400, 401, 403, 409, 422, 429])("treats unobserved client status %s as a safe error", (status) => {
    expect(() => mapForgotPasswordTransportFailure(new PublicApiError("upstream-failure", status))).toThrowError(
      expect.objectContaining({
      code: "rejected",
      }),
    );
  });

  it.each([500, 503])("treats server status %s as a safe error", (status) => {
    expect(() => mapForgotPasswordTransportFailure(new PublicApiError("upstream-failure", status))).toThrowError(
      expect.objectContaining({
      code: "upstream-failure",
      }),
    );
  });

  it("maps unavailable, invalid JSON, invalid schema, and unexpected success status safely", async () => {
    expect(() => mapForgotPasswordTransportFailure(new PublicApiError("unavailable"))).toThrowError(
      expect.objectContaining({ code: "unavailable" }),
    );

    expect(() => mapForgotPasswordTransportFailure(new PublicApiError("invalid-response", 200))).toThrowError(
      expect.objectContaining({ code: "invalid-response" }),
    );

    post.mockResolvedValueOnce({ status: 200, body: { statusMsg: 1, message: "provider message" } });
    await expect(requestPasswordReset({ email: "person@example.test" })).rejects.toMatchObject({ code: "invalid-response" });

    post.mockResolvedValueOnce({ status: 201, body: { statusMsg: "accepted", message: "provider message" } });
    await expect(requestPasswordReset({ email: "person@example.test" })).rejects.toMatchObject({ code: "upstream-failure" });
  });

  it("never exposes provider content through its error", async () => {
    expect(() => mapForgotPasswordTransportFailure(new Error("provider response containing private content"))).toThrowError(
      expect.objectContaining({ name: "ForgotPasswordApiError" }),
    );

    try {
      mapForgotPasswordTransportFailure(new Error("provider response containing private content"));
    } catch (error) {
      expect(error).toBeInstanceOf(ForgotPasswordApiError);
      expect((error as Error).message).not.toContain("private content");
    }
  });
});
