"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

type SubcategoryDetailErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function SubcategoryDetailError({ retry }: SubcategoryDetailErrorProps) {
  return (
    <PageContainer className="py-16 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] text-center md:py-24">
      <section aria-labelledby="subcategory-error-title" role="alert">
        <h1 className="text-heading-2 text-text-primary" id="subcategory-error-title">Unable to load subcategory</h1>
        <p className="mt-3 text-body text-text-secondary">Please try again or return to subcategories.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-on-primary focus-visible:ring-2 focus-visible:ring-brand-primary" onClick={retry} type="button">Try again</button>
          <Link className="inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-5 text-button text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/subcategories">Return to subcategories</Link>
        </div>
      </section>
    </PageContainer>
  );
}
