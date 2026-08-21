import { describe, it, expect } from "vitest";
import { vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createCashOrderResponseSchema } from "@/lib/api/schemas/create-cash-order-response.schema.server";

describe("createCashOrderResponseSchema", () => {
  it("parses valid response correctly", () => {
    const data = {
      status: "success",
      data: {
        _id: "order-123",
        user: "user-456",
        cartItems: [
          {
            _id: "item-1",
            count: 2,
            price: 150,
            product: "prod-1",
          }
        ],
        totalOrderPrice: 300,
        taxPrice: 0,
        shippingPrice: 0,
        paymentMethodType: "cash",
        isPaid: false,
        isDelivered: false,
        shippingAddress: {
          details: "123 Street",
          phone: "01012345678",
          city: "Cairo",
        },
        createdAt: "2026-08-21T00:00:00Z",
        updatedAt: "2026-08-21T00:00:00Z",
      }
    };

    const parsed = createCashOrderResponseSchema.parse(data);
    expect(parsed.status).toBe("success");
    expect(parsed.data._id).toBe("order-123");
    expect(parsed.data.totalOrderPrice).toBe(300);
    expect(parsed.data.cartItems).toHaveLength(1);
    expect(parsed.data.shippingAddress?.city).toBe("Cairo");
  });
});
