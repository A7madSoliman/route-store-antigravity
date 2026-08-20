import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/addresses/actions/remove-address.action", () => ({
  removeAddressAction: vi.fn(),
}));

import { RemoveAddressButton } from "@/features/addresses/components/remove-address-button";

afterEach(() => cleanup());

describe("RemoveAddressButton Component", () => {
  it("renders delete button with accessible label and hidden input", () => {
    render(<RemoveAddressButton addressId="addr-1" addressName="Home" />);

    const button = screen.getByRole("button", { name: "Remove address Home" });
    expect(button).not.toBeNull();
    const hiddenInput = document.querySelector('input[name="addressId"]') as HTMLInputElement;
    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput.value).toBe("addr-1");
  });
});
