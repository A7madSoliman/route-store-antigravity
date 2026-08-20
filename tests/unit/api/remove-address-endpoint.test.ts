// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedDeleteMock } = vi.hoisted(() => ({
  protectedDeleteMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedDelete: protectedDeleteMock,
}));

import { removeAddress } from "@/lib/api/endpoints/protected/remove-address.server";
import { ProtectedApiError } from "@/lib/api/errors.server";

beforeEach(() => {
  protectedDeleteMock.mockReset();
});

describe("removeAddress endpoint adapter", () => {
  it("deletes address and returns updated list", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 200,
      body: {
        status: "success",
        message: "Address removed successfully to your addresses",
        data: [
          {
            _id: "addr-2",
            name: "Work",
            details: "45 Smart Village",
            phone: "01098765432",
            city: "Giza",
          },
        ],
      },
    });

    const result = await removeAddress("addr-1");
    expect(protectedDeleteMock).toHaveBeenCalledWith(["addresses", "addr-1"]);
    expect(result.message).toBe("Address removed successfully to your addresses");
    expect(result.addresses).toHaveLength(1);
    expect(result.addresses[0].id).toBe("addr-2");
  });

  it("throws rejected error for empty addressId", async () => {
    await expect(removeAddress("")).rejects.toMatchObject({
      code: "rejected",
    });
  });

  it("maps 404 not found status to not-found error", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 404,
      body: { statusMsg: "fail", message: "Address not found" },
    });

    await expect(removeAddress("addr-999")).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it("maps 401 unauthorized status to unauthorized error", async () => {
    protectedDeleteMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(removeAddress("addr-1")).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps unavailable transport error to unavailable error", async () => {
    protectedDeleteMock.mockRejectedValueOnce(new ProtectedApiError("unavailable"));

    await expect(removeAddress("addr-1")).rejects.toMatchObject({
      code: "unavailable",
    });
  });
});
