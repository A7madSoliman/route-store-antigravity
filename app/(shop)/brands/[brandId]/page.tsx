import { BrandDetail } from "@/features/catalog/components/brand-detail";
import { loadBrandDetail } from "@/features/catalog/brand-detail-data.server";

type BrandDetailPageProps = {
  params: Promise<{ brandId: string }>;
};

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { brandId } = await params;
  const state = await loadBrandDetail(brandId);

  return <BrandDetail state={state} />;
}
