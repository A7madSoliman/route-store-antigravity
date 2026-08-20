import { type Metadata } from "next";

import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { AccountShell } from "@/components/layout/account-shell";
import { ProfileForm } from "@/features/account/profile/components/profile-form";

export const metadata: Metadata = {
  title: "My Profile | Route Store",
  description: "Manage your personal account profile information.",
};

export default async function ProfilePage() {
  const session = await requireProtectedRoute("/account/profile");

  return (
    <AccountShell user={session.user} activeItem="profile">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#191B23]">My Profile</h2>
          <p className="text-sm text-[#434655] mt-1">
            Manage your personal contact information and identity details.
          </p>
        </div>

        <ProfileForm initialName={session.user.name} initialEmail={session.user.email} />
      </div>
    </AccountShell>
  );
}
