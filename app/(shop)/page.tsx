import { Suspense } from "react";
import { HomeBrands, HomeCategories, HomeProducts } from "@/features/home/home-catalog-sections.server";
import { loadHomeData } from "@/features/home/home-data.server";
import { HomeBenefitGrid } from "@/features/home/components/home-benefit-grid";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomePromotionBanner } from "@/features/home/components/home-promotion-banner";
import { HomeSectionSkeleton } from "@/features/home/components/home-section-state";
import { NewsletterPromo } from "@/features/home/components/newsletter-promo";

export const dynamic = "force-dynamic";

export default function ShopHomePage() {
  const data = loadHomeData();

  return (
    <>
      <HomeHero />
      <Suspense fallback={<HomeSectionSkeleton label="categories" />}><HomeCategories data={data.categories} /></Suspense>
      <div className="hidden md:block"><Suspense fallback={<HomeSectionSkeleton label="brands" />}><HomeBrands data={data.brands} /></Suspense></div>
      <div className="md:hidden"><HomePromotionBanner /></div>
      <Suspense fallback={<HomeSectionSkeleton label="products" />}><HomeProducts data={data.products} /></Suspense>
      <div className="hidden md:block"><HomePromotionBanner /></div>
      <HomeBenefitGrid />
      <NewsletterPromo />
    </>
  );
}
