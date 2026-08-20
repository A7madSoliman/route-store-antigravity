"use server";

import { redirect } from "next/navigation";
import { clearSession } from "@/lib/auth/session.server";

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/sign-in");
}
