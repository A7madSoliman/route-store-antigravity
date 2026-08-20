import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { requireProtectedRouteMock } = vi.hoisted(() => ({
  requireProtectedRouteMock: vi.fn(),
}));

vi.mock("@/lib/auth/protected-route.server", () => ({
  requireProtectedRoute: requireProtectedRouteMock,
}));

vi.mock("@/features/addresses/actions/add-address.action", () => ({
  addAddressAction: vi.fn(),
}));

import NewAddressPage from "@/app/(account)/account/addresses/new/page";

afterEach(() => {
  cleanup();
  requireProtectedRouteMock.mockReset();
});

describe("NewAddressPage", () => {
  it("renders protected new address page with form", async () => {
    requireProtectedRouteMock.mockResolvedValueOnce({
      user: { name: "Ahmed Soliman", email: "ahmed@example.com" },
    });

    const pageElement = await NewAddressPage();
    render(pageElement);

    expect(requireProtectedRouteMock).toHaveBeenCalledWith("/account/addresses/new");
    expect(screen.getByRole("heading", { name: "Add New Address" })).not.toBeNull();
    expect(screen.getByLabelText(/Address Label/i)).not.toBeNull();
  });
});
