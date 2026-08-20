import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AddressList } from "@/features/addresses/components/address-list";
import type { Address } from "@/types/address";

afterEach(() => cleanup());

const mockAddresses: Address[] = [
  {
    id: "addr-1",
    name: "Home",
    details: "123 Nile Street",
    phone: "01012345678",
    city: "Cairo",
  },
  {
    id: "addr-2",
    name: "Work",
    details: "45 Smart Village",
    phone: "01098765432",
    city: "Giza",
  },
];

describe("AddressList Component", () => {
  it("renders empty state when addresses list is empty", () => {
    render(<AddressList addresses={[]} />);

    expect(screen.getByRole("heading", { name: "No saved addresses yet" })).not.toBeNull();
    expect(screen.queryByRole("region", { name: "Saved addresses list" })).toBeNull();
  });

  it("renders address cards and header count when populated", () => {
    render(<AddressList addresses={mockAddresses} />);

    expect(screen.getByRole("heading", { name: "Saved Addresses" })).not.toBeNull();
    expect(screen.getByText("2 saved addresses for deliveries")).not.toBeNull();
    expect(screen.getByRole("region", { name: "Saved addresses list" })).not.toBeNull();
    expect(screen.getByText("Home")).not.toBeNull();
    expect(screen.getByText("Work")).not.toBeNull();
  });
});
