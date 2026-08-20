// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { protectedGetMock } = vi.hoisted(() => ({
  protectedGetMock: vi.fn(),
}));

vi.mock("@/lib/api/transport/protected-request.server", () => ({
  protectedGet: protectedGetMock,
}));

import { getAddresses } from "@/lib/api/endpoints/protected/addresses.server";
import { ProtectedApiError } from "@/lib/api/errors.server";

beforeEach(() => {
  protectedGetMock.mockReset();
});

describe("getAddresses endpoint adapter", () => {
  it("fetches and adapts populated addresses data", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "success",
      results: 1,
      data: [
        {
          _id: "addr-1",
          name: "Home",
          details: "123 Nile Street",
          phone: "01012345678",
          city: "Cairo",
        },
      ],
    });

    const result = await getAddresses();
    expect(protectedGetMock).toHaveBeenCalledWith(["addresses"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("addr-1");
    expect(result[0].name).toBe("Home");
  });

  it("handles 404 upstream status by returning an empty array", async () => {
    protectedGetMock.mockRejectedValueOnce(new ProtectedApiError("upstream-failure", 404));

    const result = await getAddresses();
    expect(result).toEqual([]);
  });

  it("maps 401 unauthorized status to unauthorized error", async () => {
    protectedGetMock.mockRejectedValueOnce(new ProtectedApiError("upstream-failure", 401));

    await expect(getAddresses()).rejects.toMatchObject({
      code: "unauthorized",
    });
  });

  it("maps unavailable transport error to unavailable error", async () => {
    protectedGetMock.mockRejectedValueOnce(new ProtectedApiError("unavailable"));

    await expect(getAddresses()).rejects.toMatchObject({
      code: "unavailable",
    });
  });

  it("maps malformed status payload to invalid-response error", async () => {
    protectedGetMock.mockResolvedValueOnce({
      status: "fail",
      data: [],
    });

    await expect(getAddresses()).rejects.toMatchObject({
      code: "invalid-response",
    });
  });
});
