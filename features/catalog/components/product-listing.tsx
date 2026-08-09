import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductGrid } from "@/components/commerce/product-grid";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { ProductListingState } from "@/features/catalog/product-listing-data.server";

function ProductListingPagination({ state }: { state: Extract<ProductListingState, { status: "ready" }> }) {
  const { pagination } = state.page;

  if (pagination.currentPage === 1 && pagination.nextPage === 2) {
    return (
      <nav aria-label="Product pages" className="mt-10 flex items-center justify-center gap-2">
        <span aria-current="page" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-brand-primary px-3 text-button text-on-primary">1</span>
        <Link aria-label="Page 2" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-outline-subtle px-3 text-button text-text-primary" href="/products?page=2">2</Link>
      </nav>
    );
  }

  if (pagination.currentPage === 2 && pagination.prevPage === 1) {
    return (
      <nav aria-label="Product pages" className="mt-10 flex items-center justify-center gap-2">
        <Link aria-label="Page 1" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-outline-subtle px-3 text-button text-text-primary" href="/products">1</Link>
        <span aria-current="page" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-brand-primary px-3 text-button text-on-primary">2</span>
      </nav>
    );
  }

  return null;
}

export function ProductListing({ state }: { state: ProductListingState }) {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs />
      <div className="mt-5 max-w-2xl">
        <h1 className="text-display-mobile text-text-primary md:text-display-desktop">Products</h1>
        <p className="mt-3 text-body text-text-secondary">Browse the current catalog.</p>
      </div>

      {state.status === "ready" && (
        <section aria-label="Products" className="mt-8">
          <ProductGrid>{state.page.items.map((product) => <ProductCard key={product.id} layout="grid" product={product} />)}</ProductGrid>
          <ProductListingPagination state={state} />
        </section>
      )}

      {state.status === "empty" && (
        <section aria-live="polite" className="mt-8 rounded-xl border border-outline-subtle bg-card px-6 py-10 text-center" role="status">
          <h2 className="text-heading-3 text-text-primary">No products are available right now.</h2>
          <p className="mt-2 text-body-small text-text-secondary">Please check back later.</p>
        </section>
      )}

      {state.status === "error" && (
        <section aria-live="polite" className="mt-8 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
          <h2 className="text-heading-3 text-error-text">Products are unavailable right now.</h2>
          <p className="mt-2 text-body-small text-text-secondary">Please try again later.</p>
        </section>
      )}
    </PageContainer>
  );
}
