// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { normalizeApiImageGallery, normalizeApiImageUrl } from "@/lib/media/api-image.server";

describe("API media normalization", () => {
  it("accepts only the exact approved HTTPS origin", () => {
    expect(normalizeApiImageUrl("https://ecommerce.routemisr.com/media/image.webp")).toBe(
      "https://ecommerce.routemisr.com/media/image.webp",
    );
  });

  it.each([
    "http://ecommerce.routemisr.com/image.webp",
    "https://cdn.ecommerce.routemisr.com/image.webp",
    "https://ecommerce.routemisr.com:444/image.webp",
    "https://user:password@ecommerce.routemisr.com/image.webp",
    "not-a-url",
    null,
  ])("rejects %j", (value) => {
    expect(normalizeApiImageUrl(value)).toBeNull();
  });

  it("filters invalid gallery entries", () => {
    expect(normalizeApiImageGallery([
      "https://ecommerce.routemisr.com/one.webp",
      "https://wrong.example/two.webp",
      "https://ecommerce.routemisr.com/three.webp",
    ])).toEqual([
      "https://ecommerce.routemisr.com/one.webp",
      "https://ecommerce.routemisr.com/three.webp",
    ]);
  });
});
