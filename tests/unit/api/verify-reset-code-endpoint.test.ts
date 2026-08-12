// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("@/lib/api/transport/public-request.server", () => ({
  publicPostJson: post,
}));

import { PublicApiError } from "@/lib/api/errors.server";
import {
  verifyResetCode,
  VerifyResetCodeApiError,
} from "@/lib/api/endpoints/public/verify-reset-code.server";
import { verifyResetCodeResponseSchema } from "@/lib/api/schemas/verify-reset-code-response.schema.server";

beforeEach(() => post.mockReset());

describe("verify-reset-code endpoint", () => {
  it("sends the exact code-only request and returns a narrow success", async () => {
    post.mockResolvedValue({
      status: 200,
      body: { status: "verified", ignored: "extra" },
    });

    await expect(verifyResetCode({ resetCode: "abc123456789" })).resolves.toBe("verified");
    expect(post).toHaveBeenCalledWith(["auth", "verifyResetCode"], {
      resetCode: "abc123456789",
    });
    expect(verifyResetCodeResponseSchema.parse({ status: "verified", ignored: "extra" })).toEqual({
      status: "verified",
    });
  });

  it.each([404, 409, 422, 429, 500, 503])(
    "maps HTTP %s to a generic safe failure without status semantics",
    async (status) => {
      post.mockResolvedValueOnce({ status, body: { status: "provider status" } });
      await expect(verifyResetCode({ resetCode: "abc123456789" })).rejects.toBeInstanceOf(VerifyResetCodeApiError);
    },
  );

  it("maps unavailable, invalid schema, invalid JSON, and unexpected 2xx safely", async () => {
    post.mockRejectedValueOnce(new PublicApiError("unavailable"));
    await expect(verifyResetCode({ resetCode: "abc123456789" })).rejects.toBeInstanceOf(VerifyResetCodeApiError);

    post.mockRejectedValueOnce(new PublicApiError("invalid-response", 200));
    await expect(verifyResetCode({ resetCode: "abc123456789" })).rejects.toBeInstanceOf(VerifyResetCodeApiError);

    post.mockResolvedValueOnce({ status: 200, body: { status: 1 } });
    await expect(verifyResetCode({ resetCode: "abc123456789" })).rejects.toBeInstanceOf(VerifyResetCodeApiError);

    post.mockResolvedValueOnce({ status: 201, body: { status: "verified" } });
    await expect(verifyResetCode({ resetCode: "abc123456789" })).rejects.toBeInstanceOf(VerifyResetCodeApiError);
  });

  it("never exposes provider content", async () => {
    post.mockResolvedValue({
      status: 200,
      body: { status: 42, message: "provider reset-code details" },
    });

    await expect(verifyResetCode({ resetCode: "abc123456789" })).rejects.toSatisfy((error: unknown) => {
      return error instanceof VerifyResetCodeApiError && !error.message.includes("provider reset-code details");
    });
  });
});
