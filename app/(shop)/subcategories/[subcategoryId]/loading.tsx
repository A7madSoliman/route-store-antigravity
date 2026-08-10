import { PageContainer } from "@/components/layout/page-container";

export default function SubcategoryDetailLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading subcategory" role="status">
        <span className="sr-only">Loading subcategory</span>
        <div className="h-4 w-36 rounded bg-surface-high" />
        <div className="mt-6 h-10 w-64 max-w-full rounded bg-surface-high" />
      </section>
    </PageContainer>
  );
}
