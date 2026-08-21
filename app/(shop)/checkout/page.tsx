import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { getCart } from "@/lib/api/endpoints/protected/cart.server";
import { getAddresses } from "@/lib/api/endpoints/protected/addresses.server";
import { CheckoutView } from "@/features/checkout/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | Nexa Store",
  description: "Securely complete your purchase.",
};

export default async function CheckoutPage() {
  await requireProtectedRoute("/checkout");

  const [cart, addresses] = await Promise.all([
    getCart().catch(() => null),
    getAddresses().catch(() => []),
  ]);

  if (!cart || cart.numOfCartItems === 0 || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      
      <div className="mt-4 md:mt-8">
        <h1 className="text-display-mobile md:text-display-desktop font-bold text-text-primary tracking-tight">
          Checkout
        </h1>
        
        <CheckoutView cart={cart} savedAddresses={addresses} />
      </div>
    </PageContainer>
  );
}
