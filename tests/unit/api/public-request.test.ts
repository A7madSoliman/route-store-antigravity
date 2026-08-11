// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { PublicApiError } from "@/lib/api/errors.server";
import { publicGet, publicPostJson } from "@/lib/api/transport/public-request.server";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubEnv("ECOMMERCE_API_BASE_URL", "https://ecommerce.routemisr.com/api/v1");
  vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

describe("public GET transport", () => {
  it("preserves the base path, encodes segments, and sends a bodyless request", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await publicGet(["products", "id/with space"], new URLSearchParams([["brand", "brand-1"]]));

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe(
      "https://ecommerce.routemisr.com/api/v1/products/id%2Fwith%20space?brand=brand-1",
    );
    expect(init).toMatchObject({
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      cache: "no-store",
    });
    expect(init).not.toHaveProperty("body");
    expect(init).toHaveProperty("headers", { Accept: "application/json" });
    expect(init.headers).not.toHaveProperty("token");
    expect(init.headers).not.toHaveProperty("Authorization");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    [404, "not-found"],
    [400, "upstream-failure"],
    [302, "upstream-failure"],
  ] as const)("maps HTTP %s to %s without reading the body", async (status, code) => {
    const response = new Response("private upstream body", { status });
    const bodySpy = vi.spyOn(response, "json");
    fetchMock.mockResolvedValue(response);

    await expect(publicGet(["products"])).rejects.toMatchObject({ code, status });
    expect(bodySpy).not.toHaveBeenCalled();
  });

  it("maps invalid JSON, network errors, and aborts to safe errors", async () => {
    fetchMock.mockResolvedValue(new Response("not-json", { status: 200 }));
    await expect(publicGet(["products"])).rejects.toMatchObject({ code: "invalid-response" });

    fetchMock.mockRejectedValueOnce(new TypeError("https://secret.example/raw"));
    await expect(publicGet(["products"])).rejects.toMatchObject({ code: "unavailable" });

    fetchMock.mockRejectedValueOnce(new DOMException("timed out", "TimeoutError"));
    await expect(publicGet(["products"])).rejects.toMatchObject({ code: "unavailable" });
  });

  it("uses the approved timeout and never retries", async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockRejectedValue(new DOMException("timed out", "TimeoutError"));

    await expect(publicGet(["products"])).rejects.toBeInstanceOf(PublicApiError);
    expect(timeoutSpy).toHaveBeenCalledWith(10_000);
    expect(fetchMock).toHaveBeenCalledOnce();
    timeoutSpy.mockRestore();
  });

  it("rejects invalid path segments before fetch", async () => {
    await expect(publicGet(["products", " "])).rejects.toMatchObject({ code: "invalid-request" });
    await expect(publicGet([])).rejects.toMatchObject({ code: "invalid-request" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("public POST JSON transport", () => {
  it("sends the exact safe request shape once", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ token: "synthetic" }), { status: 201 }));
    await expect(publicPostJson(["auth", "signup"], { name: "N", email: "E", password: "P", rePassword: "P", phone: "1" })).resolves.toMatchObject({ status: 201 });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("https://ecommerce.routemisr.com/api/v1/auth/signup");
    expect(init).toMatchObject({ method: "POST", credentials: "omit", redirect: "manual", cache: "no-store", body: JSON.stringify({ name: "N", email: "E", password: "P", rePassword: "P", phone: "1" }) });
    expect(init.headers).toEqual({ Accept: "application/json", "Content-Type": "application/json" });
    expect(init.headers).not.toHaveProperty("token");
    expect(init.headers).not.toHaveProperty("Authorization");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("does not read non-success bodies and never retries", async () => {
    const response = new Response("submitted customer data", { status: 409 });
    const bodySpy = vi.spyOn(response, "json");
    fetchMock.mockResolvedValue(response);
    await expect(publicPostJson(["auth", "signup"], { name: "N", email: "E", password: "P", rePassword: "P", phone: "1" })).rejects.toMatchObject({ status: 409 });
    expect(bodySpy).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("maps invalid success JSON and timeout safely", async () => {
    fetchMock.mockResolvedValue(new Response("not-json", { status: 201 }));
    await expect(publicPostJson(["auth", "signup"], { name: "N", email: "E", password: "P", rePassword: "P", phone: "1" })).rejects.toMatchObject({ code: "invalid-response" });
    fetchMock.mockRejectedValue(new DOMException("timed out", "TimeoutError"));
    await expect(publicPostJson(["auth", "signup"], { name: "N", email: "E", password: "P", rePassword: "P", phone: "1" })).rejects.toMatchObject({ code: "unavailable" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
