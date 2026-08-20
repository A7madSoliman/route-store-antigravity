"use client";

import { useActionState, useEffect, useRef } from "react";

import { changePasswordAction } from "@/features/account/security/actions/change-password.action";
import { initialPasswordChangeState } from "@/features/account/security/security-state";
import { AlertBanner } from "@/components/ui/alert-banner";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";

export function SecurityForm() {
  const [state, action] = useActionState(changePasswordAction, initialPasswordChangeState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <div className="bg-card p-6 sm:p-8 rounded-2xl border border-outline-subtle shadow-sm space-y-6 max-w-2xl">
      <div>
        <h3 className="text-heading-4 font-semibold text-text-primary">Change Password</h3>
        <p className="text-body-small text-text-secondary mt-1">
          Keep your account secure with a strong password.
        </p>
      </div>

      {state.status === "success" && (
        <AlertBanner tone="info" title="Password Changed">
          {state.message ?? "Your password has been updated."}
        </AlertBanner>
      )}

      {state.status === "error" && !state.field && (
        <AlertBanner tone="error" title="Update Failed">
          {state.message ?? "Could not change password."}
        </AlertBanner>
      )}

      <form ref={formRef} action={action} className="space-y-5" noValidate>
        <PasswordField
          id="currentPassword"
          name="currentPassword"
          label="Current Password"
          autoComplete="current-password"
          required
          error={state.status === "error" && state.field === "currentPassword" ? state.message : undefined}
        />

        <PasswordField
          id="password"
          name="password"
          label="New Password"
          description="Must be at least 8 characters long."
          autoComplete="new-password"
          required
          error={state.status === "error" && state.field === "password" ? state.message : undefined}
        />

        <PasswordField
          id="rePassword"
          name="rePassword"
          label="Confirm New Password"
          autoComplete="new-password"
          required
          error={state.status === "error" && state.field === "rePassword" ? state.message : undefined}
        />

        {/* Security Notice */}
        <div className="rounded-lg bg-surface-low p-4 border border-outline-subtle text-body-small text-text-secondary">
          <p className="font-medium text-text-primary">Security Note</p>
          <p className="mt-0.5">Your current session will be updated.</p>
        </div>

        <div className="flex justify-end pt-2">
          <SubmitButton pendingLabel="Updating password...">
            Update Password
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
