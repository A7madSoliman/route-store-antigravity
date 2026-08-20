import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/addresses/actions/remove-address.action", () => ({
  removeAddressAction: vi.fn(),
}));

import { AddressCard } from "@/features/addresses/components/address-card";
import type { Address } from "@/types/address";

afterEach(() => cleanup());

const mockAddress: Address = {
  id: "addr-1",
  name: "Home",
  details: "123 Nile Street, Building 4, Apt 12",
  phone: "01012345678",
  city: "Cairo",
};

describe("AddressCard Component", () => {
  it("renders address name, details, city, phone number, and remove button", () => {
    render(<AddressCard address={mockAddress} />);

    expect(screen.getByText("Home")).not.toBeNull();
    expect(screen.getByText("123 Nile Street, Building 4, Apt 12")).not.toBeNull();
    expect(screen.getByText("Cairo")).not.toBeNull();
    expect(screen.getByText("01012345678")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Remove address Home" })).not.toBeNull();
  });
});
