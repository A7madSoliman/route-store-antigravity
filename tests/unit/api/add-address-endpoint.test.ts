// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedPostJsonMock } = vi.hoisted(() => ({
  protectedPostJsonMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedPostJson: protectedPostJsonMock,
}));

import { addAddress } from "@/lib/api/endpoints/protected/add-address.server";
import { ProtectedApiError } from "@/lib/api/errors.server";

import addAddressFixture from "../../fixtures/api/add-address.success.json";

beforeEach(() => {
  protectedPostJsonMock.mockReset();
});

describe("addAddress endpoint adapter", () => {
  it("submits valid payload and returns updated addresses using fixture", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 200,
      body: addAddressFixture,
    });

    const result = await addAddress({
      name: "Home",
      details: "123 Nile Street",
      phone: "01012345678",
      city: "Cairo",
    });

    expect(protectedPostJsonMock).toHaveBeenCalledWith(["addresses"], {
      name: "Home",
      details: "123 Nile Street",
      phone: "01012345678",
      city: "Cairo",
    });
    expect(result.message).toBe(addAddressFixture.message);
    expect(result.addresses).toHaveLength(1);
    expect(result.addresses[0].id).toBe(addAddressFixture.data[0]._id);
  });

  it("maps 401 unauthorized status to unauthorized error", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 401,
      body: { statusMsg: "fail", message: "You are not logged in" },
    });

    await expect(
      addAddress({
        name: "Home",
        details: "123 Nile Street",
        phone: "01012345678",
        city: "Cairo",
      }),
    ).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps 400 validation status to rejected error", async () => {
    protectedPostJsonMock.mockResolvedValueOnce({
      status: 400,
      body: { statusMsg: "fail", message: "Invalid payload" },
    });

    await expect(
      addAddress({
        name: "Home",
        details: "123 Nile Street",
        phone: "01012345678",
        city: "Cairo",
      }),
    ).rejects.toMatchObject({
      code: "rejected",
    });
  });

  it("maps unavailable transport error to unavailable error", async () => {
    protectedPostJsonMock.mockRejectedValueOnce(new ProtectedApiError("unavailable"));

    await expect(
      addAddress({
        name: "Home",
        details: "123 Nile Street",
        phone: "01012345678",
        city: "Cairo",
      }),
    ).rejects.toMatchObject({
      code: "unavailable",
    });
  });
});
