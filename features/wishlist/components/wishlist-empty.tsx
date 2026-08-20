import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";

export function WishlistEmpty() {
  return (
    <div className="bg-white rounded-2xl border border-[#C3C6D7]/40 p-8 sm:p-12 text-center shadow-sm max-w-lg mx-auto">
      <div aria-hidden="true" className="w-16 h-16 rounded-full bg-[#DAE2FD] text-[#004AC6] flex items-center justify-center mx-auto mb-4">
        <StorefrontIcon name="heart" size={32} />
      </div>

      <h3 className="text-heading-3 font-bold text-text-primary mb-2">Your wishlist is empty</h3>
      <p className="text-body text-text-secondary mb-6">
        Save items you love to review them later and keep track of your favorite products.
      </p>

      <Link
        href="/products"
        className="inline-flex items-center justify-center bg-brand-primary text-white px-6 py-3 rounded-lg text-button font-semibold hover:bg-brand-primary-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Explore Products
      </Link>
    </div>
  );
}
