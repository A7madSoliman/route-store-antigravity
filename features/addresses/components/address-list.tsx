import Link from "next/link";
import { AddressCard } from "@/features/addresses/components/address-card";
import { AddressEmpty } from "@/features/addresses/components/address-empty";
import type { Address } from "@/types/address";

interface AddressListProps {
  addresses: Address[];
}

export function AddressList({ addresses }: AddressListProps) {
  if (addresses.length === 0) {
    return <AddressEmpty />;
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191B23]">Saved Addresses</h2>
          <p className="text-xs sm:text-sm text-[#434655]">
            {addresses.length} {addresses.length === 1 ? "saved address" : "saved addresses"} for deliveries
          </p>
        </div>

        <Link
          href="/account/addresses/new"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[#004AC6] text-white font-medium text-sm rounded-xl hover:bg-[#003da8] active:scale-[0.99] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer"
        >
          + Add New Address
        </Link>
      </div>

      {/* Address cards grid */}
      <div
        role="region"
        aria-label="Saved addresses list"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  );
}
