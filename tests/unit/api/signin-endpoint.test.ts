// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import signinFixture from "../../fixtures/api/signin.success.json";
import { PublicApiError } from "@/lib/api/errors.server";

vi.mock("server-only", () => ({}));
const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/api/transport/public-request.server", () => ({ publicPostJson: post }));
import { signIn, SigninApiError } from "@/lib/api/endpoints/public/signin.server";

beforeEach(() => post.mockReset());

describe("signin endpoint", () => {
  const validInput = { email: "jane.doe@example.com", password: "Password123" };

  it("sends exact fields and maps valid payload correctly using fixture", async () => {
    post.mockResolvedValue({ status: 200, body: signinFixture });
    const result = await signIn(validInput);
    expect(result.token).toBe(signinFixture.token);
    expect(result.user).toEqual({
      name: signinFixture.user.name,
      email: signinFixture.user.email,
    });
    expect(post).toHaveBeenCalledWith(["auth", "signin"], validInput);
  });

  it("rejects empty token in success payload", async () => {
    post.mockResolvedValue({ status: 200, body: { token: "" } });
    await expect(signIn(validInput)).rejects.toMatchObject({ code: "invalid-response" });
  });

  it("throws SigninApiError(invalid-credentials) on 401 status", async () => {
    post.mockResolvedValue({ status: 401, body: null });
    await expect(signIn(validInput)).rejects.toMatchObject({ code: "invalid-credentials" });
  });

  it("throws SigninApiError(rejected) on 400 status", async () => {
    post.mockResolvedValue({ status: 400, body: null });
    await expect(signIn(validInput)).rejects.toMatchObject({ code: "rejected" });
  });

  it("throws SigninApiError(upstream-failure) on 500 status", async () => {
    post.mockResolvedValue({ status: 500, body: null });
    await expect(signIn(validInput)).rejects.toMatchObject({ code: "upstream-failure" });
  });

  it("throws SigninApiError(unavailable) on network connection failure", async () => {
    post.mockRejectedValueOnce(new PublicApiError("unavailable"));
    const promise = signIn(validInput);
    await expect(promise).rejects.toBeInstanceOf(SigninApiError);
    await expect(promise).rejects.toMatchObject({ code: "unavailable" });
  });

  it("ensures zero leakage of sensitive password/token values in error throws", async () => {
    post.mockRejectedValueOnce(new PublicApiError("invalid-request", 401));
    const promise = signIn(validInput);
    await expect(promise).rejects.toBeInstanceOf(SigninApiError);
    await expect(promise).rejects.toMatchObject({ code: "invalid-credentials" });

    try {
      await promise;
    } catch (err) {
      expect(JSON.stringify(err)).not.toContain("Password123");
    }
  });
});
