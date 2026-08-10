"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

type ProductDetailErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ProductDetailError({ retry }: ProductDetailErrorProps) {
  return (
    <PageContainer className="py-16 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] text-center md:py-24">
      <section aria-labelledby="product-error-title" role="alert">
        <h1 className="text-display-mobile text-text-primary md:text-display-desktop" id="product-error-title">Unable to load product</h1>
        <p className="mx-auto mt-4 max-w-md text-body text-text-secondary">Please try again or return to products.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-on-primary focus-visible:ring-2 focus-visible:ring-brand-primary" onClick={retry} type="button">Try again</button>
          <Link className="inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-5 text-button text-text-primary focus-visible:ring-2 focus-visible:ring-brand-primary" href="/products">Return to products</Link>
        </div>
      </section>
    </PageContainer>
  );
}
