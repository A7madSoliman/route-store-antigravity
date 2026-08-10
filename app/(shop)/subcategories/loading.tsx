import { PageContainer } from "@/components/layout/page-container";

export default function SubcategoriesLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading subcategories" role="status">
        <span className="sr-only">Loading subcategories</span>
        <div className="h-4 w-36 rounded bg-surface-high" />
        <div className="mt-5 h-10 w-56 rounded bg-surface-high" />
        <ul aria-hidden="true" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => <li className="h-11 rounded-xl bg-surface-low" key={index} />)}
        </ul>
      </section>
    </PageContainer>
  );
}
