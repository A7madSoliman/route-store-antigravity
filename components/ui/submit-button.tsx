"use client";

import type { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> & {
  children: string;
  pendingLabel?: string;
};

export function SubmitButton({ children, pendingLabel = "Submitting...", disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button aria-busy={pending || undefined} className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-brand-primary px-5 py-3 text-button text-on-primary hover:bg-brand-primary-strong disabled:cursor-not-allowed disabled:opacity-60" disabled={disabled || pending} type="submit" {...props}>
      {pending ? pendingLabel : children}
    </button>
  );
}
