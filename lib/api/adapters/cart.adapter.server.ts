import "server-only";

import type { Cart, CartItem, CartProduct } from "@/types/cart";
import type { GetCartResponse } from "@/lib/api/schemas/get-cart-response.schema.server";
import { normalizeApiImageUrl } from "@/lib/media/api-image.server";

export function adaptCartResponse(response: GetCartResponse): Cart {
  const { data, numOfCartItems } = response;

  const items: CartItem[] = (data.products ?? []).map((item) => {
    const rawProduct = item.product;
    const productId = rawProduct._id || rawProduct.id || "";

    const product: CartProduct = {
      id: productId,
      title: rawProduct.title,
      slug: rawProduct.slug ?? productId,
      price: rawProduct.price ?? item.price,
      imageUrl: normalizeApiImageUrl(rawProduct.imageCover),
      category: {
        id: rawProduct.category?._id ?? "",
        name: rawProduct.category?.name ?? "",
        slug: rawProduct.category?.slug ?? "",
      },
      brand: {
        id: rawProduct.brand?._id ?? "",
        name: rawProduct.brand?.name ?? "",
        slug: rawProduct.brand?.slug ?? "",
      },
      quantity: rawProduct.quantity ?? 1,
      ratingsAverage: rawProduct.ratingsAverage ?? 0,
    };

    return {
      id: item._id,
      productId: product.id,
      product,
      count: item.count,
      price: item.price,
    };
  });

  return {
    id: data._id,
    cartOwner: data.cartOwner,
    totalCartPrice: data.totalCartPrice,
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
