// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { post, get, put, del } = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPostJson: post,
  protectedGetJson: get,
  protectedPutJson: put,
  protectedDeleteJson: del,
  protectedDelete: del,
}));

vi.mock("@/lib/api/transport/public-request.server", () => ({
  publicPostJson: post,
  publicGetJson: get,
  publicPutJson: put,
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

import { addToWishlistAction } from "@/features/wishlist/actions/add-to-wishlist.action";
import { removeFromWishlistAction } from "@/features/wishlist/actions/remove-from-wishlist.action";
import { addToCartAction } from "@/features/cart/actions/add-to-cart.action";
import { updateCartQuantityAction } from "@/features/cart/actions/update-cart-quantity.action";
import { removeFromCartAction } from "@/features/cart/actions/remove-from-cart.action";
import { clearCartAction } from "@/features/cart/actions/clear-cart.action";
import { addAddressAction } from "@/features/addresses/actions/add-address.action";

import addToWishlistFixture from "../fixtures/api/add-to-wishlist.success.json";
import removeFromWishlistFixture from "../fixtures/api/remove-from-wishlist.success.json";
import addToCartFixture from "../fixtures/api/add-to-cart.success.json";
import updateCartQuantityFixture from "../fixtures/api/update-cart-quantity.success.json";
import removeFromCartFixture from "../fixtures/api/remove-from-cart.success.json";
import clearCartFixture from "../fixtures/api/clear-cart.success.json";
import addAddressFixture from "../fixtures/api/add-address.success.json";

import { setSession } from "@/lib/auth/session.server";

const nowEpoch = Math.floor(Date.now() / 1_000) + 3_600;

function fixtureToken(): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ fixture: true })}.${encode({ exp: nowEpoch })}.fixture-signature`;
}

let validToken: string;

beforeEach(async () => {
  post.mockReset();
  get.mockReset();
  put.mockReset();
  del.mockReset();
  revalidatePathMock.mockReset();
  redirectMock.mockReset();
  
  // Set an active session for protected actions
  validToken = fixtureToken();
  await setSession(validToken, { name: "Test User", email: "test@example.com" });
});

describe("Wishlist, Cart, and Address Flow Integration", () => {
  it("executes wishlist lifecycle successfully", async () => {
    // Add to wishlist
    post.mockResolvedValueOnce({ status: 200, body: addToWishlistFixture });
    const addFormData = new FormData();
    addFormData.set("productId", "prod-123");
    const addResult = await addToWishlistAction({ status: "idle" }, addFormData);
    expect(post).toHaveBeenCalledWith(["wishlist"], { productId: "prod-123" });
    expect(addResult.status).toBe("success");
    expect(revalidatePathMock).toHaveBeenCalledWith("/wishlist");
    
    // Remove from wishlist
    del.mockResolvedValueOnce({ status: 200, body: removeFromWishlistFixture });
    const removeFormData = new FormData();
    removeFormData.set("productId", "prod-123");
    const removeResult = await removeFromWishlistAction({ status: "idle" }, removeFormData);
    expect(del).toHaveBeenCalledWith(["wishlist", "prod-123"]);
    expect(removeResult.status).toBe("success");
  });

  it("executes cart lifecycle successfully", async () => {
    // Add to cart
    post.mockResolvedValueOnce({ status: 200, body: addToCartFixture });
    const addFormData = new FormData();
    addFormData.set("productId", "prod-123");
    const addResult = await addToCartAction({ status: "idle" }, addFormData);
    expect(post).toHaveBeenCalledWith(["cart"], { productId: "prod-123" });
    expect(addResult.status).toBe("success");
    expect(revalidatePathMock).toHaveBeenCalledWith("/cart");

    // Update quantity
    put.mockResolvedValueOnce({ status: 200, body: updateCartQuantityFixture });
    const formData = new FormData();
    formData.set("count", "2");
    formData.set("productId", "prod-123");
    const updateResult = await updateCartQuantityAction({ status: "idle" }, formData);
    expect(put).toHaveBeenCalledWith(["cart", "prod-123"], { count: 2 });
    expect(updateResult.status).toBe("success");

    // Remove from cart
    del.mockResolvedValueOnce({ status: 200, body: removeFromCartFixture });
    const removeFormData = new FormData();
    removeFormData.set("productId", "prod-123");
    const removeResult = await removeFromCartAction({ status: "idle" }, removeFormData);
    expect(del).toHaveBeenCalledWith(["cart", "prod-123"]);
    expect(removeResult.status).toBe("success");
    
    // Clear cart
    del.mockResolvedValueOnce({ status: 200, body: clearCartFixture });
    const clearResult = await clearCartAction({ status: "idle" }, new FormData());
    expect(del).toHaveBeenCalledWith(["cart"]);
    expect(clearResult.status).toBe("success");
  });

  it("manages addresses correctly", async () => {
    post.mockResolvedValueOnce({ status: 200, body: addAddressFixture });
    const formData = new FormData();
    formData.set("name", "Home");
    formData.set("details", "123 Main St");
    formData.set("phone", "01000000000");
    formData.set("city", "Cairo");
    
    await addAddressAction({ status: "idle" }, formData);
    expect(post).toHaveBeenCalledWith(["addresses"], { name: "Home", details: "123 Main St", phone: "01000000000", city: "Cairo" });
    expect(redirectMock).toHaveBeenCalledWith("/account/addresses");
  });
});
