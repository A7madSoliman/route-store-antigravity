import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import type { ProductSummary } from "@/types/product";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <li className="min-w-[72vw] snap-start sm:min-w-[45vw] md:min-w-0">
      <Link className="group block rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary" href={`/products/${encodeURIComponent(product.id)}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-low">
          {product.imageUrl ? (
            <Image
              alt={product.title}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              fill
              sizes="(max-width: 767px) 72vw, (max-width: 1023px) 45vw, 23vw"
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
    </li>
  );
}
