import Link from "next/link";
import {
  productListingHref,
  removeBrand,
  removeCategory,
  removePrice,
  type ProductListingQueryState,
} from "@/features/catalog/product-listing-query";
import type { FilterOption } from "@/features/catalog/product-listing-data.server";

type FilterChipListProps = {
  query: ProductListingQueryState;
  categories: readonly FilterOption[];
  brands: readonly FilterOption[];
};

function labelFor(options: readonly FilterOption[], id: string, fallback: string): string {
  return options.find((option) => option.id === id)?.name ?? fallback;
}

export function FilterChipList({ query, categories, brands }: FilterChipListProps) {
  const chips: Array<{ label: string; href: string }> = [];
  if (query.kind === "categories") {
    query.categoryIds.forEach((id) => chips.push({ label: labelFor(categories, id, "Selected category"), href: productListingHref(removeCategory(query, id)) }));
  }
  if (query.kind === "category-sort") {
    chips.push({ label: labelFor(categories, query.categoryId, "Selected category"), href: productListingHref(removeCategory(query, query.categoryId)) });
  }
  if (query.kind === "category-brand") {
    chips.push({ label: labelFor(categories, query.categoryId, "Selected category"), href: productListingHref(removeCategory(query, query.categoryId)) });
    chips.push({ label: labelFor(brands, query.brandId, "Selected brand"), href: productListingHref(removeBrand(query)) });
  }
  if (query.kind === "brand") chips.push({ label: labelFor(brands, query.brandId, "Selected brand"), href: productListingHref(removeBrand(query)) });
  if (query.kind === "price") {
    const label = query.minimum !== undefined && query.maximum !== undefined
      ? `Price ${query.minimum}–${query.maximum}`
      : query.minimum !== undefined ? `Price from ${query.minimum}` : `Price up to ${query.maximum}`;
    chips.push({ label, href: productListingHref(removePrice(query)) });
  }
  if (chips.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip, index) => (
        <Link key={`${chip.label}-${index}`} href={chip.href} scroll={false} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-outline-subtle bg-surface-low px-3 text-body-small text-text-primary">
          <span>{chip.label}</span><span aria-hidden="true">×</span><span className="sr-only">Remove {chip.label}</span>
        </Link>
      ))}
      <Link className="min-h-11 inline-flex items-center px-2 text-button text-brand-primary" href="/products" scroll={false}>Clear all</Link>
    </div>
  );
}
