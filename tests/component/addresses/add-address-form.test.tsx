import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/addresses/actions/add-address.action", () => ({
  addAddressAction: vi.fn(),
}));

import { AddAddressForm } from "@/features/addresses/components/add-address-form";

afterEach(() => cleanup());

describe("AddAddressForm Component", () => {
  it("renders all 4 required address fields and submit button", () => {
    render(<AddAddressForm />);

    expect(screen.getByLabelText(/Address Label/i)).not.toBeNull();
    expect(screen.getByLabelText(/Street Address & Details/i)).not.toBeNull();
    expect(screen.getByLabelText(/City \/ Governorate/i)).not.toBeNull();
    expect(screen.getByLabelText(/Phone Number/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: "Save Address" })).not.toBeNull();
    expect(screen.getByRole("link", { name: "Cancel" }).getAttribute("href")).toBe("/account/addresses");
  });
});
