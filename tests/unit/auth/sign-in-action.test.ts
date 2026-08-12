// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { normalize } = vi.hoisted(() => ({ normalize: vi.fn((value: unknown) => typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/") }));
vi.mock("@/lib/auth/return-to.server", () => ({ normalizeReturnTo: normalize }));
vi.mock("@/lib/api/endpoints/public/signin.server", () => ({ signIn: vi.fn(), SigninApiError: class SigninApiError extends Error { constructor(readonly code: string) { super(code); } } }));
vi.mock("@/lib/auth/session.server", () => ({ setSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth/session-codec.server", () => ({ SessionValidationError: class SessionValidationError extends Error {} }));
vi.mock("@/lib/env/server", () => ({ EnvironmentValidationError: class EnvironmentValidationError extends Error {} }));
import { signInAction } from "@/features/auth/actions/sign-in.action";
import { signIn, SigninApiError } from "@/lib/api/endpoints/public/signin.server";
describe("signin action", () => { it("rejects whitespace without endpoint", async () => { const data = new FormData(); data.set("email", " "); data.set("password", " "); await expect(signInAction({ status: "idle", email: "" }, data)).resolves.toMatchObject({ status: "error" }); expect(signIn).not.toHaveBeenCalled(); }); it("maps 401 generically and redacts password", async () => { vi.mocked(signIn).mockRejectedValueOnce(new SigninApiError("invalid-credentials")); const data = new FormData(); data.set("email", "e@example.test"); data.set("password", "bad"); const result = await signInAction({ status: "idle", email: "" }, data); expect(result).toEqual({ status: "error", email: "e@example.test", message: "Email or password is incorrect." }); expect(JSON.stringify(result)).not.toContain("bad"); }); it("revalidates returnTo", async () => { vi.mocked(signIn).mockRejectedValueOnce(new SigninApiError("invalid-credentials")); const data = new FormData(); data.set("email", "e"); data.set("password", "p"); data.set("returnTo", "//evil.example"); await signInAction({ status: "idle", email: "" }, data); expect(normalize).toHaveBeenLastCalledWith("//evil.example"); }); });
