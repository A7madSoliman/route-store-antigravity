// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/api/endpoints/public/brands.server", () => ({ getBrands: vi.fn() }));

import { getBrands } from "@/lib/api/endpoints/public/brands.server";
import { PublicApiError } from "@/lib/api/errors.server";
import { loadBrandDirectory } from "@/features/catalog/brand-directory-data.server";

const brand = { id: "brand/one", name: "Brand One", slug: "brand-one", imageUrl: null } as const;
const page = { items: [brand], total: 1, pagination: { currentPage: 1, numberOfPages: 1, limit: 40 } } as const;

beforeEach(() => vi.clearAllMocks());

describe("C08 brand directory loader", () => {
  it("calls getBrands exactly once without arguments", async () => {
    vi.mocked(getBrands).mockResolvedValue(page);
    await expect(loadBrandDirectory()).resolves.toEqual({ status: "ready", page });
    expect(getBrands).toHaveBeenCalledOnce();
    expect(getBrands).toHaveBeenCalledWith();
  });

  it("keeps an empty collection distinct", async () => {
    vi.mocked(getBrands).mockResolvedValue({ ...page, items: [], total: 0 });
    await expect(loadBrandDirectory()).resolves.toEqual({ status: "empty" });
  });

  it.each(["not-found", "invalid-request", "unavailable", "upstream-failure", "invalid-response"] as const)("maps known %s errors to a safe collection error", async (code) => {
    vi.mocked(getBrands).mockRejectedValue(new PublicApiError(code));
    await expect(loadBrandDirectory()).resolves.toEqual({ status: "error" });
  });

  it("rethrows unexpected errors", async () => {
    vi.mocked(getBrands).mockRejectedValue(new Error("programming failure"));
    await expect(loadBrandDirectory()).rejects.toThrow("programming failure");
  });
});
