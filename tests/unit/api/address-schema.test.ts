// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AddressItemSchema,
  GetAddressesResponseSchema,
} from "@/lib/api/schemas/get-addresses-response.schema.server";

describe("GetAddressesResponseSchema", () => {
  it("parses valid address item", () => {
    const raw = {
      _id: "addr-123",
      name: "Home",
      details: "123 Main St",
      phone: "01012345678",
      city: "Cairo",
    };

    const parsed = AddressItemSchema.parse(raw);
    expect(parsed._id).toBe("addr-123");
    expect(parsed.name).toBe("Home");
    expect(parsed.details).toBe("123 Main St");
    expect(parsed.phone).toBe("01012345678");
    expect(parsed.city).toBe("Cairo");
  });

  it("parses valid populated addresses response", () => {
    const raw = {
      status: "success",
      results: 1,
      data: [
        {
          _id: "addr-1",
          name: "Home",
          details: "123 Nile Street",
          phone: "01012345678",
          city: "Cairo",
        },
      ],
    };

    const parsed = GetAddressesResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.results).toBe(1);
    expect(parsed.data).toHaveLength(1);
    expect(parsed.data[0]._id).toBe("addr-1");
  });

  it("parses valid empty addresses response", () => {
    const raw = {
      status: "success",
      results: 0,
      data: [],
    };

    const parsed = GetAddressesResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.data).toEqual([]);
  });
});
