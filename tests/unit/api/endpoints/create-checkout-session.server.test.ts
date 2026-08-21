import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
import { createCheckoutSession } from "@/lib/api/endpoints/protected/create-checkout-session.server";
import * as protectedRequest from "@/lib/api/transport/protected-request.server";
import { ProtectedApiError } from "@/lib/api/errors.server";

vi.mock("@/lib/api/transport/protected-request.server");

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const validShippingAddress = {
    details: "123 Main St",
    phone: "01012345678",
    city: "Cairo",
  };

  it("returns checkout session on successful 200 response", async () => {
    vi.mocked(protectedRequest.protectedPostJson).mockResolvedValue({
      status: 200,
      body: {
        status: "success",
        session: {
          url: "https://checkout.stripe.com/pay/123",
          success_url: "http://app/allorders",
          cancel_url: "http://app/cart",
        },
      },
    });

    const result = await createCheckoutSession("cart-1", validShippingAddress, "http://app");

    expect(protectedRequest.protectedPostJson).toHaveBeenCalledWith(
      ["orders", "checkout-session", "cart-1"],
      { shippingAddress: validShippingAddress },
      new URLSearchParams({ url: "http://app" })
    );
    expect(result.url).toBe("https://checkout.stripe.com/pay/123");
    expect(result.successUrl).toBe("http://app/allorders");
  });

  it("throws ProtectedApiError(invalid-request) on 404 status", async () => {
    vi.mocked(protectedRequest.protectedPostJson).mockResolvedValue({
      status: 404,
      body: { status: "fail", message: "Cart not found" },
    });

    await expect(createCheckoutSession("cart-1", validShippingAddress, "http://app")).rejects.toThrow(
      new ProtectedApiError("invalid-request")
    );
  });
});
