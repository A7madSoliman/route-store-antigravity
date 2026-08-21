import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedGet } from "@/lib/api/transport/protected-request.server";
import { getOrdersResponseSchema, type RawOrderRecord } from "@/lib/api/schemas/get-orders-response.schema.server";
import { getSessionToken } from "@/lib/auth/session.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";
import type { Order } from "@/types/order";

export type GetOrdersErrorCode =
  | "unauthorized"
  | "unavailable"
  | "invalid-response"
  | "upstream-failure";

export class GetOrdersApiError extends Error {
  constructor(readonly code: GetOrdersErrorCode) {
    super("Your orders could not be loaded safely.");
    this.name = "GetOrdersApiError";
  }
}

export function extractUserIdFromJwt(token: string): string | null {
  try {
    const segments = token.split(".");
    if (segments.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(segments[1], "base64url").toString("utf-8"));
    if (typeof payload === "object" && payload !== null && typeof (payload as { id?: unknown }).id === "string") {
      return (payload as { id: string }).id;
    }
  } catch {
    return null;
  }
  return null;
}

function adaptOrder(raw: RawOrderRecord): Order {
  return {
    id: raw._id || (raw.id !== undefined ? String(raw.id) : ""),
    numericId: typeof raw.id === "number" ? raw.id : undefined,
    user:
      typeof raw.user === "object" && raw.user !== null
        ? {
            id: raw.user._id || "",
            name: raw.user.name || "",
            email: raw.user.email || "",
            phone: raw.user.phone,
          }
        : String(raw.user || ""),
    cartItems: raw.cartItems.map((item) => {
      let productObj:
        | {
            _id?: string;
            id?: string;
            title?: string;
            imageCover?: string;
            ratingsAverage?: number;
            ratingsQuantity?: number;
            category?: { _id?: string; name?: string; slug?: string; image?: string };
            brand?: { _id?: string; name?: string; slug?: string; image?: string };
            subcategory?: { _id?: string; name?: string; slug?: string; category?: string }[];
          }
        | undefined;

      let productId = "";
      if (typeof item.product === "object" && item.product !== null) {
        productObj = item.product;
        productId = item.product._id || item.product.id || "";
      } else if (typeof item.product === "string") {
        productId = item.product;
      }

      return {
        id: item._id || "",
        productId,
        product: productObj
          ? {
              id: productId,
              title: productObj.title || "",
              imageUrl: productObj.imageCover || null,
              category: productObj.category
                ? {
                    id: productObj.category._id || "",
                    name: productObj.category.name || "",
                    slug: productObj.category.slug || "",
                  }
                : { id: "", name: "", slug: "" },
              brand: productObj.brand
                ? {
                    id: productObj.brand._id || "",
                    name: productObj.brand.name || "",
                    slug: productObj.brand.slug || "",
                  }
                : { id: "", name: "", slug: "" },
              ratingsAverage: productObj.ratingsAverage || 0,
            }
          : undefined,
        count: item.count || 0,
        price: item.price || 0,
      };
    }),
    totalOrderPrice: raw.totalOrderPrice,
    taxPrice: raw.taxPrice,
    shippingPrice: raw.shippingPrice,
    paymentMethodType: raw.paymentMethodType,
    isPaid: raw.isPaid,
    isDelivered: raw.isDelivered,
    paidAt: raw.paidAt,
    deliveredAt: raw.deliveredAt,
    shippingAddress: raw.shippingAddress
      ? {
          details: raw.shippingAddress.details || "",
          phone: raw.shippingAddress.phone || "",
          city: raw.shippingAddress.city || "",
        }
      : { details: "", phone: "", city: "" },
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || "",
  };
}

export async function getOrders(explicitUserId?: string): Promise<Order[]> {
  try {
    let userId = explicitUserId;

    if (!userId) {
      const token = await getSessionToken();
      if (!token) throw new SessionRequiredError();
      const extracted = extractUserIdFromJwt(token);
      if (!extracted) throw new SessionRequiredError();
      userId = extracted;
    }

    const raw = await protectedGet(["orders", "user", userId]);

    if (!raw) {
      return [];
    }

    const parsed = getOrdersResponseSchema.safeParse(raw);
    if (!parsed.success) {
      if (Array.isArray(raw) && raw.length === 0) {
        return [];
      }
      throw new GetOrdersApiError("invalid-response");
    }

    return parsed.data.map(adaptOrder);
  } catch (error) {
    if (error instanceof GetOrdersApiError) throw error;
    if (error instanceof SessionRequiredError) throw new GetOrdersApiError("unauthorized");
    if (error instanceof ProtectedApiError) {
      if (error.status === 404) return [];
      if (error.status === 401) throw new GetOrdersApiError("unauthorized");
      if (error.code === "unavailable") throw new GetOrdersApiError("unavailable");
      if (error.code === "invalid-response") throw new GetOrdersApiError("invalid-response");
    }
    throw new GetOrdersApiError("upstream-failure");
  }
}
