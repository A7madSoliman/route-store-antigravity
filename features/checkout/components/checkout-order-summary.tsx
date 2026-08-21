import Image from "next/image";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import type { Cart } from "@/types/cart";
import { useFormStatus } from "react-dom";

type CheckoutOrderSummaryProps = {
  cart: Cart;
  paymentMethod: "cash" | "card";
};

export function CheckoutOrderSummary({ cart, paymentMethod }: CheckoutOrderSummaryProps) {
  const { pending } = useFormStatus();

  const isCash = paymentMethod === "cash";
  const buttonLabel = isCash ? "Place Cash Order" : "Proceed to Payment";

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-slate-200/80 sticky top-24 overflow-hidden">
      <div className="p-6 pb-0">
        <h2 className="text-heading-3 font-semibold text-text-primary mb-6">Order Summary</h2>

        {/* Items Preview */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="w-16 h-16 bg-surface-highest rounded-md overflow-hidden relative flex-shrink-0">
                {item.product.imageUrl ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <StorefrontIcon name="categories" size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-small font-semibold text-text-primary truncate" title={item.product.title}>
                  {item.product.title}
                </p>
                <p className="text-caption text-text-secondary mt-0.5">Qty: {item.count}</p>
                <p className="text-body-small font-semibold text-brand-primary mt-0.5">
                  EGP {(item.price * item.count).toLocaleString("en-US")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-low p-6 pt-5 mt-2">
        <div className="space-y-3 text-body-small mb-6">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal ({cart.numOfCartItems} {cart.numOfCartItems === 1 ? "item" : "items"})</span>
            <span className="font-semibold text-text-primary">EGP {cart.totalCartPrice.toLocaleString("en-US")}</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>Shipping</span>
            <span className="font-semibold text-success">Free</span>
          </div>

          <div className="pt-3 border-t border-outline-subtle flex justify-between items-baseline text-text-primary">
            <span className="text-body-large font-bold">Total</span>
            <span className="text-heading-3 font-bold text-brand-primary">
              EGP {cart.totalCartPrice.toLocaleString("en-US")}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-center py-3.5 px-6 bg-brand-primary text-white font-button text-button font-semibold rounded-lg hover:bg-brand-primary-strong active:scale-[0.99] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          {pending ? "Processing..." : buttonLabel}
        </button>

        <div className="flex items-center justify-center gap-2 text-caption text-text-muted mt-4">
          <StorefrontIcon name="devices" size={16} />
          <span>Secure 256-bit Encrypted Checkout</span>
        </div>
      </div>
    </aside>
  );
}
