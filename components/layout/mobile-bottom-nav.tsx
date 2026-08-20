"use client";

import { ActiveNavLink } from "./active-nav-link";
import { PageContainer } from "./page-container";
import { ACCOUNT_HREF, storefrontBottomNavigation } from "./navigation";

export function MobileBottomNav({ accountHref = ACCOUNT_HREF }: { accountHref?: string }) {
  const items = storefrontBottomNavigation.map((item) =>
    item.label === "Account" ? { ...item, href: accountHref } : item,
  );

  return (
    <nav aria-label="Mobile storefront navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-subtle bg-card md:hidden">
      <PageContainer className="pb-safe">
        <div className="grid min-h-bottom-nav grid-cols-5 items-center gap-1">
          {items.map((item) => (
            <ActiveNavLink
              key={item.label}
              item={item}
              showIcon
              className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-sm px-1 text-caption text-text-muted hover:bg-surface-low"
              activeClassName="font-medium text-brand-primary"
            />
          ))}
        </div>
      </PageContainer>
    </nav>
  );
}
