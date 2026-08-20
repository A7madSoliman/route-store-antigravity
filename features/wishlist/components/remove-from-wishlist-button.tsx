"use client";

import { useActionState } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import {
  removeFromWishlistAction,
  type RemoveFromWishlistState,
} from "@/features/wishlist/actions/remove-from-wishlist.action";

const initialState: RemoveFromWishlistState = { status: "idle" };

interface RemoveFromWishlistButtonProps {
  productId: string;
  variant?: "icon" | "button";
  className?: string;
}

export function RemoveFromWishlistButton({
  productId,
  variant = "icon",
  className = "",
}: RemoveFromWishlistButtonProps) {
  const [state, formAction, isPending] = useActionState(removeFromWishlistAction, initialState);

  if (variant === "button") {
    return (
      <form action={formAction} className="w-full">
        <input type="hidden" name="productId" value={productId} />
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-button font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
            isPending ? "opacity-60 cursor-not-allowed" : ""
          } ${className}`}
        >
          <StorefrontIcon name="trash" size={18} />
          <span>{isPending ? "Removing..." : "Remove"}</span>
        </button>

        {state.status === "error" && (
          <p className="mt-1 text-caption text-error text-center" role="alert">
            {state.message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={isPending}
        aria-label="Remove from wishlist"
        aria-disabled={isPending}
        className={`p-2 rounded-full bg-white/90 text-text-secondary hover:text-red-600 hover:bg-red-50 shadow-sm border border-slate-200/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer ${
          isPending ? "opacity-60 cursor-not-allowed" : ""
        } ${className}`}
      >
        <StorefrontIcon name="trash" size={18} />
      </button>
    </form>
  );
}
