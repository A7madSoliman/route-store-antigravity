import { type Metadata } from "next";

import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { getWishlist } from "@/lib/api/endpoints/protected/wishlist.server";
import { WishlistGrid } from "@/features/wishlist/components/wishlist-grid";
import { WishlistEmpty } from "@/features/wishlist/components/wishlist-empty";
import { AccountShell } from "@/components/layout/account-shell";

export const metadata: Metadata = {
  title: "My Wishlist | Route Store",
  description: "View and manage your saved wishlist items.",
};

export default async function WishlistPage() {
  const session = await requireProtectedRoute("/wishlist");
  const wishlist = await getWishlist();

  return (
    <AccountShell user={session.user} activeItem="wishlist">
      <div className="space-y-6">
        <header className="border-b border-[#C3C6D7]/40 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#191B23]">Your Wishlist</h2>
          <p className="text-sm text-[#434655] mt-1">
            {wishlist.count === 1
              ? "You have 1 item saved for later."
              : `You have ${wishlist.count} items saved for later.`}
          </p>
        </header>

        {wishlist.items.length === 0 ? (
          <WishlistEmpty />
        ) : (
          <WishlistGrid items={wishlist.items} />
        )}
      </div>
    </AccountShell>
  );
}
