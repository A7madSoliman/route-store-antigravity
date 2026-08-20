// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { ClearCartResponseSchema } from "@/lib/api/schemas/clear-cart-response.schema.server";

describe("ClearCartResponseSchema", () => {
  it("parses valid clear-cart response", () => {
    const raw = {
      message: "success",
    };

    const parsed = ClearCartResponseSchema.parse(raw);
    expect(parsed.message).toBe("success");
  });

  it("rejects non-string message", () => {
    expect(() =>
      ClearCartResponseSchema.parse({
        message: 123,
      }),
    ).toThrow();
  });
});
