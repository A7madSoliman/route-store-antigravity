import { ProductDetail } from "@/features/catalog/components/product-detail";
import { loadProductDetail } from "@/features/catalog/product-detail-data.server";

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const state = await loadProductDetail(productId);

  return <ProductDetail state={state} />;
}
