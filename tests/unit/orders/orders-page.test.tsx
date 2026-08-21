import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { requireProtectedRouteMock, getOrdersMock } = vi.hoisted(() => ({
  requireProtectedRouteMock: vi.fn(),
  getOrdersMock: vi.fn(),
}));

vi.mock("@/lib/auth/protected-route.server", () => ({
  requireProtectedRoute: requireProtectedRouteMock,
}));

vi.mock("@/lib/api/endpoints/protected/get-orders.server", () => ({
  getOrders: getOrdersMock,
}));

import OrdersPage from "@/app/(account)/account/orders/page";

afterEach(() => {
  cleanup();
  requireProtectedRouteMock.mockReset();
  getOrdersMock.mockReset();
});

describe("OrdersPage", () => {
  it("renders protected orders list within account shell", async () => {
    requireProtectedRouteMock.mockResolvedValueOnce({
      user: { name: "Ahmed Soliman", email: "ahmed@example.com" },
    });
    getOrdersMock.mockResolvedValueOnce([
      {
        id: "order-1",
        numericId: 101,
        user: "user-1",
        totalOrderPrice: 450,
        paymentMethodType: "cash",
        isPaid: true,
        isDelivered: false,
        cartItems: [
          {
            id: "item-1",
            productId: "prod-1",
            product: {
              id: "prod-1",
              title: "Modern Watch",
              imageUrl: null,
            },
            count: 1,
            price: 450,
          },
        ],
        shippingAddress: {
          details: "123 Nile Street",
          phone: "01012345678",
          city: "Cairo",
        },
        createdAt: "2026-08-21T08:00:00.000Z",
        updatedAt: "2026-08-21T08:00:00.000Z",
      },
    ]);

    const pageElement = await OrdersPage();
    render(pageElement);

    expect(requireProtectedRouteMock).toHaveBeenCalledWith("/account/orders");
    expect(getOrdersMock).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Order History" })).not.toBeNull();
    expect(screen.getByText(/#101/)).not.toBeNull();
    expect(screen.getByText("Paid")).not.toBeNull();
    expect(screen.getByText("Modern Watch")).not.toBeNull();
  });
});
