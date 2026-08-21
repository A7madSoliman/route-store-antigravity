# Checkout Session Creation

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Checkout session` |
| HTTP method | `POST` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/{cartId}?url={returnBase}` |
| Normalized endpoint | `/orders/checkout-session/{cartId}` |
| Authentication category | Protected; custom `token` header required |
| Observed success status | `200` |
| Capture completed | `2026-08-21T08:22:55Z` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | Stripe checkout URLs, session IDs, and email addresses were redacted before this record was written. |

## Path parameter

| Parameter | Meaning | Evidence |
|---|---|---|
| `{cartId}` | The `_id` of the user's current cart, obtained from `GET /cart` | Same cart ID pattern as cash orders |

## Query parameter

| Parameter | Meaning | Evidence |
|---|---|---|
| `url` | The base URL that the server uses to construct `success_url` and `cancel_url` for Stripe | Server appends `/allorders` and `/cart` to the provided value |

## URL construction behavior

The API appends fixed path suffixes to whatever `url` value is supplied:

| Provided `url` | Resulting `success_url` | Resulting `cancel_url` |
|---|---|---|
| `http://localhost:3000` | `http://localhost:3000/allorders` | `http://localhost:3000/cart` |
| `http://localhost:3000/checkout/online/return` | `http://localhost:3000/checkout/online/return/allorders` | `http://localhost:3000/checkout/online/return/cart` |
| `https://example.com` | `https://example.com/allorders` | `https://example.com/cart` |

**Important**: The API does not validate or restrict the `url` parameter value. Any URL is accepted. The frontend must construct the `url` parameter to match its own routing so that `/allorders` and `/cart` append correctly. These fixed suffixes cannot be changed.

## Safe request body

```json
{
  "shippingAddress": {
    "details": "<details>",
    "phone": "<phone>",
    "city": "<city>"
  }
}
```

Identical body shape to cash order creation.

## Safe success response example (200)

```json
{
  "status": "success",
  "session": {
    "url": "<checkout-url>",
    "success_url": "<success-url>",
    "cancel_url": "<cancel-url>"
  }
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Response root |
| `$.status` | string | Value `"success"` |
| `$.session` | object | Stripe checkout session metadata |
| `$.session.url` | string | Full Stripe Checkout URL starting with `https://checkout.stripe.com/c/pay/cs_test_...` |
| `$.session.success_url` | string | `{url}/allorders` — the URL Stripe redirects to on payment success |
| `$.session.cancel_url` | string | `{url}/cart` — the URL Stripe redirects to on payment cancel |

Note: The session object contains only three fields (`url`, `success_url`, `cancel_url`). Other Stripe session fields (e.g., `client_reference_id`, `customer_email`, `amount_total`) are **not** included in the API response. The frontend must rely only on these three fields.

## Payment provider

The checkout URL domain is `checkout.stripe.com`, confirming Stripe as the payment gateway. The URL path prefix `cs_test_` confirms this is a Stripe test-mode session.

## Redirect field for frontend

The `$.session.url` field is the redirect destination. The frontend must:
1. Validate that the URL starts with `https://checkout.stripe.com/` before redirecting.
2. Never expose the raw session URL in client-side state, logs, or serialized props.

## Cart lifecycle after checkout session creation

Unlike cash orders, the checkout session creation does **not** clear the cart immediately. The cart remains active with its items until payment is completed or the session expires.

## Unknown behavior

- Whether the Stripe session expires and what the expiry window is.
- Whether the same cart can create multiple checkout sessions.
- Whether payment completion triggers server-side cart clearing.
- Whether the `url` parameter has length limits or character restrictions.
- Error responses for invalid cart IDs, empty carts, or expired carts.
- Whether the `success_url` and `cancel_url` are actually used by Stripe or if other query parameters are appended by Stripe on redirect.
- Whether the response includes additional Stripe session fields in production mode.

## Related decisions

- `CHECKOUT-001` — The redirect field is `$.session.url`. The destination must be validated as `https://checkout.stripe.com/` before navigation. Only three fields are returned: `url`, `success_url`, and `cancel_url`.
- `CHECKOUT-003` — The API appends `/allorders` for success and `/cart` for cancel to the provided base URL. The frontend should provide `APP_ORIGIN` as the `url` parameter so redirects map to its own routing. Since the API appends fixed suffixes that don't match our route structure, the frontend must handle these redirects appropriately (e.g., redirect `/allorders` → `/account/orders` if enabled, or show a neutral return page).
- `CHECKOUT-004` — Shipping address body matches cash orders: `details`, `phone`, `city` only. No `name` field.
