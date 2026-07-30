# Product Requirements Document

## 1. Project objective

Build a production-quality ecommerce frontend with Next.js App Router for the customer and conditional administrator capabilities evidenced by the Postman collection. The product should let customers discover catalog items, manage authentication and account data, use a wishlist and cart, manage addresses, complete cash or online checkout, and review their orders.

This document is an API-backed scope definition, not a claim that undocumented backend behavior exists. No application implementation is part of this planning task.

## 2. Source boundaries

The raw Postman collection is the primary source. The planned product includes only behaviors backed by its 33 requests.

Explicit exclusions because the collection has no supporting request:

- Catalog administration or inventory editing.
- Address editing.
- Logout, token refresh, or current-user lookup.
- Product reviews or ratings submission.
- Coupons or promotions.
- Order detail lookup by order ID, cancellation, returns, refunds, or tracking.
- Payment webhook/status polling.
- Search suggestions or recommendations.

## 3. Assumptions and decisions awaiting verification

- A1 — API host: use `https://ecommerce.routemisr.com/api/v1` as the planning default. Confirm before implementation because the collection also contains unresolved/unused host variables.
- A2 — Public catalog: category, subcategory, brand, and product reads are assumed public because no token is shown.
- A3 — Session acquisition: signup and sign-in return a top-level `token`, based only on Postman test scripts.
- A4 — Protected actions: any request carrying the custom `token` header requires an authenticated customer.
- A5 — Identifier semantics: hardcoded path IDs are treated as the resource suggested by the request name/path, but the collection does not formally declare them.
- A6 — Customer orders: `GET /orders/user/{id}` is the only candidate for order history. Do not expose it until authentication and ownership rules are verified.
- A7 — Admin scope: `GET /users` and `GET /orders` are conditional admin candidates, not customer features, until roles and permissions are confirmed.
- A8 — Online payment: a checkout-session response is expected to provide enough information to redirect to a payment provider, but the exact field is unknown.
- A9 — Response contracts: UI data models and detailed acceptance tests remain provisional until representative success/error responses are captured.

## 4. Product principles

- Never place API tokens in public URLs, logs, analytics events, or client-visible error reports.
- Require authentication before protected UI actions and preserve the intended destination through sign-in.
- Treat server totals, availability, and order results as authoritative.
- Show recoverable states for loading, empty results, validation failures, authorization failures, and network errors.
- Avoid presenting admin navigation unless role authorization is verified.
- Preserve the exact API endpoint spellings and custom `token` header until the backend contract is validated.

## 5. Customer user flows

### 5.1 Browse and discover

1. Customer opens the storefront or a catalog listing.
2. Frontend loads products and may load categories and brands for navigation/filtering.
3. Customer may enable supported query controls: keyword, pagination, limit, sorting, selected fields, price bounds, brand, and category.
4. Customer opens a product, category, subcategory, or brand view.
5. Empty, failed, and not-found states are displayed without fabricating data.

Acceptance boundaries:

- All list controls must serialize only query keys present in the collection.
- The duplicate-category filter encoding must remain behind a verified adapter.
- The UI must not promise inventory, variants, reviews, or discount behavior until those response fields are observed.

### 5.2 Authenticated shopping

1. Anonymous customer attempts wishlist, cart, address, checkout, or account action.
2. Frontend sends the customer to sign-in and preserves the intended return route.
3. After successful authentication, frontend retries only an explicitly user-initiated safe action.
4. Protected requests send the token using the collection’s `token` header convention.
5. An authorization failure clears or invalidates the local session according to the eventual session design and returns the customer to sign-in.

## 6. Authentication flows

### 6.1 Sign up

Inputs: `name`, `email`, `password`, `rePassword`, `phone`.

Flow:

1. Collect the five API-backed fields.
2. Apply client validation only after backend constraints are confirmed; at minimum, require the fields the product presents as mandatory.
3. Submit `POST /auth/signup`.
4. On success, consume the top-level `token` evidenced by the Postman test and establish a session.
5. On failure, render the backend error without exposing secrets.

Unknowns: password rules, phone format, requiredness, duplicate-user errors, response user object, token lifetime.

### 6.2 Sign in

Inputs: `email`, `password`.

Flow:

1. Submit `POST /auth/signin`.
2. On success, consume the evidenced top-level `token`.
3. Continue to the preserved destination or account/storefront default.
4. Show a generic, safe error for invalid credentials.

Unknowns: token lifetime, error format, refresh behavior, user/role data source.

### 6.3 Forgot and reset password

1. Submit email to `POST /auth/forgotPasswords`.
2. Collect the reset code and submit it to `POST /auth/verifyResetCode`.
3. After successful verification, collect email and new password and submit `PUT /auth/resetPassword`.
4. Return the customer to sign-in or establish a session only if the verified response contract supports it.

The collection does not show how successful code verification authorizes the reset request. The frontend must not assume an undocumented token, cookie, or timing rule.

### 6.4 Account updates

- Profile: authenticated customer edits `name`, `email`, and `phone`, then submits `PUT /users/updateMe`.
- Password: authenticated customer submits `currentPassword`, `password`, and `rePassword` to `PUT /users/changeMyPassword`.

Unknowns: partial update support, whether password change rotates the token, and how to obtain initial current-user data.

## 7. Catalog flows

### 7.1 Categories and subcategories

- List categories with `GET /categories`.
- View one category with `GET /categories/{id}`.
- List all subcategories with `GET /subcategories`.
- View one subcategory with `GET /subcategories/{id}`.
- List a category’s subcategories with `GET /categories/{id}/subcategories`.

The UI may compose category detail and category-subcategory requests. Product filtering by category is supported only through the product-list query.

### 7.2 Brands

- List brands with `GET /brands`.
- View a brand with `GET /brands/{id}`.
- Product filtering by brand uses the `brand` product-list query parameter.

### 7.3 Products and search/filter

- List products with `GET /products`.
- View a product with `GET /products/{id}`.
- Supported candidate controls: `limit`, `page`, `keyword`, `sort`, `fields`, `price[gte]`, `price[lte]`, `brand`, and `category[in]`.

All candidate query parameters are disabled in the source example. Their allowed values and combination behavior must be verified before UI controls are finalized.

## 8. Wishlist flow

Authentication is required based on the `token` header.

1. Load the customer wishlist with `GET /wishlist`.
2. Add a product with `POST /wishlist` and body `productId`.
3. Remove a product with `DELETE /wishlist/{id}`.
4. Keep mutation controls pending until the server confirms success, and reconcile with a refetch when the returned shape is unknown.

Unknowns: whether remove uses product ID or wishlist-entry ID, duplicate-add behavior, response payloads, ordering, and pagination.

## 9. Cart flow

Authentication is required based on the `token` header.

1. Load the cart with `GET /cart`.
2. Add a product with `POST /cart` and body `productId`.
3. Change a line quantity with `PUT /cart/{id}` and body `count`.
4. Remove a line with `DELETE /cart/{id}`.
5. Clear all lines with `DELETE /cart`.
6. Use server-returned totals and availability once the response contract is known.

Unknowns: whether `{id}` is a product or cart-line ID, numeric type and bounds for `count`, stock handling, currency/totals fields, and empty-cart shape.

## 10. Address flow

Authentication is required based on the `token` header.

1. List saved addresses with `GET /addresses`.
2. Add an address with `POST /addresses` using `name`, `details`, `phone`, and `city`.
3. View a saved address with `GET /addresses/{id}` when needed.
4. Remove an address with `DELETE /addresses/{id}` after confirmation.

There is no address-update endpoint. The UI must not offer edit-in-place; a replace flow would require explicit customer confirmation and should not be implemented until desired.

## 11. Checkout flows

### 11.1 Shared checkout preparation

1. Require an authenticated customer and a non-empty server cart.
2. Collect or select shipping values corresponding to `details`, `phone`, and `city`.
3. Present the server-derived cart summary when the response contract is available.
4. Require the customer to select cash or online payment.
5. Prevent duplicate submissions while a checkout request is pending.

The address object used by order endpoints lacks the saved-address `name` field. Passing a selected saved address into checkout is a frontend mapping assumption.

### 11.2 Cash checkout

1. Submit `POST /orders/{id}` with `shippingAddress`.
2. Treat `{id}` as the cart ID only after verification.
3. Show order confirmation using only fields returned by the API.
4. Reconcile the cart after success.

Unknowns: status/order schema, cart clearing behavior, totals, currency, stock race behavior, and retry/idempotency semantics.

### 11.3 Online checkout

1. Submit `POST /orders/checkout-session/{id}` with `shippingAddress` and the `url` query parameter.
2. Read the verified checkout-session/redirect field from the response.
3. Navigate the customer to the payment provider.
4. On return, show a neutral result state and refresh order/cart state.

The collection contains no payment-status endpoint, webhook, or explicit success/cancel callback contract. The frontend must not declare payment success from query parameters alone.

## 12. Order history flow

Conditional customer flow:

1. Obtain the authenticated user ID from a verified session/user contract.
2. Call `GET /orders/user/{id}` only if backend ownership enforcement is confirmed.
3. Display an order list using verified response fields.
4. Provide loading, empty, failed, and unauthorized states.

There is no order-detail endpoint. A detail route may render data already present in the verified list response only if that response is sufficiently complete; otherwise it is out of scope.

## 13. Conditional admin flows

Admin routes must remain feature-flagged and inaccessible until role claims/source and backend permission enforcement are verified.

### 13.1 User directory

- Use `GET /users` with optional `limit` and `keyword`.
- Never expose password, reset, or token material.
- Pagination and user fields are unknown.

### 13.2 All-orders directory

- Use `GET /orders`.
- Treat all customer/order data as sensitive.
- Pagination, filtering, fields, and role requirements are unknown.

No create, update, or delete admin operation is supported by the collection.

## 14. Production acceptance gates

- Every integrated request uses the confirmed API base and exact endpoint spelling.
- Protected requests use the confirmed header convention and do not leak credentials.
- All rendered response fields come from captured, reviewed examples or a verified schema.
- Each flow has loading, empty, success, validation, network, unauthorized, and not-found states as applicable.
- Mutations prevent accidental duplicate submission and reconcile with server state.
- Customer routes meet keyboard, focus, labeling, and error-announcement accessibility requirements.
- Admin routes are absent or denied unless both frontend role evidence and backend authorization are confirmed.
- Checkout never infers payment success without verified server evidence.
