import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ProductGallery } from "@/features/catalog/components/product-gallery";

afterEach(() => cleanup());

const media = [
  "https://ecommerce.routemisr.com/images/one.webp",
  "https://ecommerce.routemisr.com/images/two.webp",
  "https://ecommerce.routemisr.com/images/three.webp",
];

describe("C04 product gallery", () => {
  it("uses a neutral fallback with no controls when media is absent", () => {
    render(<ProductGallery media={[]} title="Product" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders one main image without meaningless selectors", () => {
    render(<ProductGallery media={[media[0]]} title="Product" />);
    expect(screen.getByRole("img", { name: "Product" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("supports selection, native buttons, arrows, Home, and End", async () => {
    const user = userEvent.setup();
    render(<ProductGallery media={media} title="Product" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    expect(buttons[0].getAttribute("aria-label")).toBe("Show image 1 of 3 for Product");
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(buttons[0].querySelector("span")?.className).toContain("md:hidden");
    expect(buttons[0].querySelector("img")?.className).toContain("md:block");

    await user.click(buttons[1]);
    expect(buttons[1].getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{ArrowRight}");
    expect(buttons[2].getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{Home}");
    expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{End}");
    expect(buttons[2].getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{ArrowLeft}");
    expect(buttons[1].getAttribute("aria-pressed")).toBe("true");
  });
});
