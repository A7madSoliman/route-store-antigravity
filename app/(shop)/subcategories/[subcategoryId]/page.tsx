import { SubcategoryDetail } from "@/features/catalog/components/subcategory-detail";
import { loadSubcategoryDetail } from "@/features/catalog/subcategory-detail-data.server";

type SubcategoryDetailPageProps = {
  params: Promise<{ subcategoryId: string }>;
};

export default async function SubcategoryDetailPage({ params }: SubcategoryDetailPageProps) {
  const { subcategoryId } = await params;
  const state = await loadSubcategoryDetail(subcategoryId);

  return <SubcategoryDetail state={state} />;
}
