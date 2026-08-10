import { PageContainer } from "@/components/layout/page-container";

export default function ProductDetailLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <section aria-label="Loading product" role="status">
        <span className="sr-only">Loading product</span>
        <div className="h-4 w-40 rounded bg-surface-muted" />
        <div className="mt-6 grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="aspect-[4/5] rounded-xl bg-surface-muted md:col-span-7" />
          <div className="space-y-5 md:col-span-5">
            <div className="h-4 w-28 rounded bg-surface-muted" />
            <div className="h-10 w-4/5 rounded bg-surface-muted" />
            <div className="h-5 w-32 rounded bg-surface-muted" />
            <div className="h-7 w-24 rounded bg-surface-muted" />
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
