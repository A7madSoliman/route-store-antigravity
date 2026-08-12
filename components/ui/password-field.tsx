"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons/auth-icons";
import { FormField } from "./form-field";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "className"> & {
  id?: string;
  label: string;
  description?: string;
  error?: string;
  labelTrailing?: ReactNode;
};

export function PasswordField({ id, label, description, error, labelTrailing, ...inputProps }: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `password-${generatedId}`;
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      control={<input {...inputProps} className="min-h-12 w-full rounded-sm border border-outline bg-card px-4 py-3 pr-12 text-body text-text-primary placeholder:text-text-muted focus:border-brand-primary" type={visible ? "text" : "password"} />}
      controlSuffix={
        <button aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-low hover:text-brand-primary" onClick={() => setVisible((current) => !current)} type="button">
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      description={description}
      error={error}
      id={fieldId}
      label={label}
      labelTrailing={labelTrailing}
      required={inputProps.required}
    />
  );
}
