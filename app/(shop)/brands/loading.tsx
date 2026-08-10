import { PageContainer } from "@/components/layout/page-container";

export default function BrandsLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading brands" role="status">
        <span className="sr-only">Loading brands</span>
        <div className="h-4 w-28 rounded bg-surface-high" />
        <div className="mt-5 h-10 w-40 rounded bg-surface-high" />
        <ul aria-hidden="true" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <li className="aspect-[4/3] rounded-xl bg-surface-low" key={index} />)}
        </ul>
      </section>
    </PageContainer>
  );
}
