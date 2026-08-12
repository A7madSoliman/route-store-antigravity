"use client";
import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { signInAction } from "@/features/auth/actions/sign-in.action";
import { initialSignInState } from "@/features/auth/sign-in-state";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { AlertBanner } from "@/components/ui/alert-banner";
const inputClass = "h-12 w-full rounded-md border border-outline bg-card px-4 text-body text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";
export function SignInForm({ returnTo }: { returnTo: string }) {
  const [state, action] = useActionState(signInAction, initialSignInState); const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.status !== "idle") summaryRef.current?.focus(); }, [state.status, state.message]);
  return <form action={action} className="space-y-5"><div ref={summaryRef} tabIndex={-1} className="outline-none" aria-live="polite">{state.status === "error" ? <AlertBanner>{state.message}</AlertBanner> : null}</div><input type="hidden" name="returnTo" value={returnTo} readOnly /><FormField id="email" label="Email Address" required control={<input className={inputClass} name="email" type="email" autoComplete="email" defaultValue={state.email} required />} /><PasswordField id="password" name="password" label="Password" labelTrailing={<Link className="text-body-small font-semibold text-brand-primary hover:underline" href="/forgot-password">Forgot Password?</Link>} autoComplete="current-password" required /><SubmitButton className="h-12 w-full rounded-md bg-brand-primary px-4 text-body font-semibold text-white transition hover:bg-brand-primary/90" pendingLabel="Signing in...">Sign In</SubmitButton><div className="hidden text-center text-body-small text-text-muted md:block"><span>Don&apos;t have an account? </span><Link className="font-semibold text-brand-primary hover:underline" href="/sign-up">Register now</Link></div></form>;
}
