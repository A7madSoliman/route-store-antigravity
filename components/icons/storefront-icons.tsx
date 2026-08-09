import type { SVGProps } from "react";

export type StorefrontIconName =
  | "account"
  | "cart"
  | "categories"
  | "chevron-down"
  | "close"
  | "devices"
  | "heart"
  | "home"
  | "menu"
  | "search"
  | "store";

type StorefrontIconProps = SVGProps<SVGSVGElement> & {
  name: StorefrontIconName;
  size?: number;
};

export function StorefrontIcon({ name, size = 24, ...props }: StorefrontIconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {name === "account" && (
        <>
          <circle cx="12" cy="8" r="3.25" {...common} />
          <path d="M5.5 20c.8-3.3 3-5 6.5-5s5.7 1.7 6.5 5" {...common} />
        </>
      )}
      {name === "cart" && (
        <>
          <path d="M3.5 4h2l1.6 10.2a1.8 1.8 0 0 0 1.8 1.5h7.8a1.8 1.8 0 0 0 1.7-1.2L20.2 8H6.2" {...common} />
          <circle cx="9" cy="19" r="1" {...common} />
          <circle cx="17" cy="19" r="1" {...common} />
        </>
      )}
      {name === "categories" && (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" {...common} />
          <rect x="14" y="4" width="6" height="6" rx="1" {...common} />
          <rect x="4" y="14" width="6" height="6" rx="1" {...common} />
          <rect x="14" y="14" width="6" height="6" rx="1" {...common} />
        </>
      )}
      {name === "chevron-down" && <path d="m6 9 6 6 6-6" {...common} />}
      {name === "close" && (
        <>
          <path d="m6 6 12 12" {...common} />
          <path d="m18 6-12 12" {...common} />
        </>
      )}
      {name === "devices" && (
        <>
          <rect x="3.5" y="5" width="11" height="8" rx="1" {...common} />
          <path d="M7 19h4M9 13v6M17.5 9.5h3v7h-3z" {...common} />
        </>
      )}
      {name === "heart" && (
        <path d="M20.8 8.8c0 5.1-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.8A4.6 4.6 0 0 1 12 6.5a4.6 4.6 0 0 1 8.8 2.3Z" {...common} />
      )}
      {name === "home" && (
        <>
          <path d="m3.5 10.8 8.5-7 8.5 7" {...common} />
          <path d="M5.5 9.5V20h13V9.5M9.5 20v-5h5v5" {...common} />
        </>
      )}
      {name === "menu" && (
        <>
          <path d="M4 7h16" {...common} />
          <path d="M4 12h16" {...common} />
          <path d="M4 17h16" {...common} />
        </>
      )}
      {name === "search" && (
        <>
          <circle cx="10.8" cy="10.8" r="6.3" {...common} />
          <path d="m16 16 4.5 4.5" {...common} />
        </>
      )}
      {name === "store" && (
        <>
          <path d="M4 10v10h16V10" {...common} />
          <path d="M3 10 5 4h14l2 6" {...common} />
          <path d="M3 10c.7 1 1.7 1.5 3 1.5S8.3 11 9 10c.7 1 1.7 1.5 3 1.5s2.3-.5 3-1.5c.7 1 1.7 1.5 3 1.5s2.3-.5 3-1.5M9 20v-5h6v5" {...common} />
        </>
      )}
    </svg>
  );
}
