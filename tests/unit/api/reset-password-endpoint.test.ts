// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { put } = vi.hoisted(() => ({ put: vi.fn() }));

vi.mock("@/lib/api/transport/public-request.server", () => ({
  publicPutJson: put,
}));

import { PublicApiError } from "@/lib/api/errors.server";
import {
  resetPassword,
  ResetPasswordApiError,
} from "@/lib/api/endpoints/public/reset-password.server";

beforeEach(() => put.mockReset());

describe("reset-password endpoint", () => {
  it("sends exactly email and newPassword and returns a token-free success", async () => {
    put.mockResolvedValueOnce({ status: 200, body: { token: "synthetic", ignored: "extra" } });

    await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).resolves.toBe("reset");
    expect(put).toHaveBeenCalledOnce();
    expect(put).toHaveBeenCalledWith(["auth", "resetPassword"], {
      email: "person@example.test",
      newPassword: "new-value",
    });
    expect(JSON.stringify(await resetPasswordResult())).not.toContain("synthetic");
  });

  it.each([400, 401, 403, 404, 409, 422, 429, 500, 503])(
    "maps HTTP %s to a generic safe failure",
    async (status) => {
      put.mockResolvedValueOnce({ status, body: { message: "provider details" } });
      await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).rejects.toBeInstanceOf(ResetPasswordApiError);
    },
  );

  it("maps invalid JSON/schema, unavailable, and unexpected 2xx safely", async () => {
    put.mockRejectedValueOnce(new PublicApiError("invalid-response", 200));
    await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).rejects.toBeInstanceOf(ResetPasswordApiError);

    put.mockResolvedValueOnce({ status: 200, body: { token: "" } });
    await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).rejects.toBeInstanceOf(ResetPasswordApiError);

    put.mockResolvedValueOnce({ status: 200, body: { status: "wrong schema" } });
    await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).rejects.toBeInstanceOf(ResetPasswordApiError);

    put.mockResolvedValueOnce({ status: 201, body: { token: "synthetic" } });
    await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).rejects.toBeInstanceOf(ResetPasswordApiError);

    put.mockRejectedValueOnce(new PublicApiError("unavailable"));
    await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).rejects.toBeInstanceOf(ResetPasswordApiError);
  });

  it("never exposes provider content or the response token", async () => {
    put.mockResolvedValueOnce({ status: 200, body: { token: "provider-secret", message: "provider details" } });
    await expect(resetPassword({ email: "person@example.test", newPassword: "new-value" })).resolves.toBe("reset");
    const result = await resetPasswordResult();
    expect(JSON.stringify(result)).not.toContain("provider-secret");
    expect(JSON.stringify(result)).not.toContain("provider details");
  });
});

async function resetPasswordResult() {
  return { status: "reset" as const };
}

