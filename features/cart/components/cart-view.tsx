import Link from "next/link";
import { CartEmpty } from "@/features/cart/components/cart-empty";
import { CartLineItem } from "@/features/cart/components/cart-line-item";
import { CartSummary } from "@/features/cart/components/cart-summary";
import type { Cart } from "@/types/cart";

export function CartView({ cart }: { cart: Cart }) {
  if (cart.items.length === 0) {
    return <CartEmpty />;
  }

  const itemCount = cart.numOfCartItems || cart.items.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-mobile md:text-heading-1 font-bold text-text-primary">
          Shopping Cart
        </h1>
        <p className="mt-1 text-body-small text-text-secondary">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section aria-label="Cart items" className="lg:col-span-8">
          <ul aria-label="Shopping cart items" className="space-y-4">
            {cart.items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </ul>
        </section>

        <section aria-label="Order summary" className="lg:col-span-4 lg:sticky lg:top-24">
          <CartSummary totalCartPrice={cart.totalCartPrice} itemCount={itemCount} />
        </section>
      </div>

      {/* Mobile sticky checkout banner */}
      <div className="md:hidden fixed bottom-[var(--spacing-bottom-nav)] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4">
        <div>
          <span className="text-caption text-text-muted block">Total</span>
          <span className="text-heading-3 font-bold text-brand-primary">
            EGP {cart.totalCartPrice.toLocaleString("en-US")}
          </span>
        </div>

        <Link
          href="/checkout"
          className="inline-flex items-center justify-center py-2.5 px-6 bg-brand-primary text-white font-button text-button font-semibold rounded-lg hover:bg-brand-primary/90 active:scale-[0.99] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
