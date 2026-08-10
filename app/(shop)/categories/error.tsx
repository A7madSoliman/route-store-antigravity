"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

type CategoriesErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function CategoriesError({ retry }: CategoriesErrorProps) {
  return (
    <PageContainer className="py-16 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] text-center md:py-24">
      <section aria-labelledby="categories-error-title" role="alert">
        <h1 className="text-heading-2 text-text-primary" id="categories-error-title">Unable to load categories</h1>
        <p className="mt-3 text-body text-text-secondary">Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-on-primary focus-visible:ring-2 focus-visible:ring-brand-primary" onClick={retry} type="button">Try again</button>
          <Link className="inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-5 text-button text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/">Return home</Link>
        </div>
      </section>
    </PageContainer>
  );
}
