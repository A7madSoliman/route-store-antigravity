import { PageContainer } from "@/components/layout/page-container";

export default function ShopHomePage() {
  return (
    <PageContainer className="py-16 md:py-20">
      <section aria-labelledby="storefront-shell-title" className="max-w-2xl">
        <p className="mb-3 text-caption font-medium uppercase tracking-[0.08em] text-text-muted">
          Storefront foundation
        </p>
        <h1 id="storefront-shell-title" className="text-display-mobile md:text-display-desktop">
          Nexa Store
        </h1>
        <p className="mt-4 max-w-xl text-body text-text-secondary">
          The shared storefront shell is ready for the approved product experiences.
        </p>
      </section>
    </PageContainer>
  );
}
