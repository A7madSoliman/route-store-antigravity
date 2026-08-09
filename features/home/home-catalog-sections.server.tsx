import "server-only";

import type { Brand } from "@/types/brand";
import type { Category } from "@/types/category";
import type { ProductSummary } from "@/types/product";
import { HomeBrandStrip } from "./components/home-brand-strip";
import { HomeCategorySection } from "./components/home-category-section";
import { HomeProductSection } from "./components/home-product-section";
import type { HomeSectionState } from "./components/home-section-state";

export async function HomeCategories({ data }: { data: Promise<HomeSectionState<Category>> }) {
  return <HomeCategorySection state={await data} />;
}

export async function HomeBrands({ data }: { data: Promise<HomeSectionState<Brand>> }) {
  return <HomeBrandStrip state={await data} />;
}

export async function HomeProducts({ data }: { data: Promise<HomeSectionState<ProductSummary>> }) {
  return <HomeProductSection state={await data} />;
}
