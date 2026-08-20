"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/features/account/profile/actions/update-profile.action";
import { initialProfileUpdateState } from "@/features/account/profile/profile-state";
import { AlertBanner } from "@/components/ui/alert-banner";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialPhone?: string;
}

const inputClass =
  "h-12 w-full rounded-md border border-outline bg-card px-4 text-body text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export function ProfileForm({ initialName, initialEmail, initialPhone = "" }: ProfileFormProps) {
  const [nameState, nameAction] = useActionState(updateProfileAction, initialProfileUpdateState);
  const [emailState, emailAction] = useActionState(updateProfileAction, initialProfileUpdateState);
  const [phoneState, phoneAction] = useActionState(updateProfileAction, initialProfileUpdateState);

  const currentName = nameState.status === "success" && nameState.updatedValue ? nameState.updatedValue : initialName;
  const currentEmail = emailState.status === "success" && emailState.updatedValue ? emailState.updatedValue : initialEmail;
  const currentPhone = phoneState.status === "success" && phoneState.updatedValue ? phoneState.updatedValue : initialPhone;

  return (
    <div className="space-y-8">
      {/* Full Name Section */}
      <div className="bg-card p-6 sm:p-8 rounded-2xl border border-outline-subtle shadow-sm space-y-4">
        <div>
          <h3 className="text-heading-4 font-semibold text-text-primary">Personal Information</h3>
          <p className="text-body-small text-text-secondary">Update your display name.</p>
        </div>

        {nameState.status === "success" && (
          <AlertBanner tone="info" title="Name Updated">
            {nameState.message ?? "Your name has been updated."}
          </AlertBanner>
        )}
        {nameState.status === "error" && !nameState.field && (
          <AlertBanner tone="error" title="Update Failed">
            {nameState.message ?? "Could not update name."}
          </AlertBanner>
        )}

        <form action={nameAction} className="space-y-4" noValidate>
          <input type="hidden" name="field" value="name" />
          <FormField
            id="profile-name"
            label="Full Name"
            required
            error={nameState.status === "error" && nameState.field === "name" ? nameState.message : undefined}
            control={
              <input
                key={currentName}
                className={inputClass}
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={currentName}
                required
              />
            }
          />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Saving...">Update Name</SubmitButton>
          </div>
        </form>
      </div>

      {/* Email Address Section */}
      <div className="bg-card p-6 sm:p-8 rounded-2xl border border-outline-subtle shadow-sm space-y-4">
        <div>
          <h3 className="text-heading-4 font-semibold text-text-primary">Email Address</h3>
          <p className="text-body-small text-text-secondary">Update the email associated with your account.</p>
        </div>

        {emailState.status === "success" && (
          <AlertBanner tone="info" title="Email Updated">
            {emailState.message ?? "Your email has been updated."}
          </AlertBanner>
        )}
        {emailState.status === "error" && !emailState.field && (
          <AlertBanner tone="error" title="Update Failed">
            {emailState.message ?? "Could not update email."}
          </AlertBanner>
        )}

        <form action={emailAction} className="space-y-4" noValidate>
          <input type="hidden" name="field" value="email" />
          <FormField
            id="profile-email"
            label="Email Address"
            required
            error={emailState.status === "error" && emailState.field === "email" ? emailState.message : undefined}
            control={
              <input
                key={currentEmail}
                className={inputClass}
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={currentEmail}
                required
              />
            }
          />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Saving...">Update Email</SubmitButton>
          </div>
        </form>
      </div>

      {/* Phone Number Section */}
      <div className="bg-card p-6 sm:p-8 rounded-2xl border border-outline-subtle shadow-sm space-y-4">
        <div>
          <h3 className="text-heading-4 font-semibold text-text-primary">Phone Number</h3>
          <p className="text-body-small text-text-secondary">Update your contact phone number.</p>
        </div>

        {phoneState.status === "success" && (
          <AlertBanner tone="info" title="Phone Updated">
            {phoneState.message ?? "Your phone number has been updated."}
          </AlertBanner>
        )}
        {phoneState.status === "error" && !phoneState.field && (
          <AlertBanner tone="error" title="Update Failed">
            {phoneState.message ?? "Could not update phone number."}
          </AlertBanner>
        )}

        <form action={phoneAction} className="space-y-4" noValidate>
          <input type="hidden" name="field" value="phone" />
          <FormField
            id="profile-phone"
            label="Phone Number"
            required
            error={phoneState.status === "error" && phoneState.field === "phone" ? phoneState.message : undefined}
            control={
              <input
                key={currentPhone}
                className={inputClass}
                name="phone"
                type="tel"
                autoComplete="tel"
                defaultValue={currentPhone}
                required
              />
            }
          />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Saving...">Update Phone</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
