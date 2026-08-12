import type { Metadata } from "next";
import Link from "next/link";

import { ResetLockIcon } from "@/components/icons/auth-icons";
import { AuthShell } from "@/components/layout/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = { title: "Forgot Password | Nexa Store" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <nav aria-label="Breadcrumb" className="mb-8 hidden items-center gap-2 text-caption text-text-muted md:flex">
        <Link className="hover:text-brand-primary hover:underline" href="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link className="hover:text-brand-primary hover:underline" href="/sign-in">Login</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page" className="font-semibold text-brand-primary">Forgot Password</span>
      </nav>
      <div className="mx-auto max-w-[440px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
            <ResetLockIcon />
          </div>
          <h1 className="text-heading-2 font-semibold text-text-primary">Forgot Password</h1>
          <p className="mt-2 text-body text-text-muted">Enter your email address to receive a reset code.</p>
        </div>
        <ForgotPasswordForm />
        <div className="mt-5 border-t border-outline-subtle pt-5 text-center">
          <Link className="text-body-small font-semibold text-text-muted hover:text-brand-primary hover:underline" href="/sign-in">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
