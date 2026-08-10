import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export default function SubcategoryDetailNotFound() {
  return (
    <PageContainer className="py-16 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] text-center md:py-24">
      <section aria-labelledby="subcategory-not-found-title">
        <h1 className="text-display-mobile text-text-primary md:text-display-desktop" id="subcategory-not-found-title">Subcategory not found</h1>
        <p className="mx-auto mt-4 max-w-md text-body text-text-secondary">We couldnâ€™t find that subcategory.</p>
        <Link className="mt-8 inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-on-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/subcategories">Return to subcategories</Link>
      </section>
    </PageContainer>
  );
}
