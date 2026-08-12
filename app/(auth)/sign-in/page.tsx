import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { normalizeReturnTo } from "@/lib/auth/return-to.server";
export const metadata: Metadata = { title: "Sign In | Nexa Store" };
type Props = { searchParams: Promise<{ returnTo?: string | string[] }> };
export default async function SignInPage({ searchParams }: Props) { const params = await searchParams; const returnTo = normalizeReturnTo(typeof params.returnTo === "string" ? params.returnTo : undefined); return <AuthShell footer={<div className="md:hidden">Don&apos;t have an account? <Link className="font-semibold text-brand-primary hover:underline" href="/sign-up">Create an Account</Link></div>}><div className="mb-8 text-center"><div className="hidden md:block"><h1 className="text-heading-2 font-semibold text-text-primary">Sign In</h1><p className="mt-2 text-body text-text-muted">Welcome back! Please enter your details.</p></div><div className="md:hidden"><h1 className="text-heading-2 font-semibold text-text-primary">Welcome Back</h1><p className="mt-2 text-body text-text-muted">Sign in to your account to continue shopping.</p></div></div><SignInForm returnTo={returnTo} /></AuthShell>; }
