import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { OrderCard } from "@/features/orders/components/order-card";
import type { Order } from "@/types/order";

afterEach(() => cleanup());

const mockOrder: Order = {
  id: "order-123456789",
  numericId: 6900,
  user: {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "01012345678",
  },
  cartItems: [
    {
      id: "item-1",
      productId: "prod-1",
      product: {
        id: "prod-1",
        title: "Classic Cotton T-Shirt",
        slug: "classic-cotton-t-shirt",
        price: 200,
        imageUrl: "https://example.com/shirt.jpg",
        category: { id: "cat-1", name: "Fashion", slug: "fashion" },
        brand: { id: "brand-1", name: "BrandCo", slug: "brandco" },
        ratingsAverage: 4.5,
      },
      count: 2,
      price: 200,
    },
  ],
  totalOrderPrice: 400,
  taxPrice: 0,
  shippingPrice: 0,
  paymentMethodType: "cash",
  isPaid: false,
  isDelivered: false,
  shippingAddress: {
    details: "123 Nile Road, Apt 4",
    phone: "01012345678",
    city: "Cairo",
  },
  createdAt: "2026-08-21T08:30:00.000Z",
  updatedAt: "2026-08-21T08:30:00.000Z",
};

describe("OrderCard Component", () => {
  it("renders order ID, date, status badges, item details, and total price", () => {
    render(<OrderCard order={mockOrder} />);

    expect(screen.getByText(/#6900/)).not.toBeNull();
    expect(screen.getByText("Unpaid")).not.toBeNull();
    expect(screen.getByText("Processing")).not.toBeNull();
    expect(screen.getByText("Cash on Delivery")).not.toBeNull();
    expect(screen.getByText("Classic Cotton T-Shirt")).not.toBeNull();
    expect(screen.getByText("Qty: 2")).not.toBeNull();
    expect(screen.getAllByText("EGP 400").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/123 Nile Road/)).not.toBeNull();
  });

  it("renders paid and delivered badges when statuses are true", () => {
    const paidDeliveredOrder: Order = {
      ...mockOrder,
      isPaid: true,
      isDelivered: true,
      paymentMethodType: "card",
    };

    render(<OrderCard order={paidDeliveredOrder} />);

    expect(screen.getByText("Paid")).not.toBeNull();
    expect(screen.getByText("Delivered")).not.toBeNull();
    expect(screen.getByText("Online Card")).not.toBeNull();
  });
});
