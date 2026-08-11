// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/session.server", () => ({ getSessionToken: vi.fn() }));

import { SessionRequiredError } from "@/lib/auth/require-session.server";
import { getSessionToken } from "@/lib/auth/session.server";
import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedGet } from "@/lib/api/transport/protected-request.server";

const fetchMock = vi.fn();
const tokenMock = vi.mocked(getSessionToken);

beforeEach(() => {
  vi.stubEnv("ECOMMERCE_API_BASE_URL", "https://ecommerce.routemisr.com/api/v1");
  vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  tokenMock.mockReset();
  tokenMock.mockResolvedValue("synthetic.token.value");
});

describe("provisional protected GET transport", () => {
  it("constructs the exact provisional token header and safe request", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await expect(protectedGet(["wishlist", "id/with space"], new URLSearchParams([["page", "2"]]))).resolves.toEqual({ ok: true });

    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("https://ecommerce.routemisr.com/api/v1/wishlist/id%2Fwith%20space?page=2");
    expect(init).toMatchObject({
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      cache: "no-store",
    });
    expect(init).not.toHaveProperty("body");
    expect(init).toHaveProperty("headers", {
      Accept: "application/json",
      token: "synthetic.token.value",
    });
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
    expect(AbortSignal.timeout).toBeDefined();
  });

  it("does not request upstream without a local session", async () => {
    tokenMock.mockResolvedValue(null);
    await expect(protectedGet(["wishlist"])).rejects.toBeInstanceOf(SessionRequiredError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("redacts upstream failures and malformed JSON", async () => {
    fetchMock.mockResolvedValue(new Response("private token body", { status: 401 }));
    await expect(protectedGet(["wishlist"])).rejects.toMatchObject({
      code: "upstream-failure",
      status: 401,
    });
    fetchMock.mockResolvedValue(new Response("private response", { status: 200 }));
    await expect(protectedGet(["wishlist"])).rejects.toBeInstanceOf(ProtectedApiError);
  });
});
