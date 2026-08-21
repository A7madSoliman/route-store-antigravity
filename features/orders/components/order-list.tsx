import Link from "next/link";
import { OrderCard } from "@/features/orders/components/order-card";
import { OrderEmpty } from "@/features/orders/components/order-empty";
import type { Order } from "@/types/order";

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <OrderEmpty />;
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191B23]">Order History</h2>
          <p className="text-xs sm:text-sm text-[#434655]">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#191B23] font-medium text-sm rounded-xl active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Orders vertical list */}
      <div
        role="region"
        aria-label="Customer order history list"
        className="space-y-4"
      >
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
