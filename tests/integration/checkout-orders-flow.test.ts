// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { post, get } = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPostJson: post,
  protectedGet: get,
}));

vi.mock("@/lib/api/transport/public-request.server", () => ({
  publicPostJson: post,
  publicGetJson: get,
}));

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

const { cookiesMock } = vi.hoisted(() => {
  const values = new Map<string, string>();
  const store = {
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
  return { cookiesMock: vi.fn(async () => store) };
});
vi.mock("next/headers", () => ({ cookies: cookiesMock }));

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

const { revalidatePathMock } = vi.hoisted(() => ({ revalidatePathMock: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));

import { submitCheckoutAction } from "@/features/checkout/actions/checkout.action";
import { getOrders } from "@/lib/api/endpoints/protected/get-orders.server";
import { setSession } from "@/lib/auth/session.server";

import createCashOrderFixture from "../fixtures/api/create-cash-order.success.json";
import createCheckoutSessionFixture from "../fixtures/api/create-checkout-session.success.json";
import getOrdersFixture from "../fixtures/api/get-orders.success.json";

const nowEpoch = Math.floor(Date.now() / 1_000) + 3_600;

function fixtureToken(userId = "user_12345"): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ fixture: true })}.${encode({ id: userId, exp: nowEpoch })}.fixture-signature`;
}

let validToken: string;

beforeEach(async () => {
  post.mockReset();
  get.mockReset();
  revalidatePathMock.mockReset();
  redirectMock.mockReset();

  validToken = fixtureToken("user_12345");
  await setSession(validToken, { name: "Test User", email: "test@example.com" });
});

describe("Checkout and Orders Flow Integration", () => {
  it("creates cash order and redirects to orders page", async () => {
    post.mockResolvedValueOnce({ status: 201, body: createCashOrderFixture });
    const formData = new FormData();
    formData.set("cartId", "6407cf6f515bdcf347c09f17");
    formData.set("paymentMethod", "cash");
    formData.set("details", "123 Main St");
    formData.set("phone", "01000000000");
    formData.set("city", "Cairo");

    await submitCheckoutAction({ status: "idle" }, formData);

    expect(post).toHaveBeenCalledWith(
      ["orders", "6407cf6f515bdcf347c09f17"],
      {
        shippingAddress: {
          details: "123 Main St",
          phone: "01000000000",
          city: "Cairo",
        },
      },
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/cart");
    expect(revalidatePathMock).toHaveBeenCalledWith("/account/orders");
    expect(redirectMock).toHaveBeenCalledWith("/account/orders?status=success");
  });

  it("initiates online Stripe checkout and redirects to Stripe session URL", async () => {
    post.mockResolvedValueOnce({ status: 200, body: createCheckoutSessionFixture });
    const formData = new FormData();
    formData.set("cartId", "6407cf6f515bdcf347c09f17");
    formData.set("paymentMethod", "card");
    formData.set("details", "123 Main St");
    formData.set("phone", "01000000000");
    formData.set("city", "Cairo");

    await submitCheckoutAction({ status: "idle" }, formData);

    expect(post).toHaveBeenCalledWith(
      ["orders", "checkout-session", "6407cf6f515bdcf347c09f17"],
      {
        shippingAddress: {
          details: "123 Main St",
          phone: "01000000000",
          city: "Cairo",
        },
      },
      expect.any(URLSearchParams),
    );
    expect(redirectMock).toHaveBeenCalledWith(createCheckoutSessionFixture.session.url);
  });

  it("loads customer orders securely via verified server session (ORDER-001 IDOR prevention)", async () => {
    get.mockResolvedValueOnce(getOrdersFixture);

    const orders = await getOrders();

    // Verify endpoint called with strictly token-derived userId
    expect(get).toHaveBeenCalledWith(["orders", "user", "user_12345"]);
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].id).toBe(getOrdersFixture[0]._id);
  });
});
