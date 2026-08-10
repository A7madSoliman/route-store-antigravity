import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { SubcategoryDetailState } from "@/features/catalog/subcategory-detail-data.server";

function SubcategoryUnavailable() {
  return (
    <section aria-labelledby="subcategory-unavailable-title" className="mt-10 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
      <h1 className="text-heading-2 text-error-text" id="subcategory-unavailable-title">Subcategory unavailable</h1>
      <p className="mt-3 text-body text-text-secondary">This subcategory is unavailable right now.</p>
      <Link className="mt-6 inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-5 text-button text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/subcategories">Return to subcategories</Link>
    </section>
  );
}

export function SubcategoryDetail({ state }: { state: SubcategoryDetailState }) {
  if (state.status === "error") {
    return (
      <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Subcategories" }]} />
        <SubcategoryUnavailable />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Subcategories", href: "/subcategories" }, { label: state.subcategory.name }]} />
      <section aria-labelledby="subcategory-title" className="mt-6 max-w-2xl">
        <h1 className="text-display-mobile text-text-primary md:text-display-desktop" id="subcategory-title">{state.subcategory.name}</h1>
      </section>
    </PageContainer>
  );
}
