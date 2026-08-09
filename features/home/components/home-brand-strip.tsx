import Link from "next/link";
import type { Brand } from "@/types/brand";
import { HomeSectionStateView, type HomeSectionState } from "./home-section-state";

export function HomeBrandStrip({ state }: { state: HomeSectionState<Brand> }) {
  if (state.status !== "ready") return <HomeSectionStateView state={state} title="Brands">{null}</HomeSectionStateView>;

  return (
    <>
      <section aria-labelledby="brands-title" className="hidden border-y border-outline-subtle bg-surface-low py-10 md:block">
        <div className="mx-auto max-w-page-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex items-center justify-between gap-4"><h2 className="text-heading-3 text-text-primary" id="brands-title">Browse brands</h2><Link className="min-h-11 inline-flex items-center text-button text-brand-primary" href="/brands">View all</Link></div>
          <ul className="mt-6 flex flex-wrap gap-3">
            {state.items.slice(0, 8).map((brand) => <li key={brand.id}><Link className="inline-flex min-h-11 items-center rounded-full border border-outline-subtle bg-card px-5 text-body-small text-text-secondary hover:border-brand-primary hover:text-brand-primary" href={`/brands/${encodeURIComponent(brand.id)}`}>{brand.name}</Link></li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
