import Link from "next/link";
import { type ReactNode } from "react";
import { signOutAction } from "@/features/auth/actions/sign-out.action";

interface AccountShellProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
  };
  activeItem?: "profile" | "security" | "addresses" | "orders" | "wishlist";
}

const navItems = [
  { id: "profile", label: "My Profile", href: "/account/profile" },
  { id: "orders", label: "My Orders", href: "/account/orders" },
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
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-100/70 py-6 sm:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Account Top Summary Banner */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#004AC6] text-white flex items-center justify-center font-bold text-xl select-none shadow-sm">
              {initials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#191B23]">{user.name}</h1>
              <p className="text-sm text-[#434655]">{user.email}</p>
            </div>
          </div>

          {/* Mobile Sign Out button */}
          <div className="sm:hidden pt-3 border-t border-slate-200/60">
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200/60 transition-all duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Horizontally Scrollable Navigation Pills (lg:hidden) */}
        <nav
          aria-label="Mobile account navigation"
          className="lg:hidden mb-6 -mt-4"
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 -mx-1 scroll-smooth">
            {navItems.map((item) => {
              const isActive = item.id === activeItem;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`inline-flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl text-sm transition-all duration-200 select-none ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200/80 shadow-xs"
                      : "bg-white text-[#434655] font-medium border border-slate-200/80 hover:bg-[#F3F3FE] hover:text-[#191B23]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1" aria-label="Account navigation">
              {navItems.map((item) => {
                const isActive = item.id === activeItem;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100/80 text-blue-700 font-semibold shadow-xs"
                        : "text-[#434655] font-medium hover:bg-[#F3F3FE] hover:text-[#191B23]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-2 mt-2 border-t border-slate-200/60">
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </nav>
          </aside>

          {/* Account Content Section */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
