"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addAddressAction, type AddAddressState } from "@/features/addresses/actions/add-address.action";

const initialState: AddAddressState = { status: "idle" };

export function AddAddressForm() {
  const [state, formAction, isPending] = useActionState(addAddressAction, initialState);

  const fieldErrors = state.status === "invalid" ? state.fieldErrors : {};

  return (
    <form action={formAction} noValidate className="space-y-6">
      {state.status === "error" && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium"
        >
          {state.message}
        </div>
      )}

      {state.status === "unauthorized" && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 font-medium"
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Address Label / Name */}
        <div className="sm:col-span-2">
          <label htmlFor="address-name" className="block text-xs font-bold uppercase tracking-wider text-[#434655] mb-2">
            Address Label <span className="text-red-500">*</span>
          </label>
          <input
            id="address-name"
            name="name"
            type="text"
            placeholder="e.g. Home, Work, Apartment"
            disabled={isPending}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#191B23] bg-white transition-all outline-none focus:ring-2 ${
              fieldErrors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-200/90 focus:border-[#004AC6] focus:ring-blue-100"
            }`}
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-600 font-medium" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Street Details */}
        <div className="sm:col-span-2">
          <label htmlFor="address-details" className="block text-xs font-bold uppercase tracking-wider text-[#434655] mb-2">
            Street Address & Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address-details"
            name="details"
            rows={3}
            placeholder="e.g. 123 Nile Street, Building 4, Apt 12, Floor 3"
            disabled={isPending}
            aria-invalid={!!fieldErrors.details}
            aria-describedby={fieldErrors.details ? "details-error" : undefined}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#191B23] bg-white transition-all outline-none focus:ring-2 resize-none ${
              fieldErrors.details
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-200/90 focus:border-[#004AC6] focus:ring-blue-100"
            }`}
          />
          {fieldErrors.details && (
            <p id="details-error" className="mt-1.5 text-xs text-red-600 font-medium" role="alert">
              {fieldErrors.details}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="address-city" className="block text-xs font-bold uppercase tracking-wider text-[#434655] mb-2">
            City / Governorate <span className="text-red-500">*</span>
          </label>
          <input
            id="address-city"
            name="city"
            type="text"
            placeholder="e.g. Cairo, Giza, Alexandria"
            disabled={isPending}
            aria-invalid={!!fieldErrors.city}
            aria-describedby={fieldErrors.city ? "city-error" : undefined}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#191B23] bg-white transition-all outline-none focus:ring-2 ${
              fieldErrors.city
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-200/90 focus:border-[#004AC6] focus:ring-blue-100"
            }`}
          />
          {fieldErrors.city && (
            <p id="city-error" className="mt-1.5 text-xs text-red-600 font-medium" role="alert">
              {fieldErrors.city}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="address-phone" className="block text-xs font-bold uppercase tracking-wider text-[#434655] mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="address-phone"
            name="phone"
            type="tel"
            placeholder="e.g. 01012345678"
            disabled={isPending}
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-[#191B23] bg-white transition-all outline-none focus:ring-2 ${
              fieldErrors.phone
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-200/90 focus:border-[#004AC6] focus:ring-blue-100"
            }`}
          />
          {fieldErrors.phone && (
            <p id="phone-error" className="mt-1.5 text-xs text-red-600 font-medium" role="alert">
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
        <Link
          href="/account/addresses"
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#434655] hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-[#004AC6] text-white text-sm font-semibold hover:bg-[#003da8] active:scale-[0.99] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Saving Address..." : "Save Address"}
        </button>
      </div>
    </form>
  );
}
