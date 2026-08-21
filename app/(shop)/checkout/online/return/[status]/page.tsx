import "server-only";

import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireProtectedRoute } from "@/lib/auth/protected-route.server";

export const metadata: Metadata = {
  title: "Payment Result | Route Store",
  description: "View your checkout payment transaction result.",
};

interface ReturnPageProps {
  params: Promise<{
    status: string;
  }>;
}

export default async function OnlineReturnPage({ params }: ReturnPageProps) {
  const { status } = await params;

  if (status !== "allorders" && status !== "cart") {
    notFound();
  }

  // Guard: Ensure user has a valid active session
  await requireProtectedRoute(`/checkout/online/return/${status}`);

  // Revalidate the cart and orders cache on the server
  revalidatePath("/cart");
  revalidatePath("/account/orders");

  const isSuccess = status === "allorders";

  return (
    <div className="w-full min-h-[60vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center space-y-6">
        {isSuccess ? (
          <>
            {/* Success State Visuals */}
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center animate-bounce">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#191B23]">
                Payment Successful!
              </h1>
              <p className="text-sm text-[#434655] leading-relaxed">
                Thank you for your purchase. Your payment was processed successfully, and your order is now being prepared.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center px-5 py-3 bg-[#004AC6] hover:bg-[#003da8] text-white font-medium text-sm rounded-xl transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                View My Orders
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-5 py-3 bg-slate-100 hover:bg-slate-200 text-[#191B23] font-medium text-sm rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Cancelled/Failed State Visuals */}
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#191B23]">
                Payment Cancelled
              </h1>
              <p className="text-sm text-[#434655] leading-relaxed">
                The payment process was cancelled or failed. Your cart items have been saved, so you can try completing your checkout again.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center px-5 py-3 bg-[#004AC6] hover:bg-[#003da8] text-white font-medium text-sm rounded-xl transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Return to Cart
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-5 py-3 bg-slate-100 hover:bg-slate-200 text-[#191B23] font-medium text-sm rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
