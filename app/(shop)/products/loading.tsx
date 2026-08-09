import { ProductGridSkeleton } from "@/components/commerce/product-grid";
import { PageContainer } from "@/components/layout/page-container";

export default function ProductsLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading products" role="status">
        <div className="h-4 w-28 rounded bg-surface-high" />
        <div className="mt-5 h-10 w-40 rounded bg-surface-high" />
        <div className="mt-3 h-6 w-64 max-w-full rounded bg-surface-high" />
        <div className="mt-8"><ProductGridSkeleton /></div>
        <span className="sr-only">Loading products</span>
      </section>
    </PageContainer>
  );
}
