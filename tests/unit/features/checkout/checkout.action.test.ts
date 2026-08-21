import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("server-only", () => ({}));
import { submitCheckoutAction } from "@/features/checkout/actions/checkout.action";
import * as cashOrderServer from "@/lib/api/endpoints/protected/create-cash-order.server";
import * as checkoutSessionServer from "@/lib/api/endpoints/protected/create-checkout-session.server";
import * as requireSessionServer from "@/lib/auth/require-session.server";
import * as nextCache from "next/cache";
import * as nextNavigation from "next/navigation";

vi.mock("@/lib/api/endpoints/protected/create-cash-order.server");
vi.mock("@/lib/api/endpoints/protected/create-checkout-session.server");
vi.mock("@/lib/auth/require-session.server");
vi.mock("next/cache");
vi.mock("next/navigation");
vi.mock("@/lib/env/server", () => ({
  getServerEnvironment: () => ({ appOrigin: "http://localhost:3000" }),
}));

describe("submitCheckoutAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const getFormData = (data: Record<string, string>) => {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      fd.append(key, value);
    }
    return fd;
  };

  const validAddressData = {
    details: "123 Main St",
    phone: "01012345678",
    city: "Cairo",
  };

  it("requires session", async () => {
    vi.mocked(requireSessionServer.requireSession).mockRejectedValue(new Error("No session"));
    
    const result = await submitCheckoutAction({ status: "idle" }, getFormData({ cartId: "123", paymentMethod: "cash", ...validAddressData }));
    
    expect(result.status).toBe("error");
    expect(result.message).toContain("signed in");
  });

  it("validates form data", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(requireSessionServer.requireSession).mockResolvedValue({ user: { name: "test", email: "test" }, expiresAt: new Date() } as any);
    
    const result = await submitCheckoutAction({ status: "idle" }, getFormData({ cartId: "123", paymentMethod: "invalid", ...validAddressData }));
    
    expect(result.status).toBe("error");
    expect(result.errors?.paymentMethod).toBeDefined();
  });

  it("handles cash order success", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(requireSessionServer.requireSession).mockResolvedValue({ user: { name: "test", email: "test" }, expiresAt: new Date() } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(cashOrderServer.createCashOrder).mockResolvedValue({ user: { name: "test", email: "test" }, expiresAt: new Date() } as any);
    
    const formData = getFormData({ cartId: "cart-1", paymentMethod: "cash", ...validAddressData });
    await submitCheckoutAction({ status: "idle" }, formData);
    
    expect(cashOrderServer.createCashOrder).toHaveBeenCalledWith("cart-1", validAddressData);
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/cart");
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/account/orders");
    expect(nextNavigation.redirect).toHaveBeenCalledWith("/account/orders?status=success");
  });

  it("handles online checkout success and validates Stripe URL", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(requireSessionServer.requireSession).mockResolvedValue({ user: { name: "test", email: "test" }, expiresAt: new Date() } as any);
    vi.mocked(checkoutSessionServer.createCheckoutSession).mockResolvedValue({
      url: "https://checkout.stripe.com/pay/123",
      successUrl: "",
      cancelUrl: "",
    });
    
    const formData = getFormData({ cartId: "cart-1", paymentMethod: "card", ...validAddressData });
    await submitCheckoutAction({ status: "idle" }, formData);
    
    expect(checkoutSessionServer.createCheckoutSession).toHaveBeenCalledWith("cart-1", validAddressData, "http://localhost:3000");
    expect(nextNavigation.redirect).toHaveBeenCalledWith("https://checkout.stripe.com/pay/123");
  });

  it("rejects online checkout if URL is not from Stripe", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(requireSessionServer.requireSession).mockResolvedValue({ user: { name: "test", email: "test" }, expiresAt: new Date() } as any);
    vi.mocked(checkoutSessionServer.createCheckoutSession).mockResolvedValue({
      url: "https://malicious.com/pay/123",
      successUrl: "",
      cancelUrl: "",
    });
    
    const formData = getFormData({ cartId: "cart-1", paymentMethod: "card", ...validAddressData });
    const result = await submitCheckoutAction({ status: "idle" }, formData);
    
    expect(result.status).toBe("error");
    expect(result.message).toContain("Invalid payment gateway URL");
    expect(nextNavigation.redirect).not.toHaveBeenCalled();
  });
});
