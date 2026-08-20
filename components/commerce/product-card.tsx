import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { AddToWishlistButton } from "@/features/wishlist/components/add-to-wishlist-button";
import type { ProductSummary } from "@/types/product";

type ProductCardLayout = "rail" | "grid";

export function ProductCard({ product, layout = "rail" }: { product: ProductSummary; layout?: ProductCardLayout }) {
  const isRail = layout === "rail";

  return (
    <li className={isRail ? "min-w-[72vw] snap-start sm:min-w-[45vw] md:min-w-0" : "min-w-0"}>
      <div className="group relative rounded-xl">
        <Link className="block rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary" href={`/products/${encodeURIComponent(product.id)}`}>
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
          <span className="mt-3 block text-caption font-medium uppercase tracking-[0.08em] text-text-muted">
            {product.category.name}
          </span>
          <h3 className="mt-1 line-clamp-2 text-heading-4 text-text-primary">{product.title}</h3>
          <p className="mt-2 text-body-small text-text-secondary">Price {product.price.toLocaleString("en-US")}</p>
        </Link>
        <div className="absolute top-3 right-3 z-10">
          <AddToWishlistButton productId={product.id} variant="icon" />
        </div>
      </div>
    </li>
  );
}
