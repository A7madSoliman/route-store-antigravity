import { describe, it, expect } from "vitest";
import { vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createCheckoutSessionResponseSchema } from "@/lib/api/schemas/create-checkout-session-response.schema.server";

describe("createCheckoutSessionResponseSchema", () => {
  it("parses valid response correctly", () => {
    const data = {
      status: "success",
      session: {
        url: "https://checkout.stripe.com/pay/cs_test_123",
        success_url: "http://localhost:3000/allorders",
        cancel_url: "http://localhost:3000/cart",
      }
    };

    const parsed = createCheckoutSessionResponseSchema.parse(data);
    expect(parsed.status).toBe("success");
    expect(parsed.session.url).toBe("https://checkout.stripe.com/pay/cs_test_123");
    expect(parsed.session.success_url).toBe("http://localhost:3000/allorders");
    expect(parsed.session.cancel_url).toBe("http://localhost:3000/cart");
  });
});
