import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { normalize } = vi.hoisted(() => ({ normalize: vi.fn((value: unknown) => typeof value === "string" ? value : "/") }));
vi.mock("@/lib/auth/return-to.server", () => ({ normalizeReturnTo: normalize }));
import SignUpPage from "@/app/(auth)/sign-up/page";

describe("signup page", () => {
  it("is an async server page", () => {
    expect(SignUpPage.constructor.name).toBe("AsyncFunction");
  });

  it("only forwards a scalar returnTo candidate", async () => {
    await SignUpPage({ searchParams: Promise.resolve({ returnTo: ["/products", "/brands"] }) });
    expect(normalize).toHaveBeenCalledWith(undefined);
    await SignUpPage({ searchParams: Promise.resolve({ returnTo: "/products" }) });
    expect(normalize).toHaveBeenLastCalledWith("/products");
  });
});
