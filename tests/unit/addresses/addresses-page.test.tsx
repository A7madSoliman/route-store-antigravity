import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { requireProtectedRouteMock, getAddressesMock } = vi.hoisted(() => ({
  requireProtectedRouteMock: vi.fn(),
  getAddressesMock: vi.fn(),
}));

vi.mock("@/lib/auth/protected-route.server", () => ({
  requireProtectedRoute: requireProtectedRouteMock,
}));

vi.mock("@/lib/api/endpoints/protected/addresses.server", () => ({
  getAddresses: getAddressesMock,
}));

import AddressesPage from "@/app/(account)/account/addresses/page";

afterEach(() => {
  cleanup();
  requireProtectedRouteMock.mockReset();
  getAddressesMock.mockReset();
});

describe("AddressesPage", () => {
  it("renders protected address list within account shell", async () => {
    requireProtectedRouteMock.mockResolvedValueOnce({
      user: { name: "Ahmed Soliman", email: "ahmed@example.com" },
    });
    getAddressesMock.mockResolvedValueOnce([
      {
        id: "addr-1",
        name: "Home",
        details: "123 Nile Street",
        phone: "01012345678",
        city: "Cairo",
      },
    ]);

    const pageElement = await AddressesPage();
    render(pageElement);

    expect(requireProtectedRouteMock).toHaveBeenCalledWith("/account/addresses");
    expect(getAddressesMock).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Saved Addresses" })).not.toBeNull();
    expect(screen.getByText("Home")).not.toBeNull();
  });
});
