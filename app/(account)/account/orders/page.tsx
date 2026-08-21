import { type Metadata } from "next";

import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { AccountShell } from "@/components/layout/account-shell";
import { getOrders } from "@/lib/api/endpoints/protected/get-orders.server";
import { OrderList } from "@/features/orders/components/order-list";

export const metadata: Metadata = {
  title: "My Orders | Route Store",
  description: "View and track your previous purchases and order history.",
};

export default async function OrdersPage() {
  const session = await requireProtectedRoute("/account/orders");
  const orders = await getOrders();

  return (
    <AccountShell user={session.user} activeItem="orders">
      <OrderList orders={orders} />
    </AccountShell>
  );
}
