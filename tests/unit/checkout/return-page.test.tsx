import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { requireProtectedRouteMock, notFoundMock } = vi.hoisted(() => ({
  requireProtectedRouteMock: vi.fn(),
  notFoundMock: vi.fn(),
}));

vi.mock("@/lib/auth/protected-route.server", () => ({
  requireProtectedRoute: requireProtectedRouteMock,
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import OnlineReturnPage from "@/app/(shop)/checkout/online/return/[status]/page";

afterEach(() => {
  cleanup();
  requireProtectedRouteMock.mockReset();
  notFoundMock.mockReset();
});

describe("OnlineReturnPage", () => {
  it("renders success state for status = allorders", async () => {
    requireProtectedRouteMock.mockResolvedValueOnce({
      user: { name: "Ahmed Soliman", email: "ahmed@example.com" },
      expiresAt: new Date(),
    });

    const pageElement = await OnlineReturnPage({
      params: Promise.resolve({ status: "allorders" }),
    });
    render(pageElement);

    expect(requireProtectedRouteMock).toHaveBeenCalledWith("/checkout/online/return/allorders");
    expect(screen.getByRole("heading", { name: "Payment Successful!" })).not.toBeNull();
    const ordersLink = screen.getByRole("link", { name: "View My Orders" });
    expect(ordersLink.getAttribute("href")).toBe("/account/orders");
  });

  it("renders cancelled/failed state for status = cart", async () => {
    requireProtectedRouteMock.mockResolvedValueOnce({
      user: { name: "Ahmed Soliman", email: "ahmed@example.com" },
      expiresAt: new Date(),
    });

    const pageElement = await OnlineReturnPage({
      params: Promise.resolve({ status: "cart" }),
    });
    render(pageElement);

    expect(requireProtectedRouteMock).toHaveBeenCalledWith("/checkout/online/return/cart");
    expect(screen.getByRole("heading", { name: "Payment Cancelled" })).not.toBeNull();
    const cartLink = screen.getByRole("link", { name: "Return to Cart" });
    expect(cartLink.getAttribute("href")).toBe("/cart");
  });

  it("triggers notFound for invalid status values", async () => {
    await OnlineReturnPage({
      params: Promise.resolve({ status: "invalid" }),
    });

    expect(notFoundMock).toHaveBeenCalled();
  });
});
