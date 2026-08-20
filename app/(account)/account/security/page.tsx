import { type Metadata } from "next";

import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { AccountShell } from "@/components/layout/account-shell";
import { SecurityForm } from "@/features/account/security/components/security-form";

export const metadata: Metadata = {
  title: "Security & Password | Route Store",
  description: "Change your account password securely.",
};

export default async function SecurityPage() {
  const session = await requireProtectedRoute("/account/security");

  return (
    <AccountShell user={session.user} activeItem="security">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#191B23]">Security & Password</h2>
          <p className="text-sm text-[#434655] mt-1">
            Manage and update your account password.
          </p>
        </div>

        <SecurityForm />
      </div>
    </AccountShell>
  );
}
