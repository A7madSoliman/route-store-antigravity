import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import type { ProductSummary } from "@/types/product";
import { HomeSectionStateView, type HomeSectionState } from "./home-section-state";

export function HomeProductSection({ state }: { state: HomeSectionState<ProductSummary> }) {
  if (state.status !== "ready") return <HomeSectionStateView state={state} title="Explore products">{null}</HomeSectionStateView>;

  return (
    <>
      <section aria-labelledby="products-title" className="py-12 md:py-16">
        <div className="mx-auto max-w-page-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex items-end justify-between gap-4"><div><p className="text-caption font-medium uppercase tracking-[0.08em] text-text-muted">The catalog</p><h2 className="mt-2 text-heading-2 text-text-primary" id="products-title">Explore products</h2></div><Link className="min-h-11 inline-flex items-center text-button text-brand-primary" href="/products">View all</Link></div>
          <ul className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
            {state.items.slice(0, 8).map((product) => <ProductCard key={product.id} layout="rail" product={product} />)}
          </ul>
        </div>
      </section>
    </>
  );
}
