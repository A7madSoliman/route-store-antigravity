import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { normalize } = vi.hoisted(() => ({ normalize: vi.fn((value: unknown) => typeof value === "string" ? value : "/") }));
vi.mock("@/lib/auth/return-to.server", () => ({ normalizeReturnTo: normalize }));
import SignInPage from "@/app/(auth)/sign-in/page";
describe("signin page", () => { it("is async and treats arrays as absent", async () => { expect(SignInPage.constructor.name).toBe("AsyncFunction"); await SignInPage({ searchParams: Promise.resolve({ returnTo: ["/products", "/brands"] }) }); expect(normalize).toHaveBeenCalledWith(undefined); }); });
