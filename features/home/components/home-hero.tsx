import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="relative isolate overflow-hidden bg-[#1c2736] text-white">
      <div className="absolute inset-0 z-0 hidden bg-[url('/images/marketing/home-hero-desktop.webp')] bg-cover bg-center md:block" />
      <div className="absolute inset-x-4 bottom-4 top-20 z-0 rounded-2xl bg-[url('/images/marketing/home-hero-mobile.webp')] bg-cover bg-center md:hidden" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />
      <PageContainer className="relative z-10 flex min-h-[560px] items-end py-14 md:min-h-[750px] md:items-center md:py-20">
        <div className="max-w-xl">
          <p className="mb-4 text-caption font-semibold uppercase tracking-[0.14em] text-white/80">Nexa Store</p>
          <h1 className="text-display-mobile md:text-display-desktop" id="home-hero-title">
            <span className="md:hidden">Elevate Your Everyday Style.</span>
            <span className="hidden md:inline">Redefining the Modern Wardrobe.</span>
          </h1>
          <p className="mt-5 max-w-lg text-body-large text-white/85">Discover considered pieces across the verified catalog.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex min-h-11 items-center rounded-md bg-brand-primary px-5 text-button text-white hover:bg-brand-primary-strong" href="/products">
              Shop products
            </Link>
            <Link className="inline-flex min-h-11 items-center rounded-md border border-white/70 px-5 text-button text-white hover:bg-white/10" href="/categories">
              Browse categories
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
