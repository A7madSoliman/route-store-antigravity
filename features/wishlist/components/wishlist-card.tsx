import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { RemoveFromWishlistButton } from "@/features/wishlist/components/remove-from-wishlist-button";
import type { WishlistItem } from "@/types/wishlist";

function getSubtitle(description: string): string {
  const trimmed = description.trim();
  if (trimmed.length <= 50) return trimmed;
  return `${trimmed.slice(0, 50)}...`;
}

export function WishlistCard({ item }: { item: WishlistItem }) {
  const subtitle = getSubtitle(item.description);

  return (
    <li className="min-w-0">
      <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative">
          <Link
            href={`/products/${encodeURIComponent(item.id)}`}
            className="block relative aspect-square overflow-hidden bg-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div aria-hidden="true" className="flex h-full items-center justify-center text-brand-primary">
                <StorefrontIcon name="store" size={40} />
              </div>
            )}
          </Link>
          <div className="absolute top-3 right-3 z-10">
            <RemoveFromWishlistButton productId={item.id} variant="icon" />
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <Link
            href={`/products/${encodeURIComponent(item.id)}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
          >
            <h3 className="text-heading-4 font-semibold text-text-primary line-clamp-1 mb-1 group-hover:text-brand-primary transition-colors">
              {item.title}
            </h3>
          </Link>

          {subtitle ? (
            <p className="text-body-small text-text-secondary line-clamp-1 mb-4">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-auto pt-2 flex items-center justify-between gap-4">
            <span className="text-heading-3 font-bold text-text-primary">
              EGP {item.price.toLocaleString("en-US")}
            </span>

            <AddToCartButton productId={item.id} variant="compact" label="Add to Bag" />
          </div>
        </div>
      </div>
    </li>
  );
}
