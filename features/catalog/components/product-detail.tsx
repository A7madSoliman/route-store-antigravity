import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ProductGallery } from "@/features/catalog/components/product-gallery";
import { AddToWishlistButton } from "@/features/wishlist/components/add-to-wishlist-button";
import type { ProductDetailState } from "@/features/catalog/product-detail-data.server";
import type { ProductDetails } from "@/types/product";

export function buildDisplayMedia(product: Pick<ProductDetails, "imageUrl" | "gallery">): string[] {
  const unique = new Set<string>();
  return [product.imageUrl, ...product.gallery].filter((source): source is string => {
    if (!source || unique.has(source)) return false;
    unique.add(source);
    return true;
  });
}

function ProductUnavailable() {
  return (
    <section aria-labelledby="product-unavailable-title" className="mt-10 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
      <h1 className="text-heading-2 text-error-text" id="product-unavailable-title">Product unavailable</h1>
      <p className="mt-3 text-body text-text-secondary">This product is unavailable right now.</p>
      <Link className="mt-6 inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-5 text-button text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/products">Return to products</Link>
    </section>
  );
}

export function ProductDetail({ state }: { state: ProductDetailState }) {
  if (state.status === "error") {
    return (
      <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
        <ProductUnavailable />
      </PageContainer>
    );
  }

  const { product } = state;
  const description = product.description.trim().length > 0 ? product.description : null;

  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: product.title }]} />
      <div className="mt-6 grid gap-10 md:grid-cols-12 md:items-start lg:gap-12">
        <section aria-label={`${product.title} media`} className="md:col-span-7"><ProductGallery media={buildDisplayMedia(product)} title={product.title} /></section>
        <article className="md:col-span-5">
          <p className="text-overline text-text-secondary">{product.category.name}</p>
          <h1 className="mt-3 text-display-mobile text-text-primary md:text-display-desktop">{product.title}</h1>
          <p className="mt-3 text-body text-text-secondary">{product.brand.name}</p>
          <p className="mt-6 text-heading-2 text-text-primary">Price {product.price.toLocaleString("en-US")}</p>
          <div className="mt-6 space-y-3">
            <AddToWishlistButton productId={product.id} />
            <p className="text-body-small text-text-secondary">Cart purchase actions are not available yet.</p>
          </div>
          {description && (
            <section aria-labelledby="product-description-title" className="mt-10 border-t border-outline-subtle pt-6">
              <h2 className="text-heading-3 text-text-primary" id="product-description-title">Product description</h2>
              <p className="mt-3 whitespace-pre-line text-body text-text-secondary">{description}</p>
            </section>
          )}
        </article>
      </div>
    </PageContainer>
  );
}
