// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AddAddressInputSchema,
  AddAddressResponseSchema,
} from "@/lib/api/schemas/add-address-response.schema.server";

describe("AddAddressInputSchema", () => {
  it("parses valid input", () => {
    const raw = {
      name: "Home",
      details: "123 Nile Street",
      phone: "01012345678",
      city: "Cairo",
    };

    const parsed = AddAddressInputSchema.parse(raw);
    expect(parsed.name).toBe("Home");
    expect(parsed.details).toBe("123 Nile Street");
  });

  it("rejects empty fields", () => {
    expect(() =>
      AddAddressInputSchema.parse({
        name: "",
        details: "123 Nile Street",
        phone: "01012345678",
        city: "Cairo",
      }),
    ).toThrow();
  });
});

describe("AddAddressResponseSchema", () => {
  it("parses valid add address response", () => {
    const raw = {
      status: "success",
      message: "Address added successfully to your addresses",
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

    const parsed = AddAddressResponseSchema.parse(raw);
    expect(parsed.status).toBe("success");
    expect(parsed.message).toBe("Address added successfully to your addresses");
    expect(parsed.data).toHaveLength(1);
  });
});
