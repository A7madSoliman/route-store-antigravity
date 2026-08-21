import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { OrderList } from "@/features/orders/components/order-list";
import type { Order } from "@/types/order";

afterEach(() => cleanup());

const mockOrder: Order = {
  id: "order-101",
  numericId: 101,
  user: "user-1",
  cartItems: [
    {
      id: "item-1",
      productId: "prod-1",
      product: {
        id: "prod-1",
        title: "Sneakers",
        imageUrl: null,
      },
      count: 1,
      price: 500,
    },
  ],
  totalOrderPrice: 500,
  taxPrice: 0,
  shippingPrice: 0,
  paymentMethodType: "cash",
  isPaid: false,
  isDelivered: false,
  shippingAddress: {
    details: "123 Main St",
    phone: "01000000000",
    city: "Alexandria",
  },
  createdAt: "2026-08-21T09:00:00.000Z",
  updatedAt: "2026-08-21T09:00:00.000Z",
};

describe("OrderList Component", () => {
  it("renders empty state when orders array is empty", () => {
    render(<OrderList orders={[]} />);

    expect(screen.getByRole("heading", { name: "No orders placed yet" })).not.toBeNull();
  });

  it("renders order list header and cards when orders are present", () => {
    render(<OrderList orders={[mockOrder]} />);

    expect(screen.getByRole("heading", { name: "Order History" })).not.toBeNull();
    expect(screen.getByText("1 order placed")).not.toBeNull();
    expect(screen.getByRole("region", { name: "Customer order history list" })).not.toBeNull();
    expect(screen.getByText(/#101/)).not.toBeNull();
  });
});
