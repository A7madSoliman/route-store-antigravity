import { ProductGridSkeleton } from "@/components/commerce/product-grid";
import { PageContainer } from "@/components/layout/page-container";

export default function CategoryDetailLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading category" role="status">
        <span className="sr-only">Loading category</span>
        <div className="h-4 w-44 rounded bg-surface-high" />
        <div className="mt-6 max-w-md">
          <div className="aspect-[4/3] rounded-xl bg-surface-low" />
          <div className="mt-5 h-10 w-48 rounded bg-surface-high" />
        </div>
        <div className="mt-10 h-7 w-44 rounded bg-surface-high" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <div className="h-11 rounded-md bg-surface-low" key={index} />)}
        </div>
        <div className="mt-12 h-7 w-60 rounded bg-surface-high" />
        <div className="mt-6"><ProductGridSkeleton /></div>
      </section>
    </PageContainer>
  );
}
