import { type Metadata } from "next";

import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { AccountShell } from "@/components/layout/account-shell";
import { AddAddressForm } from "@/features/addresses/components/add-address-form";

export const metadata: Metadata = {
  title: "Add New Address | Route Store",
  description: "Add a new delivery address to your account.",
};

export default async function NewAddressPage() {
  const session = await requireProtectedRoute("/account/addresses/new");

  return (
    <AccountShell user={session.user} activeItem="addresses">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#191B23]">Add New Address</h2>
          <p className="text-sm text-[#434655] mt-1">
            Provide delivery details for accurate shipping when checking out.
          </p>
        </div>

        <AddAddressForm />
      </div>
    </AccountShell>
  );
}
