// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { addAddressMock, requireSessionMock, revalidatePathMock, redirectMock } = vi.hoisted(() => ({
  addAddressMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/add-address.server", () => ({
  addAddress: addAddressMock,
  AddAddressApiError: class AddAddressApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "AddAddressApiError";
    }
  },
}));

vi.mock("@/lib/auth/require-session.server", () => ({
  requireSession: requireSessionMock,
  SessionRequiredError: class SessionRequiredError extends Error {
    constructor() {
      super();
      this.name = "SessionRequiredError";
    }
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import { addAddressAction } from "@/features/addresses/actions/add-address.action";
import { AddAddressApiError } from "@/lib/api/endpoints/protected/add-address.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  addAddressMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
  redirectMock.mockReset();
});

describe("addAddressAction", () => {
  it("successfully creates address, revalidates and redirects", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Ahmed", email: "ahmed@example.com" },
    });
    addAddressMock.mockResolvedValueOnce({
      message: "Address added successfully to your addresses",
      addresses: [],
    });

    const formData = new FormData();
    formData.append("name", "Home");
    formData.append("details", "123 Nile Street");
    formData.append("phone", "01012345678");
    formData.append("city", "Cairo");

    await addAddressAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(addAddressMock).toHaveBeenCalledWith({
      name: "Home",
      details: "123 Nile Street",
      phone: "01012345678",
      city: "Cairo",
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/account/addresses");
    expect(redirectMock).toHaveBeenCalledWith("/account/addresses");
  });

  it("returns unauthorized status when unauthenticated", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.append("name", "Home");

    const result = await addAddressAction({ status: "idle" }, formData);
    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to add an address.",
    });
    expect(addAddressMock).not.toHaveBeenCalled();
  });

  it("returns invalid status when form fields fail validation", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Ahmed", email: "ahmed@example.com" },
    });

    const formData = new FormData();
    formData.append("name", "");

    const result = await addAddressAction({ status: "idle" }, formData);
    expect(result.status).toBe("invalid");
    expect(addAddressMock).not.toHaveBeenCalled();
  });

  it("returns error status when endpoint rejects mutation", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Ahmed", email: "ahmed@example.com" },
    });
    addAddressMock.mockRejectedValueOnce(new AddAddressApiError("rejected"));

    const formData = new FormData();
    formData.append("name", "Home");
    formData.append("details", "123 Nile Street");
    formData.append("phone", "01012345678");
    formData.append("city", "Cairo");

    const result = await addAddressAction({ status: "idle" }, formData);
    expect(result.status).toBe("error");
  });
});
