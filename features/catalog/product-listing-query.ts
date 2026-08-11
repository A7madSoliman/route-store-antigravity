export type ProductListingSearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

export type ProductListingQueryState =
  | Readonly<{ kind: "baseline" }>
  | Readonly<{ kind: "page-two" }>
  | Readonly<{ kind: "sort"; sort: "price" | "-price" }>
  | Readonly<{ kind: "price"; minimum?: number; maximum?: number }>
  | Readonly<{ kind: "brand"; brandId: string }>
  | Readonly<{ kind: "categories"; categoryIds: readonly [string] | readonly [string, string] }>
  | Readonly<{ kind: "category-sort"; categoryId: string }>
  | Readonly<{ kind: "category-brand"; categoryId: string; brandId: string }>;

export const baselineQueryState: ProductListingQueryState = { kind: "baseline" };

const supportedKeys = new Set(["page", "sort", "price[gte]", "price[lte]", "brand", "category[in]"]);
const decimalPattern = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

function scalar(value: string | readonly string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

function nonBlank(value: string | null): value is string {
  return value !== null && value.trim().length > 0;
}

export function parsePriceBound(value: string | null): number | null {
  if (value === null || !decimalPattern.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function keysAreSupported(searchParams: ProductListingSearchParams): boolean {
  return Object.keys(searchParams).every((key) => supportedKeys.has(key));
}

export function parseProductListingQuery(searchParams: ProductListingSearchParams): ProductListingQueryState {
  if (!keysAreSupported(searchParams)) return baselineQueryState;

  const keys = Object.keys(searchParams);
  const page = searchParams.page;
  const sort = scalar(searchParams.sort);
  const brand = scalar(searchParams.brand);
  const minimumRaw = scalar(searchParams["price[gte]"]);
  const maximumRaw = scalar(searchParams["price[lte]"]);
  const categoriesRaw = searchParams["category[in]"];
  const categories = typeof categoriesRaw === "string" ? [categoriesRaw] : categoriesRaw;

  if (keys.length === 0) return baselineQueryState;
  if (keys.length === 1 && page === "2") return { kind: "page-two" };

  if (sort !== null && (sort === "price" || sort === "-price") && keys.length === 1) {
    return { kind: "sort", sort };
  }

  if ((minimumRaw !== null || maximumRaw !== null) && keys.every((key) => key === "price[gte]" || key === "price[lte]")) {
    const minimum = parsePriceBound(minimumRaw);
    const maximum = parsePriceBound(maximumRaw);
    if ((minimumRaw !== null && minimum === null) || (maximumRaw !== null && maximum === null)) return baselineQueryState;
    if (minimum === null && maximum === null) return baselineQueryState;
    if (minimum !== undefined && maximum !== undefined && minimum !== null && maximum !== null && minimum > maximum) return baselineQueryState;
    return { kind: "price", ...(minimum !== null ? { minimum } : {}), ...(maximum !== null ? { maximum } : {}) };
  }

  if (brand !== null && nonBlank(brand) && keys.length === 1) return { kind: "brand", brandId: brand };

  if (categories !== undefined && categories.length > 0 && categories.length <= 2 && categories.every(nonBlank) && categories.every((category) => !category.includes(",")) && new Set(categories).size === categories.length) {
    if (keys.length === 1) {
      return categories.length === 1
        ? { kind: "categories", categoryIds: [categories[0]] }
        : { kind: "categories", categoryIds: [categories[0], categories[1]] };
    }
    if (categories.length === 1 && sort === "price" && keys.length === 2) return { kind: "category-sort", categoryId: categories[0] };
    if (categories.length === 1 && brand !== null && nonBlank(brand) && keys.length === 2) return { kind: "category-brand", categoryId: categories[0], brandId: brand };
  }

  return baselineQueryState;
}

function appendCategories(params: URLSearchParams, categoryIds: readonly string[]) {
  categoryIds.forEach((categoryId) => params.append("category[in]", categoryId));
}

export function productListingHref(state: ProductListingQueryState): string {
  const params = new URLSearchParams();
  switch (state.kind) {
    case "baseline": break;
    case "page-two": params.set("page", "2"); break;
    case "sort": params.set("sort", state.sort); break;
    case "price":
      if (state.minimum !== undefined) params.set("price[gte]", String(state.minimum));
      if (state.maximum !== undefined) params.set("price[lte]", String(state.maximum));
      break;
    case "brand": params.set("brand", state.brandId); break;
    case "categories": appendCategories(params, state.categoryIds); break;
    case "category-sort": params.append("category[in]", state.categoryId); params.set("sort", "price"); break;
    case "category-brand": params.append("category[in]", state.categoryId); params.set("brand", state.brandId); break;
  }
  const query = params.toString();
  return query.length === 0 ? "/products" : `/products?${query}`;
}

export function clearAllFilters(): string { return productListingHref(baselineQueryState); }

export function removeCategory(state: ProductListingQueryState, categoryId: string): ProductListingQueryState {
  if (state.kind === "categories") {
    const remaining = state.categoryIds.filter((id) => id !== categoryId);
    return remaining.length === 1 ? { kind: "categories", categoryIds: [remaining[0]] } : baselineQueryState;
  }
  if (state.kind === "category-sort" && state.categoryId === categoryId) return { kind: "sort", sort: "price" };
  if (state.kind === "category-brand" && state.categoryId === categoryId) return { kind: "brand", brandId: state.brandId };
  return state;
}

export function removeBrand(state: ProductListingQueryState): ProductListingQueryState {
  if (state.kind === "brand") return baselineQueryState;
  if (state.kind === "category-brand") return { kind: "categories", categoryIds: [state.categoryId] };
  return state;
}

export function removeSort(state: ProductListingQueryState): ProductListingQueryState {
  if (state.kind === "sort") return baselineQueryState;
  if (state.kind === "category-sort") return { kind: "categories", categoryIds: [state.categoryId] };
  return state;
}

export function removePrice(state: ProductListingQueryState): ProductListingQueryState {
  return state.kind === "price" ? baselineQueryState : state;
}
