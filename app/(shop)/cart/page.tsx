import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { CartView } from "@/features/cart/components/cart-view";
import { getCart } from "@/lib/api/endpoints/protected/cart.server";
import { requireProtectedRoute } from "@/lib/auth/protected-route.server";

export const metadata: Metadata = {
  title: "Shopping Cart | Nexa Store",
  description: "View and manage items in your shopping cart.",
};

export default async function CartPage() {
  await requireProtectedRoute("/cart");

  const cart = await getCart();

  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shopping Cart" }]} />
      <div className="mt-6">
        <CartView cart={cart} />
      </div>
    </PageContainer>
  );
}
