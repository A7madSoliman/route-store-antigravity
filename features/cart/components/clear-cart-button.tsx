"use client";

import { useActionState } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { clearCartAction, type ClearCartState } from "@/features/cart/actions/clear-cart.action";

const initialState: ClearCartState = { status: "idle" };

interface ClearCartButtonProps {
  className?: string;
}

export function ClearCartButton({ className = "" }: ClearCartButtonProps) {
  const [state, formAction, isPending] = useActionState(clearCartAction, initialState);

  return (
    <div className="inline-flex flex-col items-end">
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          aria-label="Clear all items from cart"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-body-small font-medium text-text-muted hover:text-error hover:bg-error-container/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none ${
            isPending ? "opacity-50" : ""
          } ${className}`}
        >
          <StorefrontIcon name="trash" size={16} />
          <span>{isPending ? "Clearing..." : "Clear Cart"}</span>
        </button>
      </form>

      {state.status === "error" && (
        <p className="mt-1 text-caption text-error" role="alert">
          {state.message}
        </p>
      )}
    </div>
  );
}
