"use client";

import { useActionState } from "react";
import {
  updateCartQuantityAction,
  type UpdateCartQuantityState,
} from "@/features/cart/actions/update-cart-quantity.action";

const initialState: UpdateCartQuantityState = { status: "idle" };

interface QuantityStepperProps {
  productId: string;
  count: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  productId,
  count,
  max,
  className = "",
}: QuantityStepperProps) {
  const [state, formAction, isPending] = useActionState(updateCartQuantityAction, initialState);

  const displayCount = state.status === "success" && state.count !== undefined ? state.count : count;
  const isDecrementDisabled = displayCount <= 1 || isPending;
  const isIncrementDisabled = (max !== undefined && displayCount >= max) || isPending;

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <div className="flex items-center border border-slate-200/90 rounded-lg bg-surface overflow-hidden shadow-2xs">
        <form action={formAction} className="inline-flex">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="count" value={displayCount - 1} />
          <button
            type="submit"
            disabled={isDecrementDisabled}
            aria-disabled={isDecrementDisabled}
            aria-label="Decrease quantity"
            className="px-3 py-1.5 text-text-secondary hover:text-brand-primary hover:bg-slate-100/80 active:bg-slate-200/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer select-none text-body font-bold"
          >
            −
          </button>
        </form>

        <span
          aria-live="polite"
          aria-atomic="true"
          className={`px-3 py-1 text-body-small font-bold text-text-primary min-w-[2.25rem] text-center select-none ${
            isPending ? "opacity-50" : ""
          }`}
        >
          {displayCount}
        </span>

        <form action={formAction} className="inline-flex">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="count" value={displayCount + 1} />
          <button
            type="submit"
            disabled={isIncrementDisabled}
            aria-disabled={isIncrementDisabled}
            aria-label="Increase quantity"
            className="px-3 py-1.5 text-text-secondary hover:text-brand-primary hover:bg-slate-100/80 active:bg-slate-200/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer select-none text-body font-bold"
          >
            +
          </button>
        </form>
      </div>

      {state.status === "error" && (
        <p className="text-caption text-error" role="alert">
          {state.message}
        </p>
      )}
    </div>
  );
}
