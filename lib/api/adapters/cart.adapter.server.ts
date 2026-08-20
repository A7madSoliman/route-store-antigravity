import "server-only";

import type { Cart, CartItem, CartProduct } from "@/types/cart";
import type { GetCartResponse } from "@/lib/api/schemas/get-cart-response.schema.server";
import { normalizeApiImageUrl } from "@/lib/media/api-image.server";

export function adaptCartResponse(response: GetCartResponse): Cart {
  if (!response || !response.data) {
    return createEmptyCart();
  }

  const { data, numOfCartItems } = response;

  const items: CartItem[] = (data.products ?? [])
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const rawProduct = typeof item.product === "object" && item.product !== null ? item.product : {};
      const productObj = rawProduct as Record<string, unknown>;
      const productId =
        (typeof productObj._id === "string" ? productObj._id : "") ||
        (typeof productObj.id === "string" ? productObj.id : "") ||
        (typeof item.product === "string" ? item.product : "") ||
        (typeof item._id === "string" ? item._id : "");

      const productCategory =
        typeof productObj.category === "object" && productObj.category !== null
          ? (productObj.category as Record<string, unknown>)
          : {};
      const productBrand =
        typeof productObj.brand === "object" && productObj.brand !== null
          ? (productObj.brand as Record<string, unknown>)
          : {};

      const product: CartProduct = {
        id: productId,
        title: typeof productObj.title === "string" ? productObj.title : "",
        slug: typeof productObj.slug === "string" ? productObj.slug : productId,
        price: typeof productObj.price === "number" ? productObj.price : item.price ?? 0,
        imageUrl: normalizeApiImageUrl(typeof productObj.imageCover === "string" ? productObj.imageCover : null),
        category: {
          id: typeof productCategory._id === "string" ? productCategory._id : "",
          name: typeof productCategory.name === "string" ? productCategory.name : "",
          slug: typeof productCategory.slug === "string" ? productCategory.slug : "",
        },
        brand: {
          id: typeof productBrand._id === "string" ? productBrand._id : "",
          name: typeof productBrand.name === "string" ? productBrand.name : "",
          slug: typeof productBrand.slug === "string" ? productBrand.slug : "",
        },
        quantity: typeof productObj.quantity === "number" ? productObj.quantity : 1,
        ratingsAverage: typeof productObj.ratingsAverage === "number" ? productObj.ratingsAverage : 0,
      };

      return {
        id: item._id || productId,
        productId: product.id,
        product,
        count: typeof item.count === "number" ? item.count : 1,
        price: typeof item.price === "number" ? item.price : product.price,
      };
    });

  return {
    id: data._id ?? "",
    cartOwner: data.cartOwner ?? "",
    totalCartPrice: data.totalCartPrice ?? 0,
    numOfCartItems: numOfCartItems ?? items.length,
    items,
  };
}

export function createEmptyCart(): Cart {
  return {
    id: "",
    cartOwner: "",
    totalCartPrice: 0,
    numOfCartItems: 0,
    items: [],
  };
}
