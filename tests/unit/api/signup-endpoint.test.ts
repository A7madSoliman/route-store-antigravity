// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/api/transport/public-request.server", () => ({ publicPostJson: post }));
import { signUp } from "@/lib/api/endpoints/public/signup.server";

beforeEach(() => post.mockReset());

describe("signup endpoint", () => {
  it("sends exactly the five approved fields and accepts only a nonempty token", async () => {
    post.mockResolvedValue({ status: 201, body: { token: "synthetic" } });
    await expect(signUp({ name: "N", email: "e", password: "p", rePassword: "p", phone: "1" })).resolves.toEqual({ token: "synthetic" });
    expect(post).toHaveBeenCalledWith(["auth", "signup"], { name: "N", email: "e", password: "p", rePassword: "p", phone: "1" });
  });
});
