import type { ReactNode } from "react";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { getSession } from "@/lib/auth/session.server";

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const accountHref = session ? "/account/profile" : "/sign-in?returnTo=%2Faccount%2Fprofile";
  return <StorefrontShell accountHref={accountHref}>{children}</StorefrontShell>;
}
