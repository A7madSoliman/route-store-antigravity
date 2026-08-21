import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));

import { getOrdersResponseSchema } from "@/lib/api/schemas/get-orders-response.schema.server";

describe("getOrdersResponseSchema", () => {
  it("parses valid empty array response", () => {
    const raw: unknown[] = [];
    const parsed = getOrdersResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual([]);
    }
  });

  it("parses valid bare-array order history with populated products and user", () => {
    const raw = [
      {
        _id: "64a1234567890",
        id: 6900,
        user: {
          _id: "user-123",
          name: "Jane Doe",
          email: "jane@example.com",
          phone: "01012345678",
        },
        cartItems: [
          {
            _id: "item-1",
            count: 2,
            price: 150,
            product: {
              _id: "prod-1",
              title: "Test Product",
              imageCover: "https://example.com/image.jpg",
              ratingsAverage: 4.5,
              ratingsQuantity: 10,
              category: {
                _id: "cat-1",
                name: "Electronics",
                slug: "electronics",
              },
              brand: {
                _id: "brand-1",
                name: "BrandX",
                slug: "brandx",
              },
            },
          },
        ],
        totalOrderPrice: 300,
        taxPrice: 0,
        shippingPrice: 0,
        paymentMethodType: "cash",
        isPaid: false,
        isDelivered: false,
        shippingAddress: {
          details: "123 Main St",
          phone: "01012345678",
          city: "Cairo",
        },
        createdAt: "2026-08-21T08:00:00.000Z",
        updatedAt: "2026-08-21T08:00:00.000Z",
      },
    ];

    const parsed = getOrdersResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toHaveLength(1);
      expect(parsed.data[0]._id).toBe("64a1234567890");
      expect(parsed.data[0].id).toBe(6900);
      expect(parsed.data[0].totalOrderPrice).toBe(300);
      expect(parsed.data[0].cartItems).toHaveLength(1);
      expect(parsed.data[0].cartItems[0].count).toBe(2);
    }
  });

  it("handles string user and string product IDs gracefully", () => {
    const raw = [
      {
        _id: "order-2",
        user: "user-id-string",
        cartItems: [
          {
            _id: "item-2",
            count: 1,
            price: 100,
            product: "prod-id-string",
          },
        ],
        totalOrderPrice: 100,
      },
    ];

    const parsed = getOrdersResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data[0].user).toBe("user-id-string");
      expect(parsed.data[0].cartItems[0].product).toBe("prod-id-string");
    }
  });
});
