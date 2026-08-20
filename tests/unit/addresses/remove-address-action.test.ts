// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { removeAddressMock, requireSessionMock, revalidatePathMock } = vi.hoisted(() => ({
  removeAddressMock: vi.fn(),
  requireSessionMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/api/endpoints/protected/remove-address.server", () => ({
  removeAddress: removeAddressMock,
  RemoveAddressApiError: class RemoveAddressApiError extends Error {
    constructor(readonly code: string) {
      super();
      this.name = "RemoveAddressApiError";
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

import { removeAddressAction } from "@/features/addresses/actions/remove-address.action";
import { RemoveAddressApiError } from "@/lib/api/endpoints/protected/remove-address.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

beforeEach(() => {
  removeAddressMock.mockReset();
  requireSessionMock.mockReset();
  revalidatePathMock.mockReset();
});

describe("removeAddressAction", () => {
  it("removes address and revalidates path on success", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Ahmed", email: "ahmed@example.com" },
    });
    removeAddressMock.mockResolvedValueOnce({
      message: "Address removed successfully to your addresses",
      addresses: [],
    });

    const formData = new FormData();
    formData.append("addressId", "addr-1");

    const result = await removeAddressAction({ status: "idle" }, formData);

    expect(requireSessionMock).toHaveBeenCalled();
    expect(removeAddressMock).toHaveBeenCalledWith("addr-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/account/addresses");
    expect(result.status).toBe("success");
  });

  it("returns unauthorized status when unauthenticated", async () => {
    requireSessionMock.mockRejectedValueOnce(new SessionRequiredError());

    const formData = new FormData();
    formData.append("addressId", "addr-1");

    const result = await removeAddressAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "unauthorized",
      message: "You must be signed in to manage your addresses.",
    });
    expect(removeAddressMock).not.toHaveBeenCalled();
  });

  it("returns error status for missing addressId", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Ahmed", email: "ahmed@example.com" },
    });

    const formData = new FormData();

    const result = await removeAddressAction({ status: "idle" }, formData);
    expect(result).toEqual({
      status: "error",
      message: "Invalid address selection.",
    });
    expect(removeAddressMock).not.toHaveBeenCalled();
  });

  it("returns error status on endpoint rejection", async () => {
    requireSessionMock.mockResolvedValueOnce({
      user: { name: "Ahmed", email: "ahmed@example.com" },
    });
    removeAddressMock.mockRejectedValueOnce(new RemoveAddressApiError("unavailable"));

    const formData = new FormData();
    formData.append("addressId", "addr-1");

    const result = await removeAddressAction({ status: "idle" }, formData);
    expect(result.status).toBe("error");
  });
});
