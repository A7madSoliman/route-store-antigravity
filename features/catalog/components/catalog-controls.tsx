"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  baselineQueryState,
  parsePriceBound,
  productListingHref,
  removeBrand,
  removePrice,
  removeSort,
  type ProductListingQueryState,
} from "@/features/catalog/product-listing-query";
import type { FilterOption } from "@/features/catalog/product-listing-data.server";

type CatalogControlsProps = {
  query: ProductListingQueryState;
  categories: readonly FilterOption[];
  categoryStatus: "ready" | "empty" | "error";
  brands: readonly FilterOption[];
  brandStatus: "ready" | "empty" | "error";
};

function categoryIds(query: ProductListingQueryState): readonly string[] {
  return query.kind === "categories" ? query.categoryIds : query.kind === "category-sort" || query.kind === "category-brand" ? [query.categoryId] : [];
}

function filterCount(query: ProductListingQueryState): number {
  if (query.kind === "categories") return query.categoryIds.length;
  if (query.kind === "category-sort" || query.kind === "category-brand") return 2;
  return query.kind === "brand" || query.kind === "price" ? 1 : 0;
}

function optionLabel(options: readonly FilterOption[], id: string, fallback: string): string {
  return options.find((option) => option.id === id)?.name ?? fallback;
}

export function CatalogControls({ query, categories, categoryStatus, brands, brandStatus }: CatalogControlsProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProductListingQueryState>(query);
  const [minimum, setMinimum] = useState(query.kind === "price" && query.minimum !== undefined ? String(query.minimum) : "");
  const [maximum, setMaximum] = useState(query.kind === "price" && query.maximum !== undefined ? String(query.maximum) : "");
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      try { dialog.showModal(); }
      catch { dialog.setAttribute("open", ""); dialog.hidden = false; }
    }
    if (!open && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else { dialog.removeAttribute("open"); dialog.hidden = true; }
    }
  }, [open]);

  function navigate(next: ProductListingQueryState) {
    router.push(productListingHref(next), { scroll: false });
    setOpen(false);
  }

  function closeDialog() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function sortValue(): "default" | "price" | "-price" {
    if (query.kind === "sort") return query.sort;
    if (query.kind === "category-sort") return "price";
    return "default";
  }

  function changeSort(value: string) {
    if (value === "default") navigate(query.kind === "category-sort" ? { kind: "categories", categoryIds: [query.categoryId] } : query.kind === "sort" ? baselineQueryState : query);
    else if (value === "price" && query.kind === "categories" && query.categoryIds.length === 1) navigate({ kind: "category-sort", categoryId: query.categoryIds[0] });
    else navigate({ kind: "sort", sort: value as "price" | "-price" });
  }

  function toggleCategory(id: string, checked: boolean) {
    const selected = [...categoryIds(draft)];
    if (checked) {
      if (selected.includes(id)) return;
      if (draft.kind === "brand") return setDraft({ kind: "category-brand", categoryId: id, brandId: draft.brandId });
      if (draft.kind === "sort" && draft.sort === "price") return setDraft({ kind: "category-sort", categoryId: id });
      if (draft.kind === "category-brand" || draft.kind === "category-sort") return setDraft({ ...draft, categoryId: id });
      if (selected.length < 2) return setDraft({ kind: "categories", categoryIds: selected.length === 0 ? [id] : [selected[0], id] });
      return;
    }
    if (draft.kind === "categories") {
      const remaining = selected.filter((value) => value !== id);
      return setDraft(remaining.length === 0 ? baselineQueryState : { kind: "categories", categoryIds: [remaining[0]] });
    }
    if (draft.kind === "category-brand") return setDraft({ kind: "brand", brandId: draft.brandId });
    if (draft.kind === "category-sort") return setDraft({ kind: "sort", sort: "price" });
  }

  function changeBrand(brandId: string) {
    if (brandId.length === 0) return;
    if (draft.kind === "categories" && draft.categoryIds.length === 1) setDraft({ kind: "category-brand", categoryId: draft.categoryIds[0], brandId });
    else if (draft.kind === "category-brand") setDraft({ kind: "category-brand", categoryId: draft.categoryId, brandId });
    else setDraft({ kind: "brand", brandId });
  }

  function applyPrice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const min = minimum.trim().length > 0 ? parsePriceBound(minimum) : null;
    const max = maximum.trim().length > 0 ? parsePriceBound(maximum) : null;
    if ((minimum.trim().length > 0 && min === null) || (maximum.trim().length > 0 && max === null)) return setPriceError("Enter nonnegative decimal values only.");
    if (min === null && max === null) return navigate(baselineQueryState);
    if (min !== null && max !== null && min > max) return setPriceError("The minimum must not exceed the maximum.");
    setPriceError(null);
    navigate({ kind: "price", ...(min !== null ? { minimum: min } : {}), ...(max !== null ? { maximum: max } : {}) });
  }

  const activeCategories = categoryIds(draft);
  const canCategory = draft.kind !== "price" && draft.kind !== "category-brand" && draft.kind !== "category-sort" && !(draft.kind === "categories" && draft.categoryIds.length === 2);
  const canBrand = draft.kind === "baseline" || draft.kind === "page-two" || draft.kind === "brand" || (draft.kind === "categories" && draft.categoryIds.length === 1) || draft.kind === "category-brand";
  const canPrice = draft.kind === "baseline" || draft.kind === "page-two" || draft.kind === "price";
  const sortOptions = draft.kind === "categories" && draft.categoryIds.length === 1 || draft.kind === "category-sort" ? ["default", "price"] : draft.kind === "price" || draft.kind === "brand" || draft.kind === "categories" && draft.categoryIds.length === 2 || draft.kind === "category-brand" ? [] : ["default", "price", "-price"];

  function sections() {
    return (
      <>
        {canCategory && (
          <fieldset className="space-y-2 border-t border-outline-subtle pt-4">
            <legend className="text-button uppercase tracking-wide text-text-secondary">Categories</legend>
            {categoryStatus === "ready" ? categories.map((option) => (
              <label key={option.id} className="flex min-h-11 items-center gap-3 text-body-small text-text-primary">
                <input checked={activeCategories.includes(option.id)} className="h-4 w-4 accent-brand-primary" disabled={activeCategories.length >= 2 && !activeCategories.includes(option.id)} onChange={(event) => toggleCategory(option.id, event.target.checked)} type="checkbox" />
                {option.name}
              </label>
            )) : <p className="text-body-small text-text-secondary">{categoryStatus === "error" ? "Categories are unavailable." : "No categories available."}</p>}
          </fieldset>
        )}
        {canBrand && (
          <fieldset className="space-y-2 border-t border-outline-subtle pt-4">
            <legend className="text-button uppercase tracking-wide text-text-secondary">Brand</legend>
            {draft.kind === "brand" || draft.kind === "category-brand" ? <p className="text-body-small text-text-secondary">{optionLabel(brands, draft.brandId, "Selected brand")}</p> : null}
            {brandStatus === "ready" ? <select aria-label="Brand" className="min-h-11 w-full rounded-md border border-outline-subtle bg-card px-3 text-body-small" value={draft.kind === "brand" || draft.kind === "category-brand" ? draft.brandId : ""} onChange={(event) => changeBrand(event.target.value)}>
              <option value="">Select a brand</option>{brands.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select> : <p className="text-body-small text-text-secondary">{brandStatus === "error" ? "Brands are unavailable." : "No brands available."}</p>}
          </fieldset>
        )}
        {canPrice && <PriceFields minimum={minimum} maximum={maximum} error={priceError} onMinimum={setMinimum} onMaximum={setMaximum} onSubmit={applyPrice} />}
      </>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 lg:mt-0">
        <div className="flex items-center gap-3 lg:ml-auto">
          {sortOptions.length > 0 && <label className="flex min-h-11 items-center gap-2 text-body-small text-text-secondary">Sort by<select aria-label="Sort products" className="min-h-11 rounded-md border border-outline-subtle bg-card px-3 text-body-small text-text-primary" value={sortValue()} onChange={(event) => changeSort(event.target.value)}>{sortOptions.map((option) => <option key={option} value={option}>{option === "default" ? "Default" : option === "price" ? "Price: low to high" : "Price: high to low"}</option>)}</select></label>}
          <button ref={triggerRef} className="inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-4 text-button text-text-primary lg:hidden" onClick={() => setOpen(true)} type="button">Filters{filterCount(query) > 0 ? ` (${filterCount(query)})` : ""}</button>
        </div>
      </div>
      <aside aria-label="Product filters" className="absolute left-0 top-32 hidden w-64 rounded-xl bg-surface-low p-4 lg:sticky lg:top-32 lg:block">{sections()}</aside>
      <dialog ref={dialogRef} aria-labelledby="catalog-filter-title" className="m-0 max-h-[90vh] w-full max-w-none rounded-t-2xl border-0 bg-card p-0 shadow-xl backdrop:bg-black/40 md:ml-auto md:mr-0 md:mt-0 md:h-full md:max-h-none md:w-[min(24rem,90vw)] md:rounded-none" hidden={!open} onCancel={(event) => { event.preventDefault(); closeDialog(); }} onClose={() => setOpen(false)}>
        <div className="flex max-h-[90vh] flex-col overflow-y-auto p-5 md:h-full md:max-h-none">
          <div className="flex items-center justify-between"><h2 className="text-heading-3 text-text-primary" id="catalog-filter-title">Filters</h2><button aria-label="Close filters" className="min-h-11 min-w-11 rounded-md text-heading-3" onClick={closeDialog} type="button">×</button></div>
          <div className="mt-5 space-y-5">{sections()}</div>
          <div className="mt-6 flex gap-3 border-t border-outline-subtle pt-4"><button className="min-h-11 flex-1 rounded-md border border-outline-subtle px-4 text-button" onClick={() => setDraft(baselineQueryState)} type="button">Clear all</button><button className="min-h-11 flex-1 rounded-md bg-brand-primary px-4 text-button text-on-primary" onClick={() => navigate(draft)} type="button">Apply filters</button></div>
        </div>
      </dialog>
      {query.kind === "sort" && <button className="sr-only" onClick={() => navigate(removeSort(query))} type="button">Clear sort</button>}
      {query.kind === "brand" && <button className="sr-only" onClick={() => navigate(removeBrand(query))} type="button">Clear brand</button>}
      {query.kind === "price" && <button className="sr-only" onClick={() => navigate(removePrice(query))} type="button">Clear price</button>}
    </>
  );
}

function PriceFields({ minimum, maximum, error, onMinimum, onMaximum, onSubmit }: { minimum: string; maximum: string; error: string | null; onMinimum: (value: string) => void; onMaximum: (value: string) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <form className="space-y-3 border-t border-outline-subtle pt-4" onSubmit={onSubmit}>
    <fieldset className="space-y-2"><legend className="text-button uppercase tracking-wide text-text-secondary">Price range</legend><label className="block text-body-small text-text-secondary">Minimum<input aria-label="Minimum price" className="mt-1 min-h-11 w-full rounded-md border border-outline-subtle bg-card px-3 text-body-small text-text-primary" inputMode="decimal" onChange={(event) => onMinimum(event.target.value)} value={minimum} /></label><label className="block text-body-small text-text-secondary">Maximum<input aria-label="Maximum price" className="mt-1 min-h-11 w-full rounded-md border border-outline-subtle bg-card px-3 text-body-small text-text-primary" inputMode="decimal" onChange={(event) => onMaximum(event.target.value)} value={maximum} /></label></fieldset>
    {error && <p aria-live="polite" className="text-body-small text-error-text" role="alert">{error}</p>}
    <button className="min-h-11 rounded-md bg-brand-primary px-4 text-button text-on-primary" type="submit">Apply price</button>
  </form>;
}
