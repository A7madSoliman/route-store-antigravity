import type { StorefrontIconName } from "@/components/icons/storefront-icons";

export type NavigationItem = {
  label: string;
  href: string;
  icon?: StorefrontIconName;
};

export const ACCOUNT_HREF = "/sign-in?returnTo=%2Faccount%2Fprofile";

export const primaryNavigation: NavigationItem[] = [
  { label: "Shop", href: "/products", icon: "store" },
  { label: "Categories", href: "/categories", icon: "categories" },
  { label: "Brands", href: "/brands", icon: "store" },
];

export const utilityNavigation: NavigationItem[] = [
  { label: "Search products", href: "/products", icon: "search" },
  { label: "Wishlist", href: "/wishlist", icon: "heart" },
  { label: "Cart", href: "/cart", icon: "cart" },
  { label: "Account", href: ACCOUNT_HREF, icon: "account" },
];

export const storefrontBottomNavigation: NavigationItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Shop", href: "/products", icon: "store" },
  { label: "Wishlist", href: "/wishlist", icon: "heart" },
  { label: "Account", href: ACCOUNT_HREF, icon: "account" },
  { label: "Cart", href: "/cart", icon: "cart" },
];

export const footerNavigation = [
  {
    label: "Shop",
    items: primaryNavigation,
  },
  {
    label: "Your account",
    items: [
      { label: "Wishlist", href: "/wishlist", icon: "heart" as const },
      { label: "Cart", href: "/cart", icon: "cart" as const },
      { label: "Account", href: ACCOUNT_HREF, icon: "account" as const },
    ],
  },
];
