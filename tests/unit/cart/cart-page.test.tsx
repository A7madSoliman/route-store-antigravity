// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { requireProtectedRouteMock, getCartMock } = vi.hoisted(() => ({
  requireProtectedRouteMock: vi.fn(),
  getCartMock: vi.fn(),
}));

vi.mock("@/lib/auth/protected-route.server", () => ({
  requireProtectedRoute: requireProtectedRouteMock,
}));

vi.mock("@/lib/api/endpoints/protected/cart.server", () => ({
  getCart: getCartMock,
}));

import CartPage from "@/app/(shop)/cart/page";

describe("CartPage Server Component", () => {
  it("protects /cart route and renders cart view with loaded cart", async () => {
    getCartMock.mockResolvedValueOnce({
      id: "cart-1",
      cartOwner: "user-1",
      totalCartPrice: 100,
      numOfCartItems: 1,
      items: [],
    });

    const page = await CartPage();
    expect(requireProtectedRouteMock).toHaveBeenCalledWith("/cart");
    expect(getCartMock).toHaveBeenCalled();
    expect(page).toBeTruthy();
  });
});
