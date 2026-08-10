import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { BrandDirectoryState } from "@/features/catalog/brand-directory-data.server";

function BrandDirectoryStateView({ state }: { state: Exclude<BrandDirectoryState, { status: "ready" }> }) {
  if (state.status === "empty") {
    return (
      <section aria-live="polite" className="mt-8 rounded-xl border border-outline-subtle bg-card px-6 py-10 text-center" role="status">
        <h2 className="text-heading-3 text-text-primary">No brands are available right now.</h2>
        <p className="mt-2 text-body-small text-text-secondary">Please check back later.</p>
      </section>
    );
  }

  return (
    <section aria-live="polite" className="mt-8 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
      <h2 className="text-heading-3 text-error-text">Brands are unavailable right now.</h2>
      <p className="mt-2 text-body-small text-text-secondary">Please try again later.</p>
    </section>
  );
}

export function BrandDirectory({ state }: { state: BrandDirectoryState }) {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
      <h1 className="mt-5 text-display-mobile text-text-primary md:text-display-desktop">Brands</h1>

      {state.status === "ready" ? (
        <section aria-label="Brand directory" className="mt-8">
          <ul aria-label="Brands" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {state.page.items.map((brand) => (
              <li key={brand.id}>
                <Link className="group block rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary" href={`/brands/${encodeURIComponent(brand.id)}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-outline-subtle bg-surface-low">
                    {brand.imageUrl ? (
                      <Image alt="" className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" src={brand.imageUrl} />
                    ) : <div aria-hidden="true" className="h-full" />}
                  </div>
                  <h2 className="mt-3 text-heading-4 text-text-primary">{brand.name}</h2>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : <BrandDirectoryStateView state={state} />}
    </PageContainer>
  );
}
