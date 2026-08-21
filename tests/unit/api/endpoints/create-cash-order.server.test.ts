import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
import { createCashOrder } from "@/lib/api/endpoints/protected/create-cash-order.server";
import * as protectedRequest from "@/lib/api/transport/protected-request.server";
import { ProtectedApiError } from "@/lib/api/errors.server";

vi.mock("@/lib/api/transport/protected-request.server");

describe("createCashOrder", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const validShippingAddress = {
    details: "123 Main St",
    phone: "01012345678",
    city: "Cairo",
  };

  it("returns cash order on successful 201 response", async () => {
    vi.mocked(protectedRequest.protectedPostJson).mockResolvedValue({
      status: 201,
      body: {
        status: "success",
        data: {
          _id: "order-1",
          user: "user-1",
          cartItems: [{ _id: "item-1", count: 1, price: 100, product: "prod-1" }],
          totalOrderPrice: 100,
          shippingAddress: validShippingAddress,
        },
      },
    });

    const result = await createCashOrder("cart-1", validShippingAddress);

    expect(protectedRequest.protectedPostJson).toHaveBeenCalledWith(
      ["orders", "cart-1"],
      { shippingAddress: validShippingAddress }
    );
    expect(result.id).toBe("order-1");
    expect(result.totalOrderPrice).toBe(100);
  });

  it("throws ProtectedApiError(invalid-request) on 400 status", async () => {
    vi.mocked(protectedRequest.protectedPostJson).mockResolvedValue({
      status: 400,
      body: { status: "fail", message: "Invalid cart" },
    });

    await expect(createCashOrder("cart-1", validShippingAddress)).rejects.toThrow(
      new ProtectedApiError("invalid-request")
    );
  });
});
