import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export default function CategoryDetailNotFound() {
  return (
    <PageContainer className="py-16 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] text-center md:py-24">
      <section aria-labelledby="category-not-found-title">
        <h1 className="text-display-mobile text-text-primary md:text-display-desktop" id="category-not-found-title">Category not found</h1>
        <p className="mx-auto mt-4 max-w-md text-body text-text-secondary">We couldn’t find that category.</p>
        <Link className="mt-8 inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-on-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/categories">Return to categories</Link>
      </section>
    </PageContainer>
  );
}
