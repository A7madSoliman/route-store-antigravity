"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEventHandler } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import type { NavigationItem } from "./navigation";

type ActiveNavLinkProps = {
  item: NavigationItem;
  className?: string;
  activeClassName?: string;
  showIcon?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

function pathFromHref(href: string) {
  return href.split("?", 1)[0];
}

export function ActiveNavLink({
  item,
  className = "",
  activeClassName = "text-brand-primary",
  showIcon = false,
  onClick,
}: ActiveNavLinkProps) {
  const pathname = usePathname();
  const itemPath = pathFromHref(item.href);
  const isActive = itemPath === "/" ? pathname === "/" : pathname === itemPath || pathname.startsWith(`${itemPath}/`);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={`${className} ${isActive ? activeClassName : ""}`.trim()}
      href={item.href}
      onClick={onClick}
    >
      {showIcon && item.icon ? <StorefrontIcon name={item.icon} size={22} /> : null}
      <span>{item.label}</span>
    </Link>
  );
}
