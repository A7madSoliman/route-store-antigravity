// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

// Mock the transport layer
const { post, get } = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));

vi.mock("@/lib/api/transport/public-request.server", () => ({
  publicPostJson: post,
  publicGetJson: get,
  publicPutJson: post,
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPostJson: post,
  protectedGetJson: get,
  protectedPutJson: post,
  protectedDeleteJson: post,
}));

// Mock Cookies
const { values, cookiesMock } = vi.hoisted(() => {
  const values = new Map<string, string>();
  const cookieStore = {
    get: vi.fn((name: string) => {
      const value = values.get(name);
      return value === undefined ? undefined : { name, value };
    }),
    set: vi.fn((name: string, value: string, options?: unknown) => {
      values.set(name, value);
      return options;
    }),
    delete: vi.fn((name: string) => values.delete(name)),
  };
  return { values, cookiesMock: vi.fn(async () => cookieStore) };
});
vi.mock("next/headers", () => ({ cookies: cookiesMock }));

vi.mock("@/lib/env/server", () => ({
  getServerEnvironment: vi.fn(() => ({
    ecommerceApiBaseUrl: "https://ecommerce.routemisr.com/api/v1",
    appOrigin: "http://localhost:3000",
  })),
  getSessionEnvironment: vi.fn(() => ({
    sessionEncryptionKey: "A".repeat(43),
  })),
  EnvironmentValidationError: class EnvironmentValidationError extends Error {},
}));

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  notFound: vi.fn(),
}));

import { signUpAction } from "@/features/auth/actions/sign-up.action";
import { initialSignUpState } from "@/features/auth/sign-up-state";
import { signInAction } from "@/features/auth/actions/sign-in.action";
import { initialSignInState } from "@/features/auth/sign-in-state";
import { forgotPasswordAction } from "@/features/auth/actions/forgot-password.action";
import { initialForgotPasswordState } from "@/features/auth/forgot-password-state";
import { initialVerifyResetCodeState, verifyResetCodeAction } from "@/features/auth/actions/verify-reset-code.action";
import { initialResetPasswordState, resetPasswordAction } from "@/features/auth/actions/reset-password.action";
import { signOutAction } from "@/features/auth/actions/sign-out.action";

import signupFixture from "../fixtures/api/signup.success.json";
import signinFixture from "../fixtures/api/signin.success.json";
import forgotPasswordFixture from "../fixtures/api/forgot-password.success.json";
import verifyResetCodeFixture from "../fixtures/api/verify-reset-code.success.json";
import resetPasswordFixture from "../fixtures/api/reset-password.success.json";
import { getSession } from "@/lib/auth/session.server";

const key = "A".repeat(43);
const nowEpoch = Math.floor(Date.now() / 1_000) + 3_600;

function fixtureToken(): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ fixture: true })}.${encode({ exp: nowEpoch })}.fixture-signature`;
}

beforeEach(() => {
  values.clear();
  vi.stubEnv("ECOMMERCE_API_BASE_URL", "https://ecommerce.routemisr.com/api/v1");
  vi.stubEnv("SESSION_ENCRYPTION_KEY", key);
  vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
  post.mockReset();
  get.mockReset();
  redirectMock.mockReset();
});

describe("Auth Lifecycle and Recovery Flow Integration", () => {
  it("executes the full sign up, sign out, sign in cycle", async () => {
    // 1. Sign Up
    post.mockResolvedValueOnce({ status: 201, body: { ...signupFixture, token: fixtureToken() } });
    const signupData = new FormData();
    signupData.set("name", "Test User");
    signupData.set("email", "test@example.com");
    signupData.set("password", "Pass1234");
    signupData.set("rePassword", "Pass1234");
    signupData.set("phone", "01000000000");
    
    await signUpAction(initialSignUpState, signupData);
    
    expect(post).toHaveBeenCalledWith(["auth", "signup"], {
      name: "Test User",
      email: "test@example.com",
      password: "Pass1234",
      rePassword: "Pass1234",
      phone: "01000000000",
    });
    
    // Cookie should be set
    const sessionCookie = values.get("route-store-session");
    expect(sessionCookie).toBeDefined();
    
    const session = await getSession();
    expect(session?.user.email).toBe("jane.doe@example.com");
    
    // 2. Sign Out
    await signOutAction();
    expect(values.get("route-store-session")).toBe(""); // cleared
    
    // 3. Sign In
    post.mockResolvedValueOnce({ status: 200, body: { ...signinFixture, token: fixtureToken() } });
    const signinData = new FormData();
    signinData.set("email", "jane.doe@example.com");
    signinData.set("password", "Pass1234");
    signinData.set("returnTo", "/account/profile");
    
    await signInAction(initialSignInState, signinData);
    
    expect(post).toHaveBeenCalledWith(["auth", "signin"], {
      email: "jane.doe@example.com",
      password: "Pass1234",
    });
    
    // Cookie should be set again
    expect(values.get("route-store-session")).toBeDefined();
    expect(redirectMock).toHaveBeenCalledWith("/account/profile");
  });

  it("executes password recovery flow safely", async () => {
    // 1. Forgot Password
    post.mockResolvedValueOnce({ status: 200, body: forgotPasswordFixture });
    const forgotData = new FormData();
    forgotData.set("email", "jane.doe@example.com");
    const forgotResult = await forgotPasswordAction(initialForgotPasswordState, forgotData);
    expect(forgotResult.status).toBe("success");

    // 2. Verify Code
    post.mockResolvedValueOnce({ status: 200, body: verifyResetCodeFixture });
    const verifyData = new FormData();
    verifyData.set("resetCode", "123456");
    const verifyResult = await verifyResetCodeAction(initialVerifyResetCodeState, verifyData);
    expect(verifyResult.status).toBe("success");

    // 3. Reset Password
    post.mockResolvedValueOnce({ status: 200, body: resetPasswordFixture });
    const resetData = new FormData();
    resetData.set("email", "jane.doe@example.com");
    resetData.set("newPassword", "NewPass123");
    resetData.set("rePassword", "NewPass123");
    const resetResult = await resetPasswordAction(initialResetPasswordState, resetData);
    expect(resetResult.status).toBe("success");
    
    // Ensure passwords aren't leaked in state if something fails
    post.mockRejectedValueOnce({ status: 400, body: null });
    const failedResetData = new FormData();
    failedResetData.set("email", "jane.doe@example.com");
    failedResetData.set("newPassword", "Secret1234!");
    failedResetData.set("rePassword", "Secret1234!");
    const result = await resetPasswordAction(initialResetPasswordState, failedResetData);
    expect(result.status).toBe("error");
    expect(JSON.stringify(result)).not.toContain("Secret1234!");
  });
});
