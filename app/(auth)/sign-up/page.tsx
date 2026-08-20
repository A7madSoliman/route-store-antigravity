import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { normalizeReturnTo } from "@/lib/auth/return-to.server";
import { getSession } from "@/lib/auth/session.server";

export const metadata: Metadata = { title: "Create Account | Nexa Store" };

type Props = { searchParams: Promise<{ returnTo?: string | string[] }> };

export default async function SignUpPage({ searchParams }: Props) {
  const session = await getSession();
  const params = await searchParams;
  const raw = typeof params.returnTo === "string" ? params.returnTo : undefined;
  const returnTo = normalizeReturnTo(raw);

  if (session) {
    redirect(returnTo || "/account/profile");
  }

  return (
    <AuthShell
      headerAction={
        <div className="hidden items-center gap-2 text-body-small text-text-muted md:flex">
          <span>Already have an account?</span>
          <Link className="font-semibold text-brand-primary hover:underline" href="/sign-in">
            Login
          </Link>
        </div>
      }
      footer={
        <div className="md:hidden">
          Already have an account?{" "}
          <Link className="font-semibold text-brand-primary hover:underline" href="/sign-in">
            Sign In
          </Link>
        </div>
      }
    >
      <div className="mb-8 text-center">
        <div className="hidden md:block">
          <h1 className="text-heading-2 font-semibold text-text-primary">Create Account</h1>
          <p className="mt-2 text-body text-text-muted">Join our premium retail experience.</p>
        </div>
        <div className="md:hidden">
          <h1 className="text-heading-2 font-semibold text-text-primary">Join Nexa</h1>
          <p className="mt-2 text-body text-text-muted">Discover premium tech and lifestyle curated for you.</p>
        </div>
      </div>
      <SignUpForm returnTo={returnTo} />
    </AuthShell>
  );
}
