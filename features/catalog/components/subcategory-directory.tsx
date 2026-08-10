import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { SubcategoryDirectoryState } from "@/features/catalog/subcategory-directory-data.server";

function SubcategoryDirectoryStateView({ state }: { state: Exclude<SubcategoryDirectoryState, { status: "ready" }> }) {
  if (state.status === "empty") {
    return (
      <section aria-live="polite" className="mt-8 rounded-xl border border-outline-subtle bg-card px-6 py-10 text-center" role="status">
        <h2 className="text-heading-3 text-text-primary">No subcategories are available right now.</h2>
        <p className="mt-2 text-body-small text-text-secondary">Please check back later.</p>
      </section>
    );
  }

  return (
    <section aria-live="polite" className="mt-8 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
      <h2 className="text-heading-3 text-error-text">Subcategories are unavailable right now.</h2>
      <p className="mt-2 text-body-small text-text-secondary">Please try again later.</p>
    </section>
  );
}

export function SubcategoryDirectory({ state }: { state: SubcategoryDirectoryState }) {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Subcategories" }]} />
      <h1 className="mt-5 text-display-mobile text-text-primary md:text-display-desktop">Subcategories</h1>

      {state.status === "ready" ? (
        <section aria-label="Subcategory directory" className="mt-8">
          <ul aria-label="Subcategories" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.page.items.map((subcategory) => (
              <li key={subcategory.id}>
                <Link className="flex min-h-11 items-center rounded-xl border border-outline-subtle px-4 text-body text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href={`/subcategories/${encodeURIComponent(subcategory.id)}`}>
                  {subcategory.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : <SubcategoryDirectoryStateView state={state} />}
    </PageContainer>
  );
}
