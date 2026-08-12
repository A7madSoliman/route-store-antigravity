"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";

import { AlertBanner } from "@/components/ui/alert-banner";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { forgotPasswordAction } from "@/features/auth/actions/forgot-password.action";
import { initialForgotPasswordState } from "@/features/auth/forgot-password-state";

const inputClass =
  "h-12 w-full rounded-md border border-outline bg-card px-4 text-body text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, initialForgotPasswordState);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") {
      summaryRef.current?.focus();
    }
  }, [state.status, state.message]);

  if (state.status === "success") {
    return (
      <div
        aria-live="polite"
        className="outline-none"
        ref={summaryRef}
        tabIndex={-1}
      >
        <AlertBanner tone="info">{state.message}</AlertBanner>
        <Link
          className="mt-5 inline-flex text-body-small font-semibold text-brand-primary hover:underline"
          href="/verify-reset-code"
        >
          Enter Reset Code
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
            defaultValue={state.email}
            name="email"
            placeholder="name@company.com"
            required
            type="email"
          />
        }
        error={state.status === "error" ? state.message : undefined}
        id="email"
        label="Email Address"
        required
      />
      <SubmitButton
        className="h-12 w-full rounded-md bg-brand-primary px-4 text-body font-semibold text-white transition hover:bg-brand-primary/90"
        pendingLabel="Sending reset code..."
      >
        Send Reset Code
      </SubmitButton>
    </form>
  );
}
