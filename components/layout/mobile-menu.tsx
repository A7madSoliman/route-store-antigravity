"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { ActiveNavLink } from "./active-nav-link";
import type { NavigationItem } from "./navigation";

type MobileMenuProps = {
  primaryItems: NavigationItem[];
};

export function MobileMenu({ primaryItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = "storefront-mobile-menu";

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-text-primary hover:bg-surface-low"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <StorefrontIcon name={isOpen ? "close" : "menu"} />
      </button>
      <div
        className="absolute inset-x-0 top-full border-b border-outline-subtle bg-card p-4 shadow-floating"
        hidden={!isOpen}
        id={panelId}
      >
        <nav aria-label="Mobile menu" className="flex flex-col gap-1">
          {primaryItems.map((item) => (
            <ActiveNavLink
              key={item.href}
              item={item}
              className="flex min-h-11 items-center rounded-sm px-3 text-body font-medium text-text-secondary hover:bg-surface-low"
              onClick={closeMenu}
            />
          ))}
          <Link
            className="flex min-h-11 items-center rounded-sm px-3 text-body font-medium text-text-secondary hover:bg-surface-low"
            href="/products"
            onClick={closeMenu}
          >
            Search products
          </Link>
        </nav>
      </div>
    </div>
  );
}
