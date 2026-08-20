export type CartProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  quantity: number;
  ratingsAverage: number;
};

export type CartItem = {
  id: string;
  productId: string;
  product: CartProduct;
  count: number;
  price: number;
};

export type Cart = {
  id: string;
  cartOwner: string;
  totalCartPrice: number;
  numOfCartItems: number;
  items: CartItem[];
};
