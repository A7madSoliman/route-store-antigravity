import type { Metadata } from "next";

import { ResetLockIcon } from "@/components/icons/auth-icons";
import { AuthShell } from "@/components/layout/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = { title: "Set New Password | Nexa Store" };

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <div className="mx-auto max-w-[480px]">
        <div className="mb-8 text-center">
          <h1 className="text-heading-2 font-semibold text-text-primary">Set New Password</h1>
          <p className="mt-3 text-body text-text-muted">
            Enter your email and choose a new password.
          </p>
        </div>
        <ResetPasswordForm />
        <div className="mt-7 flex items-center gap-3 border-t border-outline-subtle pt-6 text-body-small text-text-muted">
          <ResetLockIcon size={20} />
          <span>Secure password reset process</span>
        </div>
      </div>
    </AuthShell>
  );
}

