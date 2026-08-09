// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { serializeProductQuery } from "@/lib/api/query/product-query.server";

describe("F05 product query serialization", () => {
  it.each([
    [{ kind: "limit", limit: 2 }, "limit=2"],
    [{ kind: "page", page: 2 }, "page=2"],
    [{ kind: "sort", sort: "-price" }, "sort=-price"],
    [{ kind: "price", minimum: 749, maximum: 2379 }, "price%5Bgte%5D=749&price%5Blte%5D=2379"],
    [{ kind: "brand", brandId: "brand-1" }, "brand=brand-1"],
    [{ kind: "categories", categoryIds: ["category-1", "category-2"] }, "category%5Bin%5D=category-1&category%5Bin%5D=category-2"],
    [{ kind: "category-sort", categoryId: "category-1", sort: "price" }, "category%5Bin%5D=category-1&sort=price"],
    [{ kind: "category-brand", categoryId: "category-1", brandId: "brand-1" }, "category%5Bin%5D=category-1&brand=brand-1"],
  ] as const)("serializes %j", (query, expected) => {
    expect(serializeProductQuery(query)).toEqual(new URLSearchParams(expected));
  });

  it("supports the omitted baseline", () => {
    expect(serializeProductQuery()).toEqual(new URLSearchParams());
  });

  it.each([
    { kind: "brand", brandId: " " },
    { kind: "price" },
    { kind: "price", minimum: 10, maximum: 1 },
    { kind: "price", minimum: Number.NaN },
    { kind: "price", minimum: -1 },
    { kind: "categories", categoryIds: ["category-1", "category-1"] },
    { kind: "categories", categoryIds: ["category-1", "category-2", "category-3"] },
    { kind: "keyword", keyword: "unsupported" },
    { kind: "brand", brandId: "brand-1", keyword: "unsupported" },
  ] as never[])("rejects unsupported or invalid query %j", (query) => {
    expect(() => serializeProductQuery(query)).toThrow("catalog request was invalid");
  });
});
