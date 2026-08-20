import { type Metadata } from "next";

import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { AccountShell } from "@/components/layout/account-shell";
import { getAddresses } from "@/lib/api/endpoints/protected/addresses.server";
import { AddressList } from "@/features/addresses/components/address-list";

export const metadata: Metadata = {
  title: "Saved Addresses | Route Store",
  description: "Manage your delivery and shipping addresses.",
};

export default async function AddressesPage() {
  const session = await requireProtectedRoute("/account/addresses");
  const addresses = await getAddresses();

  return (
    <AccountShell user={session.user} activeItem="addresses">
      <AddressList addresses={addresses} />
    </AccountShell>
  );
}
