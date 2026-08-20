import "server-only";

import type { Address } from "@/types/address";
import type { GetAddressesResponse } from "@/lib/api/schemas/get-addresses-response.schema.server";

export function adaptAddressesResponse(response: GetAddressesResponse): Address[] {
  if (!response || !Array.isArray(response.data)) {
    return [];
  }

  return response.data
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      id: item._id || "",
      name: item.name || "",
      details: item.details || "",
      phone: item.phone || "",
      city: item.city || "",
    }));
}
