// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { RemoveAddressResponseSchema } from "@/lib/api/schemas/remove-address-response.schema.server";

describe("RemoveAddressResponseSchema", () => {
  it("parses valid remove address response", () => {
    const raw = {
      status: "success",
      message: "Address removed successfully to your addresses",
      data: [
        {
          _id: "addr-2",
          name: "Work",
          details: "45 Smart Village",
          phone: "01098765432",
          city: "Giza",
        },
      ],
    };

    const parsed = RemoveAddressResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.message).toBe("Address removed successfully to your addresses");
    expect(parsed.data).toHaveLength(1);
    expect(parsed.data[0]._id).toBe("addr-2");
  });

  it("handles empty remaining data array", () => {
    const raw = {
      status: "success",
      message: "Address removed successfully to your addresses",
      data: [],
    };

    const parsed = RemoveAddressResponseSchema.parse(raw);
    expect(parsed.data).toEqual([]);
  });
});
