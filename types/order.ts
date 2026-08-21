export type ShippingAddress = {
  details: string;
  phone: string;
  city: string;
};

export type OrderPaymentMethod = "cash" | "card";

export type OrderProduct = {
  id: string;
  title: string;
  slug?: string;
  price?: number;
  imageUrl: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  ratingsAverage?: number;
};

export type OrderItem = {
  id: string;
  productId: string;
  product?: OrderProduct;
  count: number;
  price: number;
};

export type OrderUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type Order = {
  id: string;
  numericId?: number;
  user: OrderUser | string;
  cartItems: OrderItem[];
  totalOrderPrice: number;
  taxPrice: number;
  shippingPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
};

export type CashOrder = Order;

export type CheckoutSession = {
  url: string;
  successUrl?: string;
  cancelUrl?: string;
};
