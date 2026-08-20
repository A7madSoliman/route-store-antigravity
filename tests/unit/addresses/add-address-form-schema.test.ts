// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { parseAddAddressFormData } from "@/features/addresses/schemas/add-address-form.schema.server";

describe("parseAddAddressFormData", () => {
  it("parses valid FormData", () => {
    const formData = new FormData();
    formData.append("name", "Home");
    formData.append("details", "123 Nile Street");
    formData.append("phone", "01012345678");
    formData.append("city", "Cairo");

    const result = parseAddAddressFormData(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Home");
      expect(result.data.details).toBe("123 Nile Street");
      expect(result.data.phone).toBe("01012345678");
      expect(result.data.city).toBe("Cairo");
    }
  });

  it("returns field errors for empty values", () => {
    const formData = new FormData();
    formData.append("name", "");
    formData.append("details", "");
    formData.append("phone", "");
    formData.append("city", "");

    const result = parseAddAddressFormData(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.name).toBeDefined();
      expect(result.fieldErrors.details).toBeDefined();
      expect(result.fieldErrors.phone).toBeDefined();
      expect(result.fieldErrors.city).toBeDefined();
    }
  });
});
