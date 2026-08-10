// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/brands.server", () => ({ getBrand: vi.fn() }));

const navigation = vi.hoisted(() => ({ notFound: vi.fn(() => { throw new Error("NOT_FOUND_SIGNAL"); }) }));
vi.mock("next/navigation", () => navigation);

import { getBrand } from "@/lib/api/endpoints/public/brands.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { loadBrandDetail } from "@/features/catalog/brand-detail-data.server";

const brand = { id: "brand/one", name: "Brand One", slug: "brand-one", imageUrl: null } as const;

beforeEach(() => vi.clearAllMocks());

describe("C08 brand detail loader", () => {
  it("forwards an opaque route ID unchanged and calls getBrand once", async () => {
    vi.mocked(getBrand).mockResolvedValue(brand);
    await expect(loadBrandDetail("brand/id with space")).resolves.toEqual({ status: "ready", brand });
    expect(getBrand).toHaveBeenCalledOnce();
    expect(getBrand).toHaveBeenCalledWith("brand/id with space");
  });

  it("maps only not-found to the framework not-found boundary", async () => {
    vi.mocked(getBrand).mockRejectedValue(new PublicApiError("not-found"));
    await expect(loadBrandDetail("missing-id")).rejects.toThrow("NOT_FOUND_SIGNAL");
    expect(navigation.notFound).toHaveBeenCalledOnce();
  });

  it.each(["invalid-request", "unavailable", "upstream-failure", "invalid-response"] as const)("keeps %s as a safe unavailable state", async (code) => {
    vi.mocked(getBrand).mockRejectedValue(new PublicApiError(code));
    await expect(loadBrandDetail("opaque-id")).resolves.toEqual({ status: "error" });
    expect(navigation.notFound).not.toHaveBeenCalled();
  });

  it("rethrows unexpected errors", async () => {
    vi.mocked(getBrand).mockRejectedValue(new Error("programming failure"));
    await expect(loadBrandDetail("opaque-id")).rejects.toThrow("programming failure");
  });
});
