"use client";

import { useActionState } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import {
  removeFromCartAction,
  type RemoveFromCartState,
} from "@/features/cart/actions/remove-from-cart.action";

const initialState: RemoveFromCartState = { status: "idle" };

interface RemoveFromCartButtonProps {
  productId: string;
  title?: string;
  className?: string;
}

export function RemoveFromCartButton({
  productId,
  title,
  className = "",
}: RemoveFromCartButtonProps) {
  const [state, formAction, isPending] = useActionState(removeFromCartAction, initialState);

  const label = title ? `Remove ${title} from cart` : "Remove item from cart";

  return (
    <form action={formAction} className="inline-flex items-center">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        aria-label={label}
        className={`p-2 text-text-muted hover:text-error hover:bg-error-container/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
          isPending ? "opacity-50" : ""
        } ${className}`}
      >
        <StorefrontIcon name="trash" size={18} />
      </button>

      {state.status === "error" && (
        <p className="sr-only" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
