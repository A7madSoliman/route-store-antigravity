import Image from "next/image";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import type { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrderCard({ order }: OrderCardProps) {
  const displayId = order.numericId ? `#${order.numericId}` : `#${order.id.slice(-8).toUpperCase()}`;
  const isCash = order.paymentMethodType === "cash";

  return (
    <article
      aria-labelledby={`order-title-${order.id}`}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 space-y-4"
    >
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 id={`order-title-${order.id}`} className="text-base sm:text-lg font-bold text-[#191B23]">
              Order <span className="text-[#004AC6]">{displayId}</span>
            </h3>
            <span className="text-xs text-[#434655] font-medium bg-slate-100 px-2 py-0.5 rounded-md">
              {formatDate(order.createdAt)}
            </span>
          </div>
          {order.shippingAddress.city && (
            <p className="text-xs text-[#434655] mt-1">
              Deliver to: <span className="font-medium text-[#191B23]">{order.shippingAddress.details || order.shippingAddress.city}</span> ({order.shippingAddress.city})
            </p>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Payment Method */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
            {isCash ? "Cash on Delivery" : "Online Card"}
          </span>

          {/* Payment Status */}
          {order.isPaid ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Paid
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              Unpaid
            </span>
          )}

          {/* Delivery Status */}
          {order.isDelivered ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              Delivered
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              Processing
            </span>
          )}
        </div>
      </div>

      {/* Cart Items List / Thumbnails */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Items ({order.cartItems.reduce((sum, item) => sum + item.count, 0)})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {order.cartItems.map((item) => (
            <div
              key={item.id || item.productId}
              className="flex items-center gap-3 p-2.5 bg-slate-50/70 rounded-xl border border-slate-100"
            >
              <div className="w-12 h-12 rounded-lg bg-white overflow-hidden relative flex-shrink-0 border border-slate-200/60">
                {item.product?.imageUrl ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.title || "Ordered item"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <StorefrontIcon name="categories" size={20} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#191B23] truncate" title={item.product?.title}>
                  {item.product?.title || "Product"}
                </p>
                <div className="flex items-center justify-between text-xs text-[#434655] mt-0.5">
                  <span>Qty: {item.count}</span>
                  <span className="font-semibold text-[#004AC6]">
                    EGP {(item.price * item.count).toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Footer with Total */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-[#434655]">
          {order.shippingAddress.phone && (
            <span>Phone: <span className="font-medium text-[#191B23]">{order.shippingAddress.phone}</span></span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xs text-[#434655] font-medium">Order Total:</span>
          <span className="text-base sm:text-lg font-bold text-[#004AC6]">
            EGP {order.totalOrderPrice.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </article>
  );
}
