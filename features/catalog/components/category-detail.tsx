import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductGrid } from "@/components/commerce/product-grid";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { CategoryDetailSectionState, CategoryDetailState } from "@/features/catalog/category-detail-data.server";
import type { ProductSummary } from "@/types/product";
import type { Subcategory } from "@/types/subcategory";

function SubcategorySection({ state }: { state: CategoryDetailSectionState<Subcategory> }) {
  return (
    <section aria-labelledby="subcategories-title" className="mt-10">
      <h2 className="text-heading-3 text-text-primary" id="subcategories-title">Subcategories</h2>
      {state.status === "ready" && (
        <ul aria-label="Subcategories" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.items.map((subcategory) => (
            <li key={subcategory.id}>
              <Link className="flex min-h-11 items-center rounded-md border border-outline-subtle px-4 text-body text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href={`/subcategories/${encodeURIComponent(subcategory.id)}`}>{subcategory.name}</Link>
            </li>
          ))}
        </ul>
      )}
      {state.status === "empty" && <p className="mt-3 text-body text-text-secondary">No subcategories are available for this category right now.</p>}
      {state.status === "error" && <p className="mt-3 text-body text-text-secondary" role="alert">Subcategories are unavailable right now.</p>}
    </section>
  );
}

function ProductSection({ state }: { state: CategoryDetailSectionState<ProductSummary> }) {
  return (
    <section aria-labelledby="category-products-title" className="mt-12">
      <h2 className="text-heading-3 text-text-primary" id="category-products-title">Products in this category</h2>
      {state.status === "ready" && <div className="mt-6"><ProductGrid>{state.items.map((product) => <ProductCard key={product.id} layout="grid" product={product} />)}</ProductGrid></div>}
      {state.status === "empty" && <p className="mt-3 text-body text-text-secondary">No products are available for this category right now.</p>}
      {state.status === "error" && <p className="mt-3 text-body text-text-secondary" role="alert">Products are unavailable right now.</p>}
    </section>
  );
}

function CategoryUnavailable() {
  return (
    <section aria-labelledby="category-unavailable-title" className="mt-10 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
      <h1 className="text-heading-2 text-error-text" id="category-unavailable-title">Category unavailable</h1>
      <p className="mt-3 text-body text-text-secondary">This category is unavailable right now.</p>
      <Link className="mt-6 inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-5 text-button text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/categories">Return to categories</Link>
    </section>
  );
}

export function CategoryDetail({ state }: { state: CategoryDetailState }) {
  if (state.status === "error") {
    return (
      <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
        <CategoryUnavailable />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: state.category.name }]} />
      <section aria-labelledby="category-title" className="mt-6 max-w-md">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-low">
          {state.category.imageUrl ? (
            <Image alt="" className="object-cover" fill priority sizes="(max-width: 767px) 100vw, 448px" src={state.category.imageUrl} />
          ) : (
            <div aria-hidden="true" className="flex h-full items-center justify-center text-brand-primary"><StorefrontIcon name="categories" size={52} /></div>
          )}
        </div>
        <h1 className="mt-5 text-display-mobile text-text-primary md:text-display-desktop" id="category-title">{state.category.name}</h1>
      </section>
      <SubcategorySection state={state.subcategories} />
      <ProductSection state={state.products} />
    </PageContainer>
  );
}
