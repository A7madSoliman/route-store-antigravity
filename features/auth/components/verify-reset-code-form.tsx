"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";

import { AlertBanner } from "@/components/ui/alert-banner";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { verifyResetCodeAction } from "@/features/auth/actions/verify-reset-code.action";
import {
  initialVerifyResetCodeState,
  verifyResetCodeValidationMessage,
} from "@/features/auth/verify-reset-code-state";

const inputClass =
  "h-14 w-full rounded-lg border border-outline-variant bg-surface-container-low px-5 text-center text-heading-3 tracking-[0.25em] text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export function VerifyResetCodeForm() {
  const [state, action] = useActionState(verifyResetCodeAction, initialVerifyResetCodeState);
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
          href="/reset-password"
        >
          Set New Password
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <div aria-live="polite" className="outline-none" ref={summaryRef} tabIndex={-1}>
        {state.status === "error" ? <AlertBanner>{state.message}</AlertBanner> : null}
      </div>
      <FormField
        control={
          <input
            aria-label="Reset code"
            className={inputClass}
            name="resetCode"
            required
            type="text"
          />
        }
        description={verifyResetCodeValidationMessage}
        error={state.status === "error" ? state.message : undefined}
        id="resetCode"
        label="Reset Code"
        required
      />
      <SubmitButton
        className="h-12 w-full rounded-lg bg-brand-primary px-4 text-body font-semibold text-white transition hover:bg-brand-primary/90"
        pendingLabel="Verifying..."
      >
        Verify Code
      </SubmitButton>
    </form>
  );
}
