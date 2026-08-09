import Image from "next/image";
import Link from "next/link";

export function HomePromotionBanner() {
  return (
    <section aria-labelledby="summer-refresh-title" className="relative overflow-hidden bg-[#1455a4] text-white">
      <Image alt="" className="object-cover object-right" fill sizes="100vw" src="/images/marketing/home-promotion-summer-refresh.webp" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1455a4] via-[#1455a4]/90 to-[#1455a4]/20" />
      <div className="relative mx-auto flex min-h-[360px] max-w-page-max items-center px-gutter-mobile py-12 sm:px-gutter-tablet lg:min-h-[450px] lg:px-gutter-desktop">
        <div className="max-w-xl"><p className="text-caption font-semibold uppercase tracking-[0.14em] text-white/75">Seasonal edit</p><h2 className="mt-3 text-display-mobile md:text-display-desktop" id="summer-refresh-title">Summer Refresh</h2><p className="mt-4 max-w-lg text-body-large text-white/85">Explore pieces for the season across the catalog.</p><Link className="mt-7 inline-flex min-h-11 items-center rounded-md bg-white px-5 text-button text-brand-primary hover:bg-white/90" href="/products">Shop products</Link></div>
      </div>
    </section>
  );
}
