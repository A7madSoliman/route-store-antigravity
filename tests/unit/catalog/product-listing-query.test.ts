import { describe, expect, it } from "vitest";
import {
  baselineQueryState,
  clearAllFilters,
  parseProductListingQuery,
  productListingHref,
  removeCategory,
} from "@/features/catalog/product-listing-query";

describe("C09 canonical product listing query states", () => {
  it.each([
    [{}, { kind: "baseline" }],
    [{ page: "2" }, { kind: "page-two" }],
    [{ sort: "price" }, { kind: "sort", sort: "price" }],
    [{ sort: "-price" }, { kind: "sort", sort: "-price" }],
    [{ "price[gte]": "10" }, { kind: "price", minimum: 10 }],
    [{ "price[lte]": "20" }, { kind: "price", maximum: 20 }],
    [{ "price[gte]": "10", "price[lte]": "20" }, { kind: "price", minimum: 10, maximum: 20 }],
    [{ brand: "brand/one" }, { kind: "brand", brandId: "brand/one" }],
    [{ "category[in]": "category/one" }, { kind: "categories", categoryIds: ["category/one"] }],
    [{ "category[in]": ["category/one", "category/two"] }, { kind: "categories", categoryIds: ["category/one", "category/two"] }],
    [{ "category[in]": "category/one", sort: "price" }, { kind: "category-sort", categoryId: "category/one" }],
    [{ "category[in]": "category/one", brand: "brand/one" }, { kind: "category-brand", categoryId: "category/one", brandId: "brand/one" }],
  ] as const)("parses %o", (raw, expected) => {
    expect(parseProductListingQuery(raw)).toEqual(expected);
  });

  it.each([
    { page: "3" }, { page: ["2", "2"] }, { sort: "name" }, { brand: "" }, { brand: ["a", "b"] },
    { "category[in]": "" }, { "category[in]": ["a", "a"] }, { "category[in]": ["a", "b", "c"] },
    { "category[in]": "a,b" }, { "price[gte]": "" }, { "price[gte]": "-1" }, { "price[gte]": ".5" },
    { "price[gte]": "1." }, { "price[gte]": "1e2" }, { "price[gte]": "Infinity" }, { "price[gte]": "10", "price[lte]": "2" },
    { page: "2", brand: "b" }, { brand: "b", sort: "price" }, { "category[in]": "c", sort: "-price" },
    { "category[in]": ["a", "b"], sort: "price" }, { "category[in]": ["a", "b"], brand: "b" }, { keyword: "shirt" }, { limit: "2" }, { unknown: "x" },
  ])("falls back to baseline for %o", (raw) => {
    expect(parseProductListingQuery(raw)).toEqual(baselineQueryState);
  });
});

describe("C09 canonical hrefs and transitions", () => {
  it.each([
    [{ kind: "baseline" }, "/products"],
    [{ kind: "page-two" }, "/products?page=2"],
    [{ kind: "sort", sort: "-price" }, "/products?sort=-price"],
    [{ kind: "price", minimum: 10, maximum: 20 }, "/products?price%5Bgte%5D=10&price%5Blte%5D=20"],
    [{ kind: "brand", brandId: "brand/one" }, "/products?brand=brand%2Fone"],
    [{ kind: "categories", categoryIds: ["a/b", "c d"] }, "/products?category%5Bin%5D=a%2Fb&category%5Bin%5D=c+d"],
    [{ kind: "category-sort", categoryId: "category-1" }, "/products?category%5Bin%5D=category-1&sort=price"],
  ] as const)("builds %o", (state, expected) => expect(productListingHref(state)).toBe(expected));

  it("removes one category while preserving the other", () => {
    const state = { kind: "categories", categoryIds: ["a", "b"] } as const;
    expect(removeCategory(state, "a")).toEqual({ kind: "categories", categoryIds: ["b"] });
    expect(productListingHref(removeCategory(state, "a"))).toBe("/products?category%5Bin%5D=b");
  });

  it("clears all state to baseline", () => expect(clearAllFilters()).toBe("/products"));
});
