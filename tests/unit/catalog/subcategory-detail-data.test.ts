// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/subcategories.server", () => ({ getSubcategory: vi.fn() }));

const navigation = vi.hoisted(() => ({ notFound: vi.fn(() => { throw new Error("NOT_FOUND_SIGNAL"); }) }));
vi.mock("next/navigation", () => navigation);

import { getSubcategory } from "@/lib/api/endpoints/public/subcategories.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { loadSubcategoryDetail } from "@/features/catalog/subcategory-detail-data.server";

const subcategory = { id: "subcategory/one", name: "Subcategory One", slug: "subcategory-one", categoryId: "category-1" } as const;

beforeEach(() => vi.clearAllMocks());

describe("C07 subcategory detail loader", () => {
  it("forwards an opaque route ID unchanged and calls getSubcategory once", async () => {
    vi.mocked(getSubcategory).mockResolvedValue(subcategory);
    await expect(loadSubcategoryDetail("subcategory/id with space")).resolves.toEqual({ status: "ready", subcategory });
    expect(getSubcategory).toHaveBeenCalledOnce();
    expect(getSubcategory).toHaveBeenCalledWith("subcategory/id with space");
  });

  it("maps only not-found to the framework not-found boundary", async () => {
    vi.mocked(getSubcategory).mockRejectedValue(new PublicApiError("not-found"));
    await expect(loadSubcategoryDetail("missing-id")).rejects.toThrow("NOT_FOUND_SIGNAL");
    expect(navigation.notFound).toHaveBeenCalledOnce();
  });

  it.each(["invalid-request", "unavailable", "upstream-failure", "invalid-response"] as const)("keeps %s as a safe unavailable state", async (code) => {
    vi.mocked(getSubcategory).mockRejectedValue(new PublicApiError(code));
    await expect(loadSubcategoryDetail("opaque-id")).resolves.toEqual({ status: "error" });
    expect(navigation.notFound).not.toHaveBeenCalled();
  });

  it("rethrows unexpected errors", async () => {
    vi.mocked(getSubcategory).mockRejectedValue(new Error("programming failure"));
    await expect(loadSubcategoryDetail("opaque-id")).rejects.toThrow("programming failure");
  });
});
