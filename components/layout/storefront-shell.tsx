import type { ReactNode } from "react";
import { AnnouncementBar } from "./announcement-bar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { SiteFooter } from "./site-footer";
import { StoreHeader } from "./store-header";

type StorefrontShellProps = {
  children: ReactNode;
};

export function StorefrontShell({ children }: StorefrontShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        className="sr-only absolute left-4 top-4 z-50 rounded-sm bg-card px-4 py-3 text-body-small font-semibold text-brand-primary focus:not-sr-only"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="sticky top-0 z-30">
        <AnnouncementBar />
        <StoreHeader />
      </div>
      <main className="flex-1 pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom))] md:pb-0" id="main-content">
        {children}
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
