import "server-only";

import { createCheckoutSessionResponseSchema } from "@/lib/api/schemas/create-checkout-session-response.schema.server";
import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPostJson } from "@/lib/api/transport/protected-request.server";
import type { CheckoutSession, ShippingAddress } from "@/types/order";

export async function createCheckoutSession(
  cartId: string,
  shippingAddress: ShippingAddress,
  returnBaseUrl: string,
): Promise<CheckoutSession> {
  const searchParams = new URLSearchParams({ url: returnBaseUrl });

  const { status, body } = await protectedPostJson(["orders", "checkout-session", cartId], { shippingAddress }, searchParams);

  if (status === 200) {
    const parsed = createCheckoutSessionResponseSchema.parse(body);
    return {
      url: parsed.session.url,
      successUrl: parsed.session.success_url,
      cancelUrl: parsed.session.cancel_url,
    };
  }

  if (status === 400 || status === 404 || status === 401) {
    throw new ProtectedApiError("invalid-request");
  }

  throw new ProtectedApiError("upstream-failure");
}
