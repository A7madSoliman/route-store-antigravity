# API Inventory

## Source and interpretation rules

- Primary source: `docs/api/raw/Route E-commerce App.postman_collection.json`.
- Source collection: Postman Collection v2.1, 33 requests in 9 top-level feature folders.
- Reference API base supplied for this project: `https://ecommerce.routemisr.com/api/v1`.
- Paths below are relative to the reference `/api/v1` base, with trailing slashes removed and hardcoded identifiers replaced by `{id}`. No endpoint has been added.
- A `token` request header is treated as authentication evidence even though those requests set Postman's auth mode to `noauth`.
- “No auth shown” means only that the collection supplies no auth header or Postman auth configuration. It is not proof that the live endpoint is public.
- Query parameters marked “disabled” exist in the collection but are not sent unless enabled.
- The source does not formally define any path variables; all `{id}` parameters below were hardcoded values in the raw URLs.

## Response evidence applying to all requests

There are no saved response examples, response schemas, documented status codes, or documented error bodies for any of the 33 requests. The signup and sign-in test scripts read a top-level JSON field named `token`; that is the only response-field evidence in the collection. All other success payloads, pagination envelopes, validation errors, authorization errors, and not-found behavior require verification.

## Categories

| Request | Method and normalized path | Authentication | Parameters | Request body | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Get All Categories | `GET /categories` | No auth shown; assumed public for planning | Query: `limit`, `page`, `keyword` (all disabled) | None; source contains a raw `null` body | None | Status, list shape, pagination metadata, field types, filter semantics, errors |
| Get specific category | `GET /categories/{id}` | No auth shown; assumed public for planning | Path: `id` (category inferred from request name) | None | None | Status, category shape, invalid-ID/not-found errors |

## Subcategories

| Request | Method and normalized path | Authentication | Parameters | Request body | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Get All SubCategories | `GET /subcategories` | No auth shown; assumed public for planning | Query: `limit` (disabled) | None; source contains a raw `null` body | None | Status, list/pagination shape, field types, errors |
| Get specific SubCategory | `GET /subcategories/{id}` | No auth shown; assumed public for planning | Path: `id` (subcategory inferred from request name) | None | None | Status, subcategory shape, invalid-ID/not-found errors |
| Get All SubCategories On Category | `GET /categories/{id}/subcategories` | No auth shown; assumed public for planning | Path: `id` (category inferred from path) | None | None | Status, list shape, pagination behavior, errors |

## Brands

| Request | Method and normalized path | Authentication | Parameters | Request body | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Get All Brands | `GET /brands` | No auth shown; assumed public for planning | Query: `limit`, `keyword` (both disabled) | No fields; source has an empty `form-data` body on this GET | None | Status, list/pagination shape, keyword behavior, errors; whether the GET body should be removed |
| Get specific brand | `GET /brands/{id}` | No auth shown; assumed public for planning | Path: `id` (brand inferred from request name) | None | None | Status, brand shape, invalid-ID/not-found errors |

## Products

| Request | Method and normalized path | Authentication | Parameters | Request body | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Get All Products | `GET /products` | No auth shown; assumed public for planning | Query, all disabled: `limit`, `sort`, `fields`, `price[gte]`, `page`, `keyword`, `brand`, `price[lte]`, and two `category[in]` entries | None; source contains a raw `null` body | None | Status, product/list shape, pagination metadata, allowed sort/field values, filter combination rules, duplicate `category[in]` behavior, errors |
| Get specific Product | `GET /products/{id}` | No auth shown; assumed public for planning | Path: `id` (product inferred from request name) | None | None | Status, product shape, image/stock/price field types, invalid-ID/not-found errors |

## Authentication and user account

| Request | Method and normalized path | Authentication | Parameters | Request body fields | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Signup | `POST /auth/signup` | No auth shown; expected pre-auth flow | None | `name`, `email`, `password`, `rePassword`, `phone` — all encoded as strings | Test script reads top-level JSON `token` and stores it in Postman environment variable `JWT` | Status, complete success schema, user shape, validation rules, duplicate-account errors, token lifetime |
| signin | `POST /auth/signin` | No auth shown; expected pre-auth flow | None | `email`, `password` — strings | Test script reads top-level JSON `token` and stores it in Postman environment variable `JWT` | Status, complete success schema, invalid-credential errors, token lifetime |
| Forgot Password | `POST /auth/forgotPasswords` | No auth shown; expected pre-auth flow | None | `email` — string | None | Status, response shape, account-enumeration behavior, reset delivery channel, retry/rate limits |
| Verify Reset Code | `POST /auth/verifyResetCode` | No auth shown; expected pre-auth flow | None | `resetCode` — string | None | Status, response shape, code length/format/expiry, retry/rate limits, next-step proof |
| Update Logged user password | `PUT /users/changeMyPassword` | `token` header present; required for planning. Postman auth mode is `noauth` | None | `currentPassword`, `password`, `rePassword` — strings | No response fields or status asserted | Success schema/status, validation rules, whether a replacement token is issued, auth failure behavior |
| Reset Password | `PUT /auth/resetPassword` | No token shown; expected to depend on prior reset verification | None | `email`, `newPassword` — strings | None | Status, response shape, linkage to verified code, proof/cookie requirement, validation errors |
| Update Logged user data | `PUT /users/updateMe` | `token` header present; required for planning. Postman auth mode is `noauth` | None | `name`, `email`, `phone` — strings | No response fields or status asserted | Success schema/status, partial-vs-full update behavior, validation and conflict errors |
| Get All Users | `GET /users` | No token shown and Postman auth mode is `noauth`; possibly admin-only | Query: `limit`, `keyword` (both disabled) | None; source contains a raw `null` body | None | Required role/auth, status, user-list schema, pagination, privacy constraints, errors |

## Wishlist

| Request | Method and normalized path | Authentication | Parameters | Request body fields | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Add product to wishlist | `POST /wishlist` | `token` header present; required for planning | None | `productId` — string | None | Status, returned wishlist/product shape, duplicate behavior, invalid-product and auth errors |
| Remove product from wishlist | `DELETE /wishlist/{id}` | `token` header present; required for planning | Path: `id` (product inferred from request name; verify) | None; source contains a raw `null` body | None | Identifier meaning, status/body, idempotency, invalid-ID and auth errors |
| Get logged user wishlist | `GET /wishlist` | `token` header present; required for planning | None | None; source contains a raw `null` body | None | Status, wishlist/product shape, ordering, pagination, errors |

## User addresses

| Request | Method and normalized path | Authentication | Parameters | Request body fields | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Add address | `POST /addresses` | `token` header present; required for planning | None | `name`, `details`, `phone`, `city` — strings | None | Requiredness/validation, address schema, status, address limits, errors |
| Remove address | `DELETE /addresses/{id}` | `token` header present; required for planning | Path: `id` (address inferred from request name) | None; source contains a raw `null` body | None | Status/body, idempotency, invalid-ID/not-found/auth errors |
| Get specific address | `GET /addresses/{id}` | `token` header present; required for planning | Path: `id` (address inferred from request name) | None; source contains a raw `null` body | None | Status, address shape, invalid-ID/not-found/auth errors |
| Get logged user addresses | `GET /addresses` | `token` header present; required for planning | None | None | None | Status, list shape/order, pagination, errors |

The collection contains no endpoint for editing an existing address.

## Cart

| Request | Method and normalized path | Authentication | Parameters | Request body fields | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Add Product To Cart | `POST /cart` | `token` header present; required for planning | None | `productId` — string | None | Status, cart schema, initial quantity behavior, stock/conflict/auth errors |
| Update cart product quantity | `PUT /cart/{id}` | `token` header present; required for planning | Path: `id` (product/cart-line meaning not formally declared) | `count` — encoded as a string in the source | None | Identifier meaning, whether `count` must be number or numeric string, bounds/stock behavior, returned cart shape, errors |
| Get Logged user cart | `GET /cart` | `token` header present; required for planning | None | None; source contains a raw `null` body | None | Status, cart/line/total/currency shape, empty-cart behavior, errors |
| Remove specific cart Item | `DELETE /cart/{id}` | `token` header present; required for planning | Path: `id` (product/cart-line meaning not formally declared) | None; source contains a raw `null` body | None | Identifier meaning, status/body, idempotency, errors |
| Clear user cart | `DELETE /cart` | `token` header present; required for planning | None | None; source contains a raw `null` body | None | Status/body, empty-cart idempotency, errors |

## Orders and checkout

| Request | Method and normalized path | Authentication | Parameters | Request body fields | Known response information | Unknown or missing |
|---|---|---|---|---|---|---|
| Create Cash Order | `POST /orders/{id}` | `token` header present; required for planning | Path: `id` (cart inferred from flow/request context; verify) | `shippingAddress.details`, `shippingAddress.phone`, `shippingAddress.city` — strings | None | Identifier meaning, status/order schema, cart lifecycle, totals/currency, stock/payment errors |
| getAllOrders | `GET /orders` | No token shown and Postman auth mode is `noauth`; possibly admin-only | None | None; source contains a raw `null` body | None | Required role/auth, status, order-list schema, pagination/filtering, privacy constraints, errors |
| getUserOrders | `GET /orders/user/{id}` | No token shown and Postman auth mode is `noauth` | Path: `id` (user inferred from path) | None; source contains a raw `null` body | None | Required role/auth and ownership rule, status, order-list schema, pagination, errors |
| Checkout session | `POST /orders/checkout-session/{id}` | `token` header present; required for planning | Path: `id` (cart inferred from flow/request context; verify). Query: `url` (enabled) | `shippingAddress.details`, `shippingAddress.phone`, `shippingAddress.city` — strings | None | Identifier meaning, accepted return-URL format, checkout-session/redirect schema, payment provider behavior, completion/cancel handling, errors |

The collection has no payment webhook, payment-status lookup, order-detail-by-order-ID, cancellation, return, refund, or shipment-tracking request.

## Collection inconsistencies and risks

### Base URLs and variables

- 30 requests hardcode `https://ecommerce.routemisr.com` and include `/api/v1` in the path.
- Three requests use `{{BaseUrl}}`: Get All Users, Remove address, and Get logged user addresses.
- The collection defines `baseUrl` and `URL`, but does not define `BaseUrl`. Postman variable names are case-sensitive, so those three requests cannot resolve from collection variables as written.
- The defined variables point to Vercel and Render hosts rather than the supplied `ecommerce.routemisr.com` base. Neither defined spelling is referenced by a request.
- Assumption A1: the supplied `https://ecommerce.routemisr.com/api/v1` base is the intended production API. This must be confirmed before implementation; the sanitized collection intentionally preserves the original inconsistency.

### Authentication and credentials

- Sixteen requests carry a manual `token` header while their Postman auth mode is `noauth`.
- Fifteen token-header values were JWT-shaped. Their decoded expiry timestamps range from June 2023 through April 2025, all before the planning date of July 31, 2026, so they should be treated as expired.
- The sixteenth token-header value was not JWT-shaped; its validity and expiry could not be assessed. It was still treated as a credential.
- The sanitized collection replaces all sixteen token-header values with `{{JWT}}`, matching the environment variable populated by the signup and sign-in test scripts.
- No refresh-token, logout, session-introspection, or current-user lookup request is present.
- The token transport is a custom `token` header, not a documented `Authorization: Bearer` scheme. The frontend must not change the header convention without live verification.

### Possible admin or sensitive endpoints

- `GET /users` is likely administrative because it lists all users, but the collection provides no role or auth evidence.
- `GET /orders` is likely administrative because it lists all orders, but the collection provides no role or auth evidence.
- `GET /orders/user/{id}` may be customer order history or an administrative lookup. It accepts a user ID and shows no auth header, so ownership and privacy enforcement must be verified before exposure.
- Assumption A2: these endpoints remain disabled in customer UI until permissions are verified.

### Missing examples and behavioral documentation

- All 33 requests lack saved responses and status-code assertions.
- All requests lack descriptions.
- Four requests contain test scripts, but only signup and sign-in reveal response information: a top-level `token`.
- Required vs optional body fields, field constraints, success statuses, error formats, pagination envelopes, and rate limits are undocumented.

### Fields and encodings requiring live verification

- Cart `count` is encoded as a JSON string; the live API may require a numeric string or a number.
- IDs and `productId` are encoded as strings, but path-ID semantics are not declared in Postman.
- `resetCode` is a string; its length, allowed characters, expiry, and verification proof are unknown.
- `limit`, `page`, and price filters are URL strings by transport; accepted ranges and numeric parsing are unknown.
- `sort` and `fields` accepted values are unknown.
- `category[in]` appears twice in one request. Whether repeated keys, comma-separated IDs, or another encoding is expected is unknown.
- Phone values are strings, but format, country handling, and normalization are unknown.
- The online checkout `url` query parameter has no documented allowlist, encoding, or success/cancel convention.
- Shipping-address and profile field requiredness and validation are unknown.

### Request-shape anomalies

- Several GET and DELETE requests contain a raw `null` body; Get All Brands contains empty `form-data`. Clients should send no body unless live behavior proves it necessary.
- `PUT /users/updateMe/` and `GET /orders/` contain trailing slashes in the raw collection; normalized paths omit them. Redirect and routing tolerance require verification.
- `POST /auth/forgotPasswords` uses a plural endpoint segment. Preserve it exactly in API calls.
- Request-name casing is inconsistent (`signin`, `getAllOrders`, `getUserOrders`), but names do not change endpoint behavior.
