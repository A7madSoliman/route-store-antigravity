import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";

export function OrderEmpty() {
  return (
    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#004AC6] flex items-center justify-center mb-4">
        <StorefrontIcon name="cart" size={32} />
      </div>

      <h2 className="text-xl font-bold text-[#191B23] mb-2">No orders placed yet</h2>
      <p className="text-sm text-[#434655] mb-6 max-w-sm">
        You haven&apos;t made any purchases yet. Explore our wide selection of products and place your first order today!
      </p>

      <Link
        href="/products"
        className="inline-flex items-center justify-center px-6 py-3 bg-[#004AC6] text-white font-medium text-sm rounded-xl hover:bg-[#003da8] active:scale-[0.99] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer"
      >
        Explore Products
      </Link>
    </div>
  );
}
