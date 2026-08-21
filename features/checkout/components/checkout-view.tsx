"use client";

import { useActionState, useState } from "react";
import { CheckoutAddressSelector } from "./checkout-address-selector";
import { CheckoutPaymentMethod } from "./checkout-payment-method";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { submitCheckoutAction, type CheckoutActionState } from "../actions/checkout.action";
import type { Cart } from "@/types/cart";
import type { Address } from "@/types/address";

const initialState: CheckoutActionState = { status: "idle" };

type CheckoutViewProps = {
  cart: Cart;
  savedAddresses: Address[];
};

export function CheckoutView({ cart, savedAddresses }: CheckoutViewProps) {
  const [state, formAction] = useActionState(submitCheckoutAction, initialState);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  return (
    <form action={formAction} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <input type="hidden" name="cartId" value={cart.id} />

      <div className="lg:col-span-8 space-y-6">
        {state.status === "error" && state.message && (
          <div className="bg-error-container text-error-text p-4 rounded-lg flex items-start gap-3 border border-error/20">
            <div className="mt-0.5">⚠️</div>
            <p className="text-body-small font-medium">{state.message}</p>
          </div>
        )}

        <CheckoutAddressSelector savedAddresses={savedAddresses} errors={state.errors} />
        
        <CheckoutPaymentMethod 
          selectedMethod={paymentMethod} 
          onMethodChange={setPaymentMethod} 
          errors={state.errors} 
        />
      </div>

      <div className="lg:col-span-4">
        <CheckoutOrderSummary cart={cart} paymentMethod={paymentMethod} />
      </div>
    </form>
  );
}
