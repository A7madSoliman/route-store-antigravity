"use client";

import { useActionState } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import {
  removeAddressAction,
  type RemoveAddressState,
} from "@/features/addresses/actions/remove-address.action";

const initialState: RemoveAddressState = { status: "idle" };

interface RemoveAddressButtonProps {
  addressId: string;
  addressName?: string;
  className?: string;
}

export function RemoveAddressButton({
  addressId,
  addressName,
  className = "",
}: RemoveAddressButtonProps) {
  const [state, formAction, isPending] = useActionState(removeAddressAction, initialState);

  return (
    <div className="inline-flex flex-col items-end">
      <form action={formAction}>
        <input type="hidden" name="addressId" value={addressId} />
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          aria-label={`Remove address ${addressName || ""}`.trim()}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-error hover:bg-error-container/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none ${
            isPending ? "opacity-50" : ""
          } ${className}`}
        >
          <StorefrontIcon name="trash" size={14} />
          <span>{isPending ? "Removing..." : "Delete"}</span>
        </button>
      </form>

      {state.status === "error" && (
        <p className="mt-1 text-xs text-error" role="alert">
          {state.message}
        </p>
      )}
    </div>
  );
}
