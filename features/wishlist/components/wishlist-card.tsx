"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { RemoveFromWishlistButton } from "@/features/wishlist/components/remove-from-wishlist-button";
import { moveToBagAction, type MoveToBagState } from "@/features/wishlist/actions/move-to-bag.action";
import type { WishlistItem } from "@/types/wishlist";

const initialState: MoveToBagState = { status: "idle" };

function getSubtitle(description: string): string {
  const trimmed = description.trim();
  if (trimmed.length <= 50) return trimmed;
  return `${trimmed.slice(0, 50)}...`;
}

export function WishlistCard({ item }: { item: WishlistItem }) {
  const [state, formAction, isPending] = useActionState(moveToBagAction, initialState);
  const [isExiting, setIsExiting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const removeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isSuccess = state.status === "success";

  useEffect(() => {
    if (isSuccess) {
      // 1. After 1700ms (last 300ms of the 2-second window), trigger CSS exit transition
      exitTimerRef.current = setTimeout(() => {
        setIsExiting(true);
      }, 1700);

      // 2. After full 2000ms, unmount the card from the UI
      removeTimerRef.current = setTimeout(() => {
        setIsRemoved(true);
      }, 2000);
    }

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (removeTimerRef.current) clearTimeout(removeTimerRef.current);
    };
  }, [isSuccess]);

  if (isRemoved) {
    return null;
  }

  const subtitle = getSubtitle(item.description);

  return (
    <li
      className={`min-w-0 transition-all duration-300 ease-in-out ${
        isExiting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="group relative flex flex-col justify-between h-full bg-neutral-50 hover:bg-white rounded-2xl overflow-hidden border border-neutral-200/80 p-3 sm:p-3.5 shadow-xs transition-all duration-200 hover:shadow-md">
        <div>
          <div className="relative">
            <Link
              href={`/products/${encodeURIComponent(item.id)}`}
              className="block relative aspect-square overflow-hidden rounded-xl bg-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              ) : (
                <div aria-hidden="true" className="flex h-full items-center justify-center text-brand-primary">
                  <StorefrontIcon name="store" size={40} />
                </div>
              )}
            </Link>
            <div className="absolute top-2.5 right-2.5 z-10">
              <RemoveFromWishlistButton productId={item.id} variant="icon" />
            </div>
          </div>

          <div className="mt-3">
            <Link
              href={`/products/${encodeURIComponent(item.id)}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
            >
              <h3
                className="text-heading-4 font-semibold text-text-primary line-clamp-1 h-6 mb-1 group-hover:text-brand-primary transition-colors"
                title={item.title}
              >
                {item.title}
              </h3>
            </Link>

            {subtitle ? (
              <p className="text-body-small text-text-secondary line-clamp-1 h-5 mb-2">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between gap-3">
          <span className="text-body font-bold text-text-primary">
            EGP {item.price.toLocaleString("en-US")}
          </span>

          <form action={formAction} className="w-auto">
            <input type="hidden" name="productId" value={item.id} />
            <button
              type="submit"
              disabled={isPending || isSuccess}
              aria-disabled={isPending || isSuccess}
              aria-label={isSuccess ? "Added to Bag" : "Add to Bag"}
              className={`inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer select-none ${
                isSuccess
                  ? "bg-emerald-600 text-white scale-105 shadow-xs"
                  : "bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-[0.98]"
              } ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <StorefrontIcon name="cart" size={15} />
              <span>
                {isPending ? "Moving..." : isSuccess ? "Added ✓" : "Add to Bag"}
              </span>
            </button>
          </form>
        </div>

        {state.status === "error" && (
          <p className="mt-2 text-caption text-error text-center" role="alert">
            {state.message}
          </p>
        )}
        {state.status === "unauthorized" && (
          <p className="mt-2 text-caption text-error text-center" role="alert">
            {state.message}
          </p>
        )}
      </div>
    </li>
  );
}
