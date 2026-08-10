import { PageContainer } from "@/components/layout/page-container";

export default function CategoriesLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading categories" role="status">
        <span className="sr-only">Loading categories</span>
        <div className="h-4 w-32 rounded bg-surface-high" />
        <div className="mt-5 h-10 w-48 rounded bg-surface-high" />
        <div className="mt-3 h-6 w-72 max-w-full rounded bg-surface-high" />
        <ul aria-hidden="true" className="mt-8 flex gap-4 overflow-hidden md:grid md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <li className="min-w-[72vw] sm:min-w-[44vw] md:min-w-0" key={index}>
              <div className="aspect-[4/3] rounded-xl bg-surface-low" />
              <div className="mt-3 h-5 w-3/5 rounded bg-surface-high" />
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  );
}
