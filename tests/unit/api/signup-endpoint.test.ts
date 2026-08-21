// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import signupFixture from "../../fixtures/api/signup.success.json";
import { PublicApiError } from "@/lib/api/errors.server";

vi.mock("server-only", () => ({}));
const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/api/transport/public-request.server", () => ({ publicPostJson: post }));
import { signUp, SignupApiError } from "@/lib/api/endpoints/public/signup.server";

beforeEach(() => post.mockReset());

describe("signup endpoint", () => {
  const validInput = { name: "Jane Doe", email: "jane.doe@example.com", password: "Password123", rePassword: "Password123", phone: "01012345678" };

  it("sends exactly the five approved fields and maps valid payload correctly using fixture", async () => {
    post.mockResolvedValue({ status: 201, body: signupFixture });
    const result = await signUp(validInput);
    expect(result.token).toBe(signupFixture.token);
    expect(result.user).toEqual({
      name: signupFixture.user.name,
      email: signupFixture.user.email,
    });
    expect(post).toHaveBeenCalledWith(["auth", "signup"], validInput);
  });

  it("throws SignupApiError(invalid-response) on malformed/missing fields in success payload", async () => {
    post.mockResolvedValue({ status: 201, body: { status: "success" } }); // token missing
    await expect(signUp(validInput)).rejects.toMatchObject({ code: "invalid-response" });
  });

  it("throws SignupApiError(duplicate) on 409 status (already exists)", async () => {
    post.mockRejectedValueOnce(new PublicApiError("invalid-request", 409));
    const promise = signUp(validInput);
    await expect(promise).rejects.toBeInstanceOf(SignupApiError);
    await expect(promise).rejects.toMatchObject({ code: "duplicate" });
  });

  it("throws SignupApiError(rejected) on 400 status (validation error)", async () => {
    post.mockRejectedValueOnce(new PublicApiError("invalid-request", 400));
    const promise = signUp(validInput);
    await expect(promise).rejects.toBeInstanceOf(SignupApiError);
    await expect(promise).rejects.toMatchObject({ code: "rejected" });
  });

  it("throws SignupApiError(unavailable) on network connection failure", async () => {
    post.mockRejectedValueOnce(new PublicApiError("unavailable"));
    const promise = signUp(validInput);
    await expect(promise).rejects.toBeInstanceOf(SignupApiError);
    await expect(promise).rejects.toMatchObject({ code: "unavailable" });
  });

  it("throws SignupApiError(upstream-failure) on server 500 errors", async () => {
    post.mockRejectedValueOnce(new PublicApiError("upstream-failure", 500));
    const promise = signUp(validInput);
    await expect(promise).rejects.toBeInstanceOf(SignupApiError);
    await expect(promise).rejects.toMatchObject({ code: "upstream-failure" });
  });

  it("ensures zero leakage of sensitive password/token values in error throws", async () => {
    post.mockRejectedValueOnce(new PublicApiError("invalid-request", 400));
    const promise = signUp(validInput);
    await expect(promise).rejects.toBeInstanceOf(SignupApiError);
    await expect(promise).rejects.toMatchObject({ code: "rejected" });

    try {
      await promise;
    } catch (err) {
      expect(JSON.stringify(err)).not.toContain("Password123");
    }
  });
});
