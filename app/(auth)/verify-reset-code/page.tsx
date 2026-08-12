import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/layout/auth-shell";
import { VerifyResetCodeForm } from "@/features/auth/components/verify-reset-code-form";

export const metadata: Metadata = { title: "Verify Reset Code | Nexa Store" };

export default function VerifyResetCodePage() {
  return (
    <AuthShell>
      <div className="mx-auto max-w-[480px] text-center">
        <div className="mb-10">
          <div className="mb-8 text-heading-3 font-semibold tracking-tight text-brand-primary">
            Nexa Store
          </div>
          <h1 className="text-heading-2 font-semibold text-text-primary">Verify Reset Code</h1>
          <p className="mt-3 text-body text-text-muted">Enter the reset code to continue.</p>
        </div>
        <VerifyResetCodeForm />
        <div className="mt-8 border-t border-outline-subtle pt-6">
          <Link
            className="text-body-small text-text-muted hover:text-brand-primary hover:underline"
            href="/sign-in"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
