import Link from "next/link";
import { type ReactNode } from "react";

import { StoreHeader } from "@/components/layout/store-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

interface AccountShellProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
  };
  activeItem?: "profile" | "security" | "addresses" | "wishlist";
}

const navItems = [
  { id: "profile", label: "My Profile", href: "/account/profile" },
  { id: "security", label: "Security & Password", href: "/account/security" },
  { id: "addresses", label: "Saved Addresses", href: "/account/addresses" },
  { id: "wishlist", label: "My Wishlist", href: "/wishlist" },
] as const;

export function AccountShell({ children, user, activeItem = "profile" }: AccountShellProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FF]">
      <StoreHeader />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Account Top Summary Banner */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-[#C3C6D7]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#004AC6] text-white flex items-center justify-center font-bold text-xl select-none">
              {initials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#191B23]">{user.name}</h1>
              <p className="text-sm text-[#434655]">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="bg-white rounded-2xl p-4 border border-[#C3C6D7]/40 shadow-sm space-y-1" aria-label="Account navigation">
              {navItems.map((item) => {
                const isActive = item.id === activeItem;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#DAE2FD] text-[#004AC6]"
                        : "text-[#434655] hover:bg-[#F3F3FE] hover:text-[#191B23]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Account Content Section */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
