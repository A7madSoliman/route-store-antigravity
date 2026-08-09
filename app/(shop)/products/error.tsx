"use client";

export default function ProductsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section aria-live="polite" className="mx-auto max-w-page-max px-gutter-mobile py-12 text-center sm:px-gutter-tablet lg:px-gutter-desktop" role="alert">
      <h1 className="text-heading-2 text-text-primary">Unable to load products</h1>
      <p className="mt-3 text-body text-text-secondary">Please try again.</p>
      <button className="mt-6 min-h-11 rounded-md bg-brand-primary px-5 text-button text-on-primary" onClick={reset} type="button">Try again</button>
    </section>
  );
}
