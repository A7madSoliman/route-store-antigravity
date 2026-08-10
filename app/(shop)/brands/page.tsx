import { BrandDirectory } from "@/features/catalog/components/brand-directory";
import { loadBrandDirectory } from "@/features/catalog/brand-directory-data.server";

export default async function BrandsPage() {
  const state = await loadBrandDirectory();

  return <BrandDirectory state={state} />;
}
