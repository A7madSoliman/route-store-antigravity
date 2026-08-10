import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { BrandDetailState } from "@/features/catalog/brand-detail-data.server";

function BrandMedia({ brand }: { brand: Extract<BrandDetailState, { status: "ready" }>["brand"] }) {
  return (
    <div className="relative aspect-[4/3] max-w-xl overflow-hidden rounded-xl border border-outline-subtle bg-surface-low">
      {brand.imageUrl ? <Image alt="" className="object-contain p-8" fill sizes="(max-width: 767px) 100vw, 576px" src={brand.imageUrl} /> : <div aria-hidden="true" className="h-full" />}
    </div>
  );
}

function BrandUnavailable() {
  return (
    <section aria-labelledby="brand-unavailable-title" className="mt-10 rounded-xl border border-error bg-error-container px-6 py-10 text-center" role="alert">
      <h1 className="text-heading-2 text-error-text" id="brand-unavailable-title">Brand unavailable</h1>
      <p className="mt-3 text-body text-text-secondary">This brand is unavailable right now.</p>
      <Link className="mt-6 inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-5 text-button text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/brands">Return to brands</Link>
    </section>
  );
}

export function BrandDetail({ state }: { state: BrandDetailState }) {
  if (state.status === "error") {
    return (
      <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
        <BrandUnavailable />
      </PageContainer>
    );
  }

  const { brand } = state;
  const productsHref = `/products?brand=${encodeURIComponent(brand.id)}`;

  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-8))] md:py-12 md:pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Brands", href: "/brands" }, { label: brand.name }]} />
      <section aria-labelledby="brand-title" className="mt-6 max-w-2xl">
        <BrandMedia brand={brand} />
        <h1 className="mt-5 text-display-mobile text-text-primary md:text-display-desktop" id="brand-title">{brand.name}</h1>
        <Link className="mt-6 inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-on-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href={productsHref}>View products from this brand</Link>
      </section>
    </PageContainer>
  );
}
