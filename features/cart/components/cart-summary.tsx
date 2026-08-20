import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";

export function CartSummary({
  totalCartPrice,
  itemCount,
}: {
  totalCartPrice: number;
  itemCount: number;
}) {
  return (
    <aside className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-6">
      <h2 className="text-heading-3 font-semibold text-text-primary">Order Summary</h2>

      <div className="space-y-3 text-body-small">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="font-semibold text-text-primary">EGP {totalCartPrice.toLocaleString("en-US")}</span>
        </div>

        <div className="flex justify-between text-text-secondary">
          <span>Shipping Estimate</span>
          <span className="text-text-muted">Calculated at checkout</span>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-text-primary">
          <span className="text-body-large font-bold">Total</span>
          <span className="text-heading-3 font-bold text-brand-primary">
            EGP {totalCartPrice.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full inline-flex items-center justify-center py-3.5 px-6 bg-brand-primary text-white font-button text-button font-semibold rounded-lg hover:bg-brand-primary/90 active:scale-[0.99] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        Proceed to Checkout
      </Link>

      <div className="flex items-center justify-center gap-2 text-caption text-text-muted pt-2 border-t border-slate-100">
        <StorefrontIcon name="devices" size={16} />
        <span>Secure Encrypted Checkout</span>
      </div>
    </aside>
  );
}
