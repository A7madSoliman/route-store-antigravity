import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="relative isolate overflow-hidden bg-[#1c2736] text-white">
      {/* Desktop Background Image positioned from top to avoid cropping subject */}
      <div className="absolute inset-0 z-0 hidden bg-[url('/images/marketing/home-hero-desktop.webp')] bg-cover bg-[center_top] md:block" />
      {/* Mobile Background Image with proper inset and top-aligned focus */}
      <div className="absolute inset-x-3 bottom-3 top-16 z-0 rounded-2xl bg-[url('/images/marketing/home-hero-mobile.webp')] bg-cover bg-[center_top] md:hidden" />
      {/* Responsive Gradient Overlays for readable text contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25 md:bg-gradient-to-r md:from-black/85 md:via-black/45 md:to-transparent" />

      <PageContainer className="relative z-10 flex min-h-[580px] items-end pb-10 pt-24 sm:pb-12 sm:pt-28 md:min-h-[720px] md:items-center md:py-20">
        <div className="max-w-xl rounded-2xl p-4 sm:p-6 md:p-0 backdrop-blur-[2px] md:backdrop-blur-none bg-black/25 md:bg-transparent">
          <p className="mb-3 text-caption font-semibold uppercase tracking-[0.14em] text-white/90">Nexa Store</p>
          <h1 className="text-display-mobile md:text-display-desktop drop-shadow-sm font-bold" id="home-hero-title">
            <span className="md:hidden">Elevate Your Everyday Style.</span>
            <span className="hidden md:inline">Redefining the Modern Wardrobe.</span>
          </h1>
          <p className="mt-4 max-w-lg text-body-large text-white/90 drop-shadow-sm">
            Discover considered pieces across the verified catalog.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-white shadow-sm hover:bg-brand-primary-strong transition-colors"
              href="/products"
            >
              Shop products
            </Link>
            <Link
              className="inline-flex min-h-11 items-center rounded-md border border-white/80 bg-white/10 px-5 text-button text-white backdrop-blur-xs hover:bg-white/20 transition-colors"
              href="/categories"
            >
              Browse categories
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
