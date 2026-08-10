import { CategoryDirectory } from "@/features/catalog/components/category-directory";
import { loadCategoryDirectory } from "@/features/catalog/category-directory-data.server";

export default async function CategoriesPage() {
  const state = await loadCategoryDirectory();

  return <CategoryDirectory state={state} />;
}
