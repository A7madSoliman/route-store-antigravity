import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AddressEmpty } from "@/features/addresses/components/address-empty";

afterEach(() => cleanup());

describe("AddressEmpty Component", () => {
  it("renders empty state heading and add address button", () => {
    render(<AddressEmpty />);

    expect(screen.getByRole("heading", { name: "No saved addresses yet" })).not.toBeNull();
    const link = screen.getByRole("link", { name: "+ Add New Address" });
    expect(link.getAttribute("href")).toBe("/account/addresses/new");
  });
});
