"use client";

export default function AccountError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section aria-live="polite" className="mx-auto max-w-[1280px] px-4 py-12 text-center sm:px-6 lg:px-10" role="alert">
      <h1 className="text-2xl font-bold text-[#191B23]">Unable to load account information</h1>
      <p className="mt-3 text-base text-[#434655]">Please try again.</p>
      <button
        className="mt-6 min-h-11 rounded-xl bg-[#004AC6] px-6 text-sm font-semibold text-white hover:bg-[#003EA8] transition-colors"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </section>
  );
}
