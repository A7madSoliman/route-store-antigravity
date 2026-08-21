"use client";

type CheckoutPaymentMethodProps = {
  selectedMethod: "cash" | "card";
  onMethodChange: (method: "cash" | "card") => void;
  errors?: {
    paymentMethod?: string[];
  };
};

export function CheckoutPaymentMethod({
  selectedMethod,
  onMethodChange,
  errors,
}: CheckoutPaymentMethodProps) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
      <h2 className="text-heading-3 font-semibold text-text-primary mb-6">Payment Method</h2>

      <div className="space-y-4">
        {/* Cash on Delivery Option */}
        <label
          className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedMethod === "cash"
              ? "border-brand-primary bg-brand-primary/5"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={selectedMethod === "cash"}
              onChange={() => onMethodChange("cash")}
              className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-slate-300"
            />
          </div>
          <div className="ml-3 flex-1">
            <div className="font-semibold text-text-primary flex justify-between items-center">
              <span>Cash on Delivery</span>
              <span className="text-xl">💵</span>
            </div>
            <div className="text-body-small text-text-secondary mt-1">
              Pay with cash when your order is delivered to your address.
            </div>
          </div>
        </label>

        {/* Credit/Debit Card Option */}
        <label
          className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedMethod === "card"
              ? "border-brand-primary bg-brand-primary/5"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={selectedMethod === "card"}
              onChange={() => onMethodChange("card")}
              className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-slate-300"
            />
          </div>
          <div className="ml-3 flex-1">
            <div className="font-semibold text-text-primary flex justify-between items-center">
              <span>Credit / Debit Card</span>
              <span className="text-xl">💳</span>
            </div>
            <div className="text-body-small text-text-secondary mt-1">
              Safe and secure online payment powered by Stripe.
            </div>
          </div>
        </label>
      </div>

      {errors?.paymentMethod && (
        <p className="mt-2 text-caption text-error">{errors.paymentMethod[0]}</p>
      )}
    </section>
  );
}
