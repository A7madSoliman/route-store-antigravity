"use client";

import { useActionState } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { addToCartAction, type AddToCartState } from "@/features/cart/actions/add-to-cart.action";

const initialState: AddToCartState = { status: "idle" };

interface AddToCartButtonProps {
  productId: string;
  variant?: "primary" | "compact";
  label?: string;
  className?: string;
}

export function AddToCartButton({
  productId,
  variant = "primary",
  label,
  className = "",
}: AddToCartButtonProps) {
  const [state, formAction, isPending] = useActionState(addToCartAction, initialState);
  const isSuccess = state.status === "success";

  const defaultLabel = label ?? (variant === "compact" ? "Add to Bag" : "Add to Cart");

  if (variant === "compact") {
    return (
      <form action={formAction} className="w-auto">
        <input type="hidden" name="productId" value={productId} />
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          aria-label={isSuccess ? "Added to Bag" : defaultLabel}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-button font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer select-none ${
            isSuccess
              ? "bg-emerald-600 text-white"
              : "bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-[0.98]"
          } ${isPending ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
        >
          <StorefrontIcon name="cart" size={16} />
          <span>
            {isPending ? "Adding..." : isSuccess ? "Added ✓" : defaultLabel}
          </span>
        </button>

        {state.status === "unauthorized" && (
          <p className="mt-1 text-caption text-error text-center" role="alert">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p className="mt-1 text-caption text-error text-center" role="alert">
            {state.message}
          </p>
        )}
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
        aria-label={isSuccess ? "Added to Cart" : defaultLabel}
        className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 font-button text-button font-semibold rounded-lg transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 cursor-pointer ${
          isSuccess
            ? "bg-emerald-600 text-white"
            : "bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-[0.99]"
        } ${isPending ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      >
        <StorefrontIcon name="cart" size={20} />
        <span>
          {isPending
            ? "Adding to Cart..."
            : isSuccess
            ? "Added to Cart ✓"
            : defaultLabel}
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
