import { ProductListing } from "@/features/catalog/components/product-listing";
import { loadProductListing, type ProductListingSearchParams } from "@/features/catalog/product-listing-data.server";

type ProductsPageProps = {
  searchParams: Promise<ProductListingSearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const state = await loadProductListing(await searchParams);
  return <ProductListing view={state} />;
}
