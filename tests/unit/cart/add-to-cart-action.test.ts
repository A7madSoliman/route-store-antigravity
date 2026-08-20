// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { addToCartMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  addToCartMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/add-to-cart.server", () => ({
  addToCart: addToCartMock,
  AddToCartApiError: class AddToCartApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "AddToCartApiError";
    }
  },
}));

vi.mock("@/lib/auth/require-session.server", () => ({
  requireSession: requireSessionMock,
  SessionRequiredError: class SessionRequiredError extends Error {
    constructor() {
      super();
      this.name = "SessionRequiredError";
    }
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

import { addToCartAction } from "@/features/cart/actions/add-to-cart.action";
import { AddToCartApiError } from "@/lib/api/endpoints/protected/add-to-cart.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  addToCartMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("addToCartAction", () => {
  it("successfully adds product to cart and revalidates /cart", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    addToCartMock.mockResolvedValueOnce({
      message: "Product added successfully to your cart",
      numOfCartItems: 2,
      totalCartPrice: 450,
    });

    const formData = new FormData();
    formData.set("productId", "prod-101");

    const result = await addToCartAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(addToCartMock).toHaveBeenCalledWith({ productId: "prod-101" });
    expect(revalidatePathMock).toHaveBeenCalledWith("/cart");
    expect(result).toEqual({
      status: "success",
      message: "Product added successfully to your cart",
      numOfCartItems: 2,
    });
  });

  it("returns unauthorized status when session is required", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.set("productId", "prod-101");

    const result = await addToCartAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to add items to your cart.",
    });
    expect(addToCartMock).not.toHaveBeenCalled();
  });

  it("returns error status on missing productId", async () => {
    const formData = new FormData();
    formData.set("productId", "");

    const result = await addToCartAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "A valid product ID is required.",
    });
    expect(addToCartMock).not.toHaveBeenCalled();
  });

  it("maps not-found error from adapter safely", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Test User", email: "test@example.com" },
    });
    addToCartMock.mockRejectedValueOnce(new AddToCartApiError("not-found"));

    const formData = new FormData();
    formData.set("productId", "prod-999");

    const result = await addToCartAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Product not found.",
    });
  });
});
