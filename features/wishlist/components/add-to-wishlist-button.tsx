"use client";

import { useActionState } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { addToWishlistAction, type AddToWishlistState } from "@/features/wishlist/actions/add-to-wishlist.action";

const initialState: AddToWishlistState = { status: "idle" };

interface AddToWishlistButtonProps {
  productId: string;
  variant?: "icon" | "button";
  className?: string;
}

export function AddToWishlistButton({
  productId,
  variant = "button",
  className = "",
}: AddToWishlistButtonProps) {
  const [state, formAction, isPending] = useActionState(addToWishlistAction, initialState);

  const isSuccess = state.status === "success";

  if (variant === "icon") {
    return (
      <form action={formAction} className="inline-block">
        <input type="hidden" name="productId" value={productId} />
        <button
          type="submit"
          disabled={isPending}
          aria-label={isSuccess ? "Saved to wishlist" : "Add to wishlist"}
          aria-disabled={isPending}
          className={`p-2 rounded-full shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            isSuccess
              ? "bg-brand-primary text-white"
              : "bg-surface text-text-primary hover:text-brand-primary"
          } ${isPending ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
        >
          <StorefrontIcon name="heart" size={20} />
        </button>
      </form>
    );
  }

  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className={`w-full flex items-center justify-center gap-2 py-3 px-5 border-1.5 rounded-lg font-button text-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
          isSuccess
            ? "border-brand-primary bg-[#DAE2FD] text-brand-primary"
            : "border-outline text-text-primary hover:bg-surface-low"
        } ${isPending ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      >
        <StorefrontIcon name="heart" size={20} />
        <span>
          {isPending
            ? "Adding to Wishlist..."
            : isSuccess
            ? "Saved in Wishlist"
            : "Add to Wishlist"}
        </span>
      </button>

      {state.status === "unauthorized" && (
        <p className="mt-2 text-caption text-error text-center" role="alert">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p className="mt-2 text-caption text-error text-center" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}