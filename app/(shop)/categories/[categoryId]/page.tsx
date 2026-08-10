import { CategoryDetail } from "@/features/catalog/components/category-detail";
import { loadCategoryDetail } from "@/features/catalog/category-detail-data.server";

type CategoryDetailPageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { categoryId } = await params;
  const state = await loadCategoryDetail(categoryId);

  return <CategoryDetail state={state} />;
}
