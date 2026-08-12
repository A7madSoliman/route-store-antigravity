"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";

import { AlertBanner } from "@/components/ui/alert-banner";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { resetPasswordAction } from "@/features/auth/actions/reset-password.action";
import {
  initialResetPasswordState,
  type ResetPasswordState,
} from "@/features/auth/reset-password-state";

const inputClass =
  "h-12 w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 text-body text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

function fieldError(state: ResetPasswordState, field: "email" | "newPassword" | "rePassword") {
  return state.status === "error" ? state.fieldErrors?.[field] : undefined;
}

export function ResetPasswordForm() {
  const [state, action] = useActionState(resetPasswordAction, initialResetPasswordState);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") {
      summaryRef.current?.focus();
    }
  }, [state.status, state.message]);

  if (state.status === "success") {
    return (
      <div aria-live="polite" className="outline-none" ref={summaryRef} tabIndex={-1}>
        <AlertBanner tone="info">{state.message}</AlertBanner>
        <Link
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-primary px-4 text-body font-semibold text-white hover:bg-brand-primary/90"
          href="/sign-in"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div aria-live="polite" className="outline-none" ref={summaryRef} tabIndex={-1}>
        {state.status === "error" ? <AlertBanner>{state.message}</AlertBanner> : null}
      </div>
      <FormField
        control={
          <input
            autoComplete="email"
            className={inputClass}
            defaultValue={state.status === "error" ? state.email : undefined}
            name="email"
            required
            type="email"
          />
        }
        error={fieldError(state, "email")}
        id="email"
        label="Email Address"
        required
      />
      <PasswordField
        autoComplete="new-password"
        error={fieldError(state, "newPassword")}
        id="newPassword"
        label="New Password"
        name="newPassword"
        required
      />
      <PasswordField
        autoComplete="new-password"
        error={fieldError(state, "rePassword")}
        id="rePassword"
        label="Confirm New Password"
        name="rePassword"
        required
      />
      <SubmitButton
        className="h-12 w-full rounded-lg bg-brand-primary px-4 text-body font-semibold text-white transition hover:bg-brand-primary/90"
        pendingLabel="Resetting password..."
      >
        Reset Password
      </SubmitButton>
    </form>
  );
}

