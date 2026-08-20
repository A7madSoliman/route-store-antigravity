import type { WishlistItem } from "@/types/wishlist";
import { WishlistCard } from "@/features/wishlist/components/wishlist-card";

export function WishlistGrid({ items }: { items: readonly WishlistItem[] }) {
  return (
    <ul aria-label="Wishlist items" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} />
      ))}
    </ul>
  );
}

export function WishlistGridSkeleton() {
  return (
    <ul aria-hidden="true" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index} className="min-w-0">
          <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-[#C3C6D7]/40 shadow-sm animate-pulse">
            <div className="aspect-square bg-surface-low" />
            <div className="p-5 flex flex-col flex-1 space-y-3">
              <div className="h-5 bg-surface-high rounded w-3/4" />
              <div className="h-4 bg-surface-high rounded w-1/2" />
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="h-6 bg-surface-high rounded w-1/3" />
                <div className="h-9 bg-surface-high rounded w-24" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
