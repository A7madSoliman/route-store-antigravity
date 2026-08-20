import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import type { CartItem } from "@/types/cart";

export function CartLineItem({ item }: { item: CartItem }) {
  const lineTotal = item.price * item.count;

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md">
      <Link
        href={`/products/${encodeURIComponent(item.productId)}`}
        className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-surface-low rounded-lg overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.title}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center text-brand-primary">
            <StorefrontIcon name="store" size={32} />
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
          <div>
            <Link
              href={`/products/${encodeURIComponent(item.productId)}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              <h3 className="text-body-large font-semibold text-text-primary line-clamp-1 hover:text-brand-primary transition-colors">
                {item.product.title}
              </h3>
            </Link>
            {item.product.brand.name || item.product.category.name ? (
              <p className="text-body-small text-text-secondary mt-0.5">
                {[item.product.brand.name, item.product.category.name].filter(Boolean).join(" • ")}
              </p>
            ) : null}
          </div>
          <span className="text-heading-4 font-bold text-text-primary sm:text-right shrink-0">
            EGP {lineTotal.toLocaleString("en-US")}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-body-small text-text-muted">Unit price:</span>
            <span className="text-body-small font-medium text-text-secondary">
              EGP {item.price.toLocaleString("en-US")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-low rounded-lg border border-slate-200/60 text-body-small font-medium text-text-primary">
            <span className="text-text-muted">Qty:</span>
            <span>{item.count}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
