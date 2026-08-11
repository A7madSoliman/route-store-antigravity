import type { ReactNode } from "react";

type AlertBannerProps = {
  tone?: "error" | "info" | "warning";
  title?: string;
  children: ReactNode;
};

const toneClasses = {
  error: "border-error bg-error-container text-error-text",
  info: "border-brand-primary bg-surface-low text-text-primary",
  warning: "border-warning bg-warning-container text-warning",
} as const;

export function AlertBanner({ tone = "error", title, children }: AlertBannerProps) {
  const isError = tone === "error";
  return (
    <div className={`rounded-md border px-4 py-3 text-body-small ${toneClasses[tone]}`} role={isError ? "alert" : "status"}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
