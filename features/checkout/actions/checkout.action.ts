"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { checkoutFormSchema } from "@/features/checkout/schemas/checkout-form.schema.server";
import { createCashOrder } from "@/lib/api/endpoints/protected/create-cash-order.server";
import { createCheckoutSession } from "@/lib/api/endpoints/protected/create-checkout-session.server";
import { ProtectedApiError } from "@/lib/api/errors.server";
import { requireSession } from "@/lib/auth/require-session.server";
import { getServerEnvironment } from "@/lib/env/server";

export type CheckoutActionState = {
  status: "idle" | "error";
  errors?: {
    cartId?: string[];
    paymentMethod?: string[];
    details?: string[];
    phone?: string[];
    city?: string[];
  };
  message?: string;
};

export async function submitCheckoutAction(
  prevState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  try {
    await requireSession();
  } catch {
    return { status: "error", message: "You must be signed in to checkout." };
  }

  const rawData = {
    cartId: formData.get("cartId"),
    paymentMethod: formData.get("paymentMethod"),
    details: formData.get("details"),
    phone: formData.get("phone"),
    city: formData.get("city"),
  };

  const parsed = checkoutFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors in the form.",
    };
  }

  const { cartId, paymentMethod, details, phone, city } = parsed.data;
  const shippingAddress = { details, phone, city };

  if (paymentMethod === "cash") {
    try {
      await createCashOrder(cartId, shippingAddress);
      
      revalidatePath("/cart");
      revalidatePath("/account/orders");
      // Fallback for neutral redirect
    } catch (error: unknown) {
      if (error instanceof ProtectedApiError) {
        if (error.code === "invalid-request") {
          return { status: "error", message: "Invalid request. Your cart might be empty." };
        }
        return { status: "error", message: "Failed to place order. Please try again." };
      }
      return { status: "error", message: "An unexpected error occurred." };
    }
    redirect("/account/orders?status=success");
  } else {
    // Online checkout
    let checkoutUrl = "";
    try {
      const appOrigin = getServerEnvironment().appOrigin;
      const session = await createCheckoutSession(cartId, shippingAddress, appOrigin);
      
      if (!session.url.startsWith("https://checkout.stripe.com/")) {
        return { status: "error", message: "Invalid payment gateway URL returned." };
      }
      checkoutUrl = session.url;
    } catch (error: unknown) {
      if (error instanceof ProtectedApiError) {
        return { status: "error", message: "Failed to create checkout session. Please try again." };
      }
      return { status: "error", message: "An unexpected error occurred." };
    }
    
    redirect(checkoutUrl);
  }
}
