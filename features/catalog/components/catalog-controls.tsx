"use client";

import type { FormEvent, ReactNode } from "react";
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
  children?: ReactNode;
};

type FilterMode = "desktop" | "dialog";

function categoryIds(query: ProductListingQueryState): readonly string[] {
  return query.kind === "categories"
    ? query.categoryIds
    : query.kind === "category-sort" || query.kind === "category-brand"
      ? [query.categoryId]
      : [];
}

function nextCategoryState(query: ProductListingQueryState, id: string, checked: boolean): ProductListingQueryState {
  const selected = [...categoryIds(query)];
  if (checked) {
    if (selected.includes(id)) return query;
    if (query.kind === "brand") return { kind: "category-brand", categoryId: id, brandId: query.brandId };
    if (query.kind === "sort" && query.sort === "price") return { kind: "category-sort", categoryId: id };
    if (query.kind === "category-brand" || query.kind === "category-sort") return { ...query, categoryId: id };
    if (selected.length < 2) return { kind: "categories", categoryIds: selected.length === 0 ? [id] : [selected[0], id] };
    return query;
  }
  if (query.kind === "categories") {
    const remaining = selected.filter((value) => value !== id);
    return remaining.length === 0 ? baselineQueryState : { kind: "categories", categoryIds: [remaining[0]] };
  }
  if (query.kind === "category-brand") return { kind: "brand", brandId: query.brandId };
  if (query.kind === "category-sort") return { kind: "sort", sort: "price" };
  return query;
}

function nextBrandState(query: ProductListingQueryState, brandId: string): ProductListingQueryState {
  if (brandId.length === 0) return query;
  if (query.kind === "categories" && query.categoryIds.length === 1) return { kind: "category-brand", categoryId: query.categoryIds[0], brandId };
  if (query.kind === "category-brand") return { kind: "category-brand", categoryId: query.categoryId, brandId };
  return { kind: "brand", brandId };
}

function filterCount(query: ProductListingQueryState): number {
  if (query.kind === "categories") return query.categoryIds.length;
  if (query.kind === "category-sort" || query.kind === "category-brand") return 2;
  return query.kind === "brand" || query.kind === "price" ? 1 : 0;
}

function optionLabel(options: readonly FilterOption[], id: string, fallback: string): string {
  return options.find((option) => option.id === id)?.name ?? fallback;
}

export function CatalogControls({ query, categories, categoryStatus, brands, brandStatus, children = null }: CatalogControlsProps) {
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

  function resetDraft() {
    setDraft(query);
    setMinimum(query.kind === "price" && query.minimum !== undefined ? String(query.minimum) : "");
    setMaximum(query.kind === "price" && query.maximum !== undefined ? String(query.maximum) : "");
    setPriceError(null);
  }

  function closeDialog() {
    setOpen(false);
    resetDraft();
    triggerRef.current?.focus();
  }

  function updateCategory(mode: FilterMode, id: string, checked: boolean) {
    const current = mode === "desktop" ? query : draft;
    const next = nextCategoryState(current, id, checked);
    if (mode === "desktop") navigate(next);
    else setDraft(next);
  }

  function updateBrand(mode: FilterMode, brandId: string) {
    const current = mode === "desktop" ? query : draft;
    const next = nextBrandState(current, brandId);
    if (mode === "desktop") navigate(next);
    else setDraft(next);
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

  function applyPrice(mode: FilterMode, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const min = minimum.trim().length > 0 ? parsePriceBound(minimum) : null;
    const max = maximum.trim().length > 0 ? parsePriceBound(maximum) : null;
    if ((minimum.trim().length > 0 && min === null) || (maximum.trim().length > 0 && max === null)) return setPriceError("Enter nonnegative decimal values only.");
    if (min === null && max === null) return mode === "desktop" ? navigate(baselineQueryState) : setDraft(baselineQueryState);
    if (min !== null && max !== null && min > max) return setPriceError("The minimum must not exceed the maximum.");
    setPriceError(null);
    const next: ProductListingQueryState = { kind: "price", ...(min !== null ? { minimum: min } : {}), ...(max !== null ? { maximum: max } : {}) };
    if (mode === "desktop") navigate(next);
    else setDraft(next);
  }

  function sections(mode: FilterMode) {
    const state = mode === "desktop" ? query : draft;
    const activeCategories = categoryIds(state);
    const canCategory = state.kind !== "price" && state.kind !== "category-brand" && state.kind !== "category-sort" && !(state.kind === "categories" && state.categoryIds.length === 2);
    const canBrand = state.kind === "baseline" || state.kind === "page-two" || state.kind === "brand" || (state.kind === "categories" && state.categoryIds.length === 1) || state.kind === "category-brand";
    const canPrice = state.kind === "baseline" || state.kind === "page-two" || state.kind === "price";
    return (
      <>
        {canCategory && (
          <fieldset className="space-y-2 border-t border-outline-subtle pt-4">
            <legend className="text-button uppercase tracking-wide text-text-secondary">Categories</legend>
            {categoryStatus === "ready" ? categories.map((option) => (
              <label key={option.id} className="flex min-h-11 items-center gap-3 text-body-small text-text-primary">
                <input checked={activeCategories.includes(option.id)} className="h-4 w-4 accent-brand-primary" disabled={activeCategories.length >= 2 && !activeCategories.includes(option.id)} onChange={(event) => updateCategory(mode, option.id, event.target.checked)} type="checkbox" value={option.id} />
                {option.name}
              </label>
            )) : <p className="text-body-small text-text-secondary">{categoryStatus === "error" ? "Categories are unavailable." : "No categories available."}</p>}
          </fieldset>
        )}
        {canBrand && (
          <fieldset className="space-y-2 border-t border-outline-subtle pt-4">
            <legend className="text-button uppercase tracking-wide text-text-secondary">Brand</legend>
            {state.kind === "brand" || state.kind === "category-brand" ? <p className="text-body-small text-text-secondary">{optionLabel(brands, state.brandId, "Selected brand")}</p> : null}
            {brandStatus === "ready" ? <select aria-label="Brand" className="min-h-11 w-full rounded-md border border-outline-subtle bg-card px-3 text-body-small" value={state.kind === "brand" || state.kind === "category-brand" ? state.brandId : ""} onChange={(event) => updateBrand(mode, event.target.value)}>
              <option value="">Select a brand</option>{brands.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select> : <p className="text-body-small text-text-secondary">{brandStatus === "error" ? "Brands are unavailable." : "No brands available."}</p>}
          </fieldset>
        )}
        {canPrice && <PriceFields minimum={minimum} maximum={maximum} error={priceError} onMinimum={setMinimum} onMaximum={setMaximum} onSubmit={(event) => applyPrice(mode, event)} />}
      </>
    );
  }

  return (
    <div className="mt-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-6">
      <aside aria-label="Product filters" className="hidden w-64 rounded-xl bg-surface-low p-4 lg:sticky lg:top-32 lg:block">{sections("desktop")}</aside>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 lg:ml-auto">
            {(query.kind === "categories" && query.categoryIds.length === 1 || query.kind === "category-sort") ? <label className="flex min-h-11 items-center gap-2 text-body-small text-text-secondary">Sort by<select aria-label="Sort products" className="min-h-11 rounded-md border border-outline-subtle bg-card px-3 text-body-small text-text-primary" value={sortValue()} onChange={(event) => changeSort(event.target.value)}><option value="default">Default</option><option value="price">Price: low to high</option></select></label> : query.kind === "price" || query.kind === "brand" || query.kind === "categories" && query.categoryIds.length === 2 || query.kind === "category-brand" ? null : <label className="flex min-h-11 items-center gap-2 text-body-small text-text-secondary">Sort by<select aria-label="Sort products" className="min-h-11 rounded-md border border-outline-subtle bg-card px-3 text-body-small text-text-primary" value={sortValue()} onChange={(event) => changeSort(event.target.value)}><option value="default">Default</option><option value="price">Price: low to high</option><option value="-price">Price: high to low</option></select></label>}
            <button ref={triggerRef} className="inline-flex min-h-11 items-center rounded-md border border-outline-subtle px-4 text-button text-text-primary lg:hidden" onClick={() => setOpen(true)} type="button">Filters{filterCount(query) > 0 ? ` (${filterCount(query)})` : ""}</button>
          </div>
        </div>
        {children}
        {query.kind === "sort" && <button className="sr-only" onClick={() => navigate(removeSort(query))} type="button">Clear sort</button>}
        {query.kind === "brand" && <button className="sr-only" onClick={() => navigate(removeBrand(query))} type="button">Clear brand</button>}
        {query.kind === "price" && <button className="sr-only" onClick={() => navigate(removePrice(query))} type="button">Clear price</button>}
      </div>
      <dialog ref={dialogRef} aria-labelledby="catalog-filter-title" className="m-0 max-h-[90vh] w-full max-w-none rounded-t-2xl border-0 bg-card p-0 shadow-xl backdrop:bg-black/40 md:ml-auto md:mr-0 md:mt-0 md:h-full md:max-h-none md:w-[min(24rem,90vw)] md:rounded-none" hidden={!open} onCancel={(event) => { event.preventDefault(); closeDialog(); }} onClose={() => { setOpen(false); resetDraft(); }}>
        <div className="flex max-h-[90vh] flex-col overflow-y-auto p-5 md:h-full md:max-h-none">
          <div className="flex items-center justify-between"><h2 className="text-heading-3 text-text-primary" id="catalog-filter-title">Filters</h2><button aria-label="Close filters" className="min-h-11 min-w-11 rounded-md text-heading-3" onClick={closeDialog} type="button">×</button></div>
          <div className="mt-5 space-y-5">{sections("dialog")}</div>
          <div className="mt-6 flex gap-3 border-t border-outline-subtle pt-4"><button className="min-h-11 flex-1 rounded-md border border-outline-subtle px-4 text-button" onClick={() => { setDraft(baselineQueryState); setMinimum(""); setMaximum(""); setPriceError(null); }} type="button">Clear all</button><button className="min-h-11 flex-1 rounded-md bg-brand-primary px-4 text-button text-on-primary" onClick={() => navigate(draft)} type="button">Apply filters</button></div>
        </div>
      </dialog>
    </div>
  );
}

function PriceFields({ minimum, maximum, error, onMinimum, onMaximum, onSubmit }: { minimum: string; maximum: string; error: string | null; onMinimum: (value: string) => void; onMaximum: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="space-y-3 border-t border-outline-subtle pt-4" onSubmit={onSubmit}>
    <fieldset className="space-y-2"><legend className="text-button uppercase tracking-wide text-text-secondary">Price range</legend><label className="block text-body-small text-text-secondary">Minimum<input aria-label="Minimum price" className="mt-1 min-h-11 w-full rounded-md border border-outline-subtle bg-card px-3 text-body-small text-text-primary" inputMode="decimal" onChange={(event) => onMinimum(event.target.value)} value={minimum} /></label><label className="block text-body-small text-text-secondary">Maximum<input aria-label="Maximum price" className="mt-1 min-h-11 w-full rounded-md border border-outline-subtle bg-card px-3 text-body-small text-text-primary" inputMode="decimal" onChange={(event) => onMaximum(event.target.value)} value={maximum} /></label></fieldset>
    {error && <p aria-live="polite" className="text-body-small text-error-text" role="alert">{error}</p>}
    <button className="min-h-11 rounded-md bg-brand-primary px-4 text-button text-on-primary" type="submit">Apply price</button>
  </form>;
}
