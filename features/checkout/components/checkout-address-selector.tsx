"use client";

import { useState } from "react";
import type { Address } from "@/types/address";

type CheckoutAddressSelectorProps = {
  savedAddresses: Address[];
  errors?: {
    details?: string[];
    phone?: string[];
    city?: string[];
  };
  defaultDetails?: string;
  defaultPhone?: string;
  defaultCity?: string;
};

export function CheckoutAddressSelector({
  savedAddresses,
  errors,
  defaultDetails = "",
  defaultPhone = "",
  defaultCity = "",
}: CheckoutAddressSelectorProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses.length > 0 ? savedAddresses[0].id : "custom"
  );
  const [customDetails, setCustomDetails] = useState(defaultDetails);
  const [customPhone, setCustomPhone] = useState(defaultPhone);
  const [customCity, setCustomCity] = useState(defaultCity);

  const isCustom = selectedAddressId === "custom";
  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
      <h2 className="text-heading-3 font-semibold text-text-primary mb-6">Shipping Address</h2>

      {savedAddresses.length > 0 && (
        <div className="space-y-4 mb-6">
          {savedAddresses.map((address) => (
            <label
              key={address.id}
              className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedAddressId === address.id
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="radio"
                  name="addressSelection"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-slate-300"
                />
              </div>
              <div className="ml-3 flex-1 text-body-small">
                <div className="font-semibold text-text-primary">{address.name}</div>
                <div className="text-text-secondary mt-1">{address.details}</div>
                <div className="text-text-secondary">{address.city}</div>
                <div className="text-text-secondary mt-1">{address.phone}</div>
              </div>
            </label>
          ))}

          <label
            className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
              isCustom ? "border-brand-primary bg-brand-primary/5" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <input
                type="radio"
                name="addressSelection"
                value="custom"
                checked={isCustom}
                onChange={() => setSelectedAddressId("custom")}
                className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-slate-300"
              />
            </div>
            <div className="ml-3 font-semibold text-text-primary">Ship to a different address</div>
          </label>
        </div>
      )}

      {/* Hidden inputs to pass selected or custom data to the form action */}
      <input type="hidden" name="details" value={isCustom ? customDetails : selectedAddress?.details || ""} />
      <input type="hidden" name="phone" value={isCustom ? customPhone : selectedAddress?.phone || ""} />
      <input type="hidden" name="city" value={isCustom ? customCity : selectedAddress?.city || ""} />

      {isCustom && (
        <div className="space-y-4 pt-2">
          <div>
            <label htmlFor="details" className="block text-body-small font-semibold text-text-primary mb-1">
              Street Address / Details
            </label>
            <input
              type="text"
              id="custom-details"
              value={customDetails}
              onChange={(e) => setCustomDetails(e.target.value)}
              placeholder="e.g. 123 Main St, Apt 4B"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
            {errors?.details && <p className="mt-1 text-caption text-error">{errors.details[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-body-small font-semibold text-text-primary mb-1">
                City
              </label>
              <input
                type="text"
                id="custom-city"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="e.g. Cairo"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
              {errors?.city && <p className="mt-1 text-caption text-error">{errors.city[0]}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-body-small font-semibold text-text-primary mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="custom-phone"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="01012345678"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              />
              {errors?.phone && <p className="mt-1 text-caption text-error">{errors.phone[0]}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
