import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { CategoryDirectoryState } from "@/features/catalog/category-directory-data.server";

function CategoryDirectoryStateView({ state }: { state: Exclude<CategoryDirectoryState, { status: "ready" }> }) {
  if (state.status === "empty") {
    return (
      <section aria-live="polite" className="mt-8 rounded-xl border border-outline-subtle bg-card px-6 py-10 text-center" role="status">
        <h2 className="text-heading-3 text-text-primary">No categories are available right now.</h2>
        <p className="mt-2 text-body-small text-text-secondary">Please check back later.</p>
      </section>
    );
  }

  return (
    <section aria-live="polite" className="mt-8 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
      <h2 className="text-heading-3 text-error-text">Categories are unavailable right now.</h2>
      <p className="mt-2 text-body-small text-text-secondary">Please try again later.</p>
    </section>
  );
}

export function CategoryDirectory({ state }: { state: CategoryDirectoryState }) {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <div className="mt-5 max-w-2xl">
        <h1 className="text-display-mobile text-text-primary md:text-display-desktop">Categories</h1>
        <p className="mt-3 text-body text-text-secondary">Browse the current category directory.</p>
      </div>

      {state.status === "ready" ? (
        <section aria-label="Category directory" className="mt-8">
          <ul aria-label="Categories" className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-4">
            {state.page.items.map((category) => (
              <li className="min-w-[72vw] snap-start sm:min-w-[44vw] md:min-w-0" key={category.id}>
                <Link aria-label={category.name} className="group block rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary" href={`/categories/${encodeURIComponent(category.id)}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-low">
                    {category.imageUrl ? (
                      <Image alt={category.name} className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" fill sizes="(max-width: 639px) 72vw, (max-width: 767px) 44vw, (max-width: 1023px) 33vw, 25vw" src={category.imageUrl} />
                    ) : (
                      <div aria-hidden="true" className="flex h-full items-center justify-center text-brand-primary"><StorefrontIcon name="categories" size={44} /></div>
                    )}
                  </div>
                  <h2 className="mt-3 text-heading-4 text-text-primary">{category.name}</h2>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : <CategoryDirectoryStateView state={state} />}
    </PageContainer>
  );
}
