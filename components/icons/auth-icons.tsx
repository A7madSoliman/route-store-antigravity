import type { SVGProps } from "react";

type AuthIconProps = SVGProps<SVGSVGElement> & { size?: number };

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
};

export function EyeIcon({ size = 20, ...props }: AuthIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" height={size} viewBox="0 0 24 24" width={size} {...props}>
      <path d="M2.8 12s3.2-5.5 9.2-5.5 9.2 5.5 9.2 5.5-3.2 5.5-9.2 5.5S2.8 12 2.8 12Z" {...common} />
      <circle cx="12" cy="12" r="2.5" {...common} />
    </svg>
  );
}

export function EyeOffIcon({ size = 20, ...props }: AuthIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" height={size} viewBox="0 0 24 24" width={size} {...props}>
      <path d="m3 3 18 18" {...common} />
      <path d="M10.6 6.7A9.8 9.8 0 0 1 12 6.5c6 0 9.2 5.5 9.2 5.5a16.7 16.7 0 0 1-3.1 3.5M6.4 6.9C4.1 8.2 2.8 12 2.8 12s3.2 5.5 9.2 5.5c.9 0 1.7-.1 2.4-.3" {...common} />
      <path d="M9.7 9.7a3.2 3.2 0 0 0 4.6 4.6" {...common} />
    </svg>
  );
}

export function ResetLockIcon({ size = 32, ...props }: AuthIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" height={size} viewBox="0 0 24 24" width={size} {...props}>
      <path d="M5.5 10.5V8a6.5 6.5 0 0 1 12.8-1.6" {...common} />
      <path d="m18.3 3.4.2 3.2-3.2.2" {...common} />
      <rect height="8" rx="1.5" width="10" x="7" y="10.5" {...common} />
      <path d="M12 13.5v2" {...common} />
    </svg>
  );
}
