import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
      <div
        aria-hidden="true"
        className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-low text-brand-primary rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200/60"
      >
        <StorefrontIcon name="cart" size={44} />
      </div>

      <h2 className="text-heading-2 font-bold text-text-primary mb-2">
        Your cart is empty
      </h2>

      <p className="text-body text-text-secondary max-w-md mb-8">
        Looks like you haven&apos;t added any items to your cart yet. Explore our latest products and find something you love.
      </p>

      <Link
        href="/products"
        className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-primary text-white font-button text-button font-semibold rounded-lg hover:bg-brand-primary/90 active:scale-[0.99] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        Start Shopping
      </Link>
    </div>
  );
}
