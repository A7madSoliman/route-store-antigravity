"use client";

import { useActionState, useEffect, useRef } from "react";
import { signUpAction } from "@/features/auth/actions/sign-up.action";
import { initialSignUpState } from "@/features/auth/sign-up-state";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { AlertBanner } from "@/components/ui/alert-banner";

const inputClass = "h-12 w-full rounded-md border border-outline bg-card px-4 text-body text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export function SignUpForm({ returnTo }: { returnTo: string }) {
  const [state, action] = useActionState(signUpAction, initialSignUpState);
  const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.status !== "idle") summaryRef.current?.focus(); }, [state.status]);
  const disabled = state.status === "account-created";
  return (
    <form action={action} className="space-y-5" noValidate={false}>
      <div ref={summaryRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {state.status !== "idle" ? <AlertBanner tone={state.status === "account-created" ? "info" : "error"}>{state.message}</AlertBanner> : null}
      </div>
      <input type="hidden" name="returnTo" value={returnTo} readOnly />
      <FormField id="name" label="Full Name" required control={<input className={inputClass} name="name" type="text" autoComplete="name" defaultValue={state.name} required disabled={disabled} />} />
      <FormField id="email" label="Email Address" required control={<input className={inputClass} name="email" type="email" autoComplete="email" defaultValue={state.email} required disabled={disabled} />} />
      <FormField id="phone" label="Phone Number" required control={<input className={inputClass} name="phone" type="tel" autoComplete="tel" defaultValue={state.phone} required disabled={disabled} />} />
      <PasswordField id="password" name="password" label="Password" autoComplete="new-password" required disabled={disabled} />
      <PasswordField id="rePassword" name="rePassword" label="Confirm Password" autoComplete="new-password" required disabled={disabled} />
      <SubmitButton className="h-12 w-full rounded-md bg-brand-primary px-4 text-body font-semibold text-white transition hover:bg-brand-primary/90" pendingLabel="Creating account..." disabled={disabled}>Create Account</SubmitButton>
    </form>
  );
}
