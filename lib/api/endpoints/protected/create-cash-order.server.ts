import "server-only";

import { createCashOrderResponseSchema } from "@/lib/api/schemas/create-cash-order-response.schema.server";
import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPostJson } from "@/lib/api/transport/protected-request.server";
import type { CashOrder, ShippingAddress } from "@/types/order";

export async function createCashOrder(cartId: string, shippingAddress: ShippingAddress): Promise<CashOrder> {
  const { status, body } = await protectedPostJson(["orders", cartId], { shippingAddress });

  if (status === 201) {
    const parsed = createCashOrderResponseSchema.parse(body);
    const data = parsed.data;

    return {
      id: data._id || "",
      user: data.user,
      cartItems: data.cartItems.map((item: { _id?: string; product?: string; count?: number; price?: number }) => ({
        id: item._id || "",
        productId: item.product || "",
        count: item.count || 0,
        price: item.price || 0,
      })),
      totalOrderPrice: data.totalOrderPrice,
      taxPrice: data.taxPrice,
      shippingPrice: data.shippingPrice,
      paymentMethodType: data.paymentMethodType,
      isPaid: data.isPaid,
      isDelivered: data.isDelivered,
      shippingAddress: data.shippingAddress || { details: "", phone: "", city: "" },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  if (status === 400 || status === 404 || status === 401) {
    throw new ProtectedApiError("invalid-request");
  }

  throw new ProtectedApiError("upstream-failure");
}
