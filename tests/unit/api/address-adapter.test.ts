// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { adaptAddressesResponse } from "@/lib/api/adapters/address.adapter.server";
import type { GetAddressesResponse } from "@/lib/api/schemas/get-addresses-response.schema.server";

describe("adaptAddressesResponse", () => {
  it("maps valid response to domain Address[]", () => {
    const response: GetAddressesResponse = {
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

    const adapted = adaptAddressesResponse(response);
    expect(adapted).toEqual([
      {
        id: "addr-1",
        name: "Home",
        details: "123 Nile Street",
        phone: "01012345678",
        city: "Cairo",
      },
    ]);
  });

  it("handles empty data gracefully", () => {
    const response: GetAddressesResponse = {
      status: "success",
      results: 0,
      data: [],
    };

    const adapted = adaptAddressesResponse(response);
    expect(adapted).toEqual([]);
  });
});
