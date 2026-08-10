import { PageContainer } from "@/components/layout/page-container";

export default function BrandDetailLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading brand" role="status">
        <span className="sr-only">Loading brand</span>
        <div className="h-4 w-28 rounded bg-surface-high" />
        <div className="mt-6 aspect-[4/3] max-w-xl rounded-xl bg-surface-low" />
        <div className="mt-5 h-10 w-56 max-w-full rounded bg-surface-high" />
        <div className="mt-6 h-11 w-64 rounded-md bg-surface-high" />
      </section>
    </PageContainer>
  );
}
