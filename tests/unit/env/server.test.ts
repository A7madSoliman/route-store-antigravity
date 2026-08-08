import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  EnvironmentValidationError,
  parseServerEnvironment,
} from "../../../lib/env/server";

const validEnvironment = {
  ECOMMERCE_API_BASE_URL: "https://ecommerce.routemisr.com/api/v1",
  APP_ORIGIN: "http://localhost:3000",
};

function parse(overrides: Record<string, string | undefined> = {}) {
  return parseServerEnvironment({ ...validEnvironment, ...overrides });
}

describe("server environment validation", () => {
  it("accepts the verified API base and localhost origin", () => {
    expect(parse()).toEqual({
      ecommerceApiBaseUrl: "https://ecommerce.routemisr.com/api/v1",
      appOrigin: "http://localhost:3000",
    });
  });

  it("normalizes an API trailing slash", () => {
    expect(
      parse({ ECOMMERCE_API_BASE_URL: "https://ecommerce.routemisr.com/api/v1/" }),
    ).toMatchObject({ ecommerceApiBaseUrl: "https://ecommerce.routemisr.com/api/v1" });
  });

  it.each([
    ["ECOMMERCE_API_BASE_URL", undefined],
    ["APP_ORIGIN", undefined],
  ])("rejects a missing %s", (name, value) => {
    expect(() => parse({ [name]: value })).toThrow(EnvironmentValidationError);
  });

  it.each([
    "relative/path",
    "https://example.com/api/v1",
    "https://ecommerce.routemisr.com/wrong",
    "https://ecommerce.routemisr.com/api/v1?debug=true",
    "https://user:password@ecommerce.routemisr.com/api/v1",
  ])("rejects an invalid API base: %s", (value) => {
    expect(() => parse({ ECOMMERCE_API_BASE_URL: value })).toThrow(EnvironmentValidationError);
  });

  it.each([
    "https://example.com/app",
    "https://example.com/?returnTo=/checkout",
    "https://example.com/#fragment",
    "https://user:password@example.com",
    "http://example.com",
  ])("rejects an invalid application origin: %s", (value) => {
    expect(() => parse({ APP_ORIGIN: value })).toThrow(EnvironmentValidationError);
  });

  it("allows an HTTPS external origin", () => {
    expect(parse({ APP_ORIGIN: "https://store.example.com/" }).appOrigin).toBe(
      "https://store.example.com",
    );
  });

  it("does not expose unrelated environment values in errors", () => {
    const secret = "do-not-expose-this-value";

    try {
      parse({ APP_ORIGIN: `https://user:${secret}@example.com` });
      throw new Error("expected validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(EnvironmentValidationError);
      expect((error as Error).message).not.toContain(secret);
    }
  });
});
