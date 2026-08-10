import { SubcategoryDirectory } from "@/features/catalog/components/subcategory-directory";
import { loadSubcategoryDirectory } from "@/features/catalog/subcategory-directory-data.server";

export default async function SubcategoriesPage() {
  const state = await loadSubcategoryDirectory();

  return <SubcategoryDirectory state={state} />;
}
