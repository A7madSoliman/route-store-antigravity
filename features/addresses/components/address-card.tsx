import type { Address } from "@/types/address";
import { RemoveAddressButton } from "@/features/addresses/components/remove-address-button";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  return (
    <article
      aria-labelledby={`address-title-${address.id}`}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span
            id={`address-title-${address.id}`}
            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider"
          >
            {address.name || "Address"}
          </span>
          <span className="text-xs font-medium text-text-muted bg-slate-100 px-2 py-0.5 rounded-md">
            {address.city}
          </span>
        </div>

        <p className="text-sm font-medium text-[#191B23] leading-relaxed mb-4">
          {address.details}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#434655]">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-slate-400">Tel:</span>
          <span>{address.phone}</span>
        </div>

        <RemoveAddressButton addressId={address.id} addressName={address.name} />
      </div>
    </article>
  );
}
