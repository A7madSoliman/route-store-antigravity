import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));

import { getOrders, extractUserIdFromJwt, GetOrdersApiError } from "@/lib/api/endpoints/protected/get-orders.server";
import * as protectedRequest from "@/lib/api/transport/protected-request.server";
import * as sessionServer from "@/lib/auth/session.server";
import { ProtectedApiError } from "@/lib/api/errors.server";

vi.mock("@/lib/api/transport/protected-request.server");
vi.mock("@/lib/auth/session.server");

describe("getOrders endpoint adapter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const dummyPayload = {
    id: "user-12345",
    name: "Jane Doe",
    role: "user",
  };
  const validJwt = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify(dummyPayload)).toString("base64url")}.signature`;

  it("extractUserIdFromJwt extracts id from valid JWT", () => {
    const extracted = extractUserIdFromJwt(validJwt);
    expect(extracted).toBe("user-12345");
  });

  it("extractUserIdFromJwt returns null for invalid JWT", () => {
    expect(extractUserIdFromJwt("invalid")).toBeNull();
    expect(extractUserIdFromJwt("a.b")).toBeNull();
  });

  it("returns mapped orders list on successful response", async () => {
    vi.mocked(sessionServer.getSessionToken).mockResolvedValue(validJwt);
    vi.mocked(protectedRequest.protectedGet).mockResolvedValue([
      {
        _id: "order-1",
        id: 101,
        totalOrderPrice: 250,
        paymentMethodType: "cash",
        isPaid: false,
        isDelivered: false,
        cartItems: [
          {
            _id: "item-1",
            count: 1,
            price: 250,
            product: {
              _id: "prod-1",
              title: "T-Shirt",
              imageCover: "http://example.com/shirt.jpg",
            },
          },
        ],
        shippingAddress: {
          details: "456 Street",
          phone: "01098765432",
          city: "Giza",
        },
        createdAt: "2026-08-21T10:00:00.000Z",
        updatedAt: "2026-08-21T10:00:00.000Z",
      },
    ]);

    const orders = await getOrders();

    expect(protectedRequest.protectedGet).toHaveBeenCalledWith(["orders", "user", "user-12345"]);
    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe("order-1");
    expect(orders[0].numericId).toBe(101);
    expect(orders[0].totalOrderPrice).toBe(250);
    expect(orders[0].cartItems[0].product?.title).toBe("T-Shirt");
    expect(orders[0].shippingAddress.city).toBe("Giza");
  });

  it("uses explicit userId when passed", async () => {
    vi.mocked(protectedRequest.protectedGet).mockResolvedValue([]);

    const orders = await getOrders("custom-user-id");

    expect(protectedRequest.protectedGet).toHaveBeenCalledWith(["orders", "user", "custom-user-id"]);
    expect(orders).toEqual([]);
  });

  it("returns empty array on 404 status", async () => {
    vi.mocked(sessionServer.getSessionToken).mockResolvedValue(validJwt);
    const error = new ProtectedApiError("invalid-request");
    Object.defineProperty(error, "status", { value: 404 });
    vi.mocked(protectedRequest.protectedGet).mockRejectedValue(error);

    const orders = await getOrders();
    expect(orders).toEqual([]);
  });

  it("throws GetOrdersApiError(unauthorized) when no session exists", async () => {
    vi.mocked(sessionServer.getSessionToken).mockResolvedValue(null);

    await expect(getOrders()).rejects.toThrow(new GetOrdersApiError("unauthorized"));
  });
});
