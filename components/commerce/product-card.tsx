import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { AddToWishlistButton } from "@/features/wishlist/components/add-to-wishlist-button";
import type { ProductSummary } from "@/types/product";

type ProductCardLayout = "rail" | "grid";

export function ProductCard({ product, layout = "rail" }: { product: ProductSummary; layout?: ProductCardLayout }) {
  const isRail = layout === "rail";

  return (
    <li className={isRail ? "min-w-[72vw] snap-start sm:min-w-[45vw] md:min-w-0" : "min-w-0"}>
      <div className="group relative flex flex-col justify-between h-full bg-neutral-50 hover:bg-white border border-neutral-200/80 rounded-2xl p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all duration-200">
        <div>
          <div className="relative">
            <Link className="block rounded-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" href={`/products/${encodeURIComponent(product.id)}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-low">
                {product.imageUrl ? (
                  <Image
                    alt={product.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    fill
                    sizes={isRail ? "(max-width: 767px) 72vw, (max-width: 1023px) 45vw, 23vw" : "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"}
                    src={product.imageUrl}
                  />
                ) : (
                  <div aria-hidden="true" className="flex h-full items-center justify-center text-brand-primary">
                    <StorefrontIcon name="store" size={40} />
                  </div>
                )}
              </div>
            </Link>
            <div className="absolute top-2.5 right-2.5 z-10">
              <AddToWishlistButton productId={product.id} variant="icon" />
            </div>
          </div>

          <div className="mt-3">
            <span className="block text-caption font-medium uppercase tracking-[0.08em] text-text-muted">
              {product.category.name}
            </span>
            <Link className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded" href={`/products/${encodeURIComponent(product.id)}`}>
              <h3 className="mt-1 line-clamp-1 h-6 text-heading-4 font-semibold text-text-primary group-hover:text-brand-primary transition-colors" title={product.title}>
                {product.title}
              </h3>
            </Link>
          </div>
        </div>

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <p className="text-body-small font-semibold text-text-secondary">Price {product.price.toLocaleString("en-US")}</p>
          <AddToCartButton productId={product.id} variant="compact" label="Add to Cart" className="w-full justify-center" />
        </div>
      </div>
    </li>
  );
}
