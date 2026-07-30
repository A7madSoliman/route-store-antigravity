# Implementation Milestones

## Working rules

- Each milestone is intended to be independently committable and testable.
- Do not begin an integration whose required contract gate is unresolved.
- Use the raw collection only as evidence; use the sanitized collection for sharing and examples.
- Do not add endpoints or response fields that are absent from verified evidence.
- “Contract test” below means a local fixture/adapter test until live testing is explicitly authorized.

## M00 — Freeze and review the API contract

Scope:

- Review `API_INVENTORY.md` with the backend owner.
- Confirm the production base URL, `token` header convention, and trailing-slash behavior.
- Obtain sanitized success and error examples for all endpoints needed by the first release.
- Confirm path-ID meanings and required/optional request fields.

Verification:

- A decision log resolves A1–A9 from the PRD or marks a feature deferred.
- No credential or personal test data enters the repository.

## M01 — Define response fixtures and validation boundaries

Scope:

- Create reviewed fixtures from sanitized backend examples.
- Record success/error status codes and pagination envelopes.
- Define runtime validation behavior for unexpected payloads.

Verification:

- Fixture schema checks cover each enabled release endpoint.
- Malformed and incomplete fixtures produce safe failures.

Dependency: M00.

## M02 — Establish application shell and route guards

Scope:

- Build the shared storefront/account layout and navigation.
- Add loading, not-found, error, and unauthorized boundaries.
- Add guards for authenticated routes without enabling admin routes.

Verification:

- Route-level tests cover anonymous and authenticated navigation.
- Keyboard focus moves correctly after navigation/errors.

## M03 — Add API base configuration and request transport

Scope:

- Configure the confirmed base URL.
- Implement public and token-header request paths.
- Normalize backend errors without logging tokens or personal fields.

Verification:

- Unit tests confirm URL composition, exact endpoint spellings, token-header injection, redaction, timeout, and cancellation behavior.

Dependency: M00.

## M04 — Product list foundation

Scope:

- Integrate `GET /products`.
- Render loading, empty, success, malformed-response, and network-failure states.
- Add pagination only after its response contract is verified.

Verification:

- Adapter/component tests cover every state using fixtures.
- Generated requests contain only verified query keys.

Dependencies: M01, M03.

## M05 — Product detail

Scope:

- Integrate `GET /products/{id}` at `/products/[productId]`.
- Add invalid-ID and not-found states based on verified errors.

Verification:

- Route tests cover valid, missing, malformed, and failed product responses.

Dependencies: M01, M03.

## M06 — Categories

Scope:

- Integrate category list, category detail, and category-subcategory requests.
- Link category navigation to supported product filtering only after encoding is verified.

Verification:

- Tests cover all three requests, empty subcategories, not found, and filter URL serialization.

Dependencies: M01, M03, M04.

## M07 — Subcategory directory and detail

Scope:

- Integrate `GET /subcategories` and `GET /subcategories/{id}`.
- Keep product association out of scope unless a verified product filter supports it.

Verification:

- Route tests cover list/detail success, empty, not found, and failure.

Dependencies: M01, M03.

## M08 — Brands

Scope:

- Integrate brand list and detail.
- Connect verified brand filtering to the product list.

Verification:

- Tests cover brand states and exact `brand` query serialization.
- GET requests send no body unless M00 proves otherwise.

Dependencies: M01, M03, M04.

## M09 — Product search, sort, and filters

Scope:

- Add only verified controls among `keyword`, `sort`, `fields`, price bounds, brand, category, `limit`, and `page`.
- Keep filter state in shareable URLs.

Verification:

- Parameterized tests cover encoding, clearing, back/forward navigation, invalid values, and duplicate category behavior.

Dependencies: M00, M04.

## M10 — Sign-up and sign-in

Scope:

- Implement signup and sign-in forms.
- Establish the chosen secure session mechanism from the verified top-level token.
- Preserve and validate return destinations.

Verification:

- Tests cover validation, success, invalid credentials, duplicate account, malformed response, safe redirects, and token redaction.

Dependencies: M00, M01, M03.

## M11 — Password recovery

Scope:

- Implement forgot-password, reset-code verification, and password reset as three explicit steps.
- Carry only the verified proof between steps.

Verification:

- Tests cover success, invalid/expired code, retry, direct-step access, and rate-limit errors.

Dependencies: M00, M01, M03.

## M12 — Account profile and password change

Scope:

- Implement profile update and authenticated password change.
- Do not add a profile-read call; initialize data only from a verified session source.

Verification:

- Tests cover update success, conflicts, validation, expired auth, token rotation if applicable, and prevention of secret logging.

Dependencies: M10, verified user/session contract.

## M13 — Wishlist read and add

Scope:

- Implement authenticated wishlist loading and add-product mutation.
- Reconcile after mutation when the returned payload is incomplete.

Verification:

- Tests cover anonymous redirect, empty list, add success, duplicate add, invalid product, auth failure, and rapid repeated clicks.

Dependencies: M05, M10.

## M14 — Wishlist removal

Scope:

- Confirm whether the path ID is a product or wishlist-entry ID.
- Implement removal with pending and rollback/refetch behavior.

Verification:

- Tests assert the verified ID is used and cover success, idempotency/not found, failure, and auth expiry.

Dependencies: M00, M13.

## M15 — Cart read and add

Scope:

- Implement authenticated cart loading and add-to-cart.
- Render server-authoritative lines and totals.

Verification:

- Tests cover anonymous redirect, empty cart, add success, stock failure, invalid product, malformed totals, and auth expiry.

Dependencies: M05, M10, verified cart response.

## M16 — Cart quantity, remove, and clear

Scope:

- Confirm cart path-ID semantics and `count` type.
- Implement quantity update, line removal, and confirmed clear-cart.

Verification:

- Tests cover quantity bounds, rapid changes, stock conflict, exact ID/type serialization, remove failure, clear cancellation, and reconciliation.

Dependencies: M00, M15.

## M17 — Address list and detail

Scope:

- Implement authenticated address list and read-only detail.
- Do not show edit controls.

Verification:

- Tests cover anonymous redirect, empty list, detail success, ownership/not found, and auth failure.

Dependencies: M10, verified address response.

## M18 — Address add and remove

Scope:

- Implement add-address form and confirmed deletion.
- Apply only verified validation rules.

Verification:

- Tests cover required fields, backend validation, success, delete cancellation/failure, and reconciliation.

Dependencies: M17.

## M19 — Checkout preparation

Scope:

- Require a non-empty authenticated cart.
- Collect shipping address fields and payment choice.
- If saved addresses are used, map only verified fields.

Verification:

- Tests cover missing cart, stale cart, manual/saved address selection, validation, auth expiry, and duplicate-submit prevention.

Dependencies: M16, M18, verified checkout contracts.

## M20 — Cash checkout

Scope:

- Confirm `{id}` is the cart ID.
- Submit cash order and reconcile cart/order state.
- Render confirmation only from verified response fields.

Verification:

- Tests cover success, stock/price change, validation error, duplicate submission, ambiguous network failure, and auth expiry.

Dependencies: M00, M19.

## M21 — Online checkout session and return

Scope:

- Confirm allowed `url` format and response redirect field.
- Create checkout session, validate the destination, and redirect.
- Add a neutral return route that refreshes supported server state.

Verification:

- Tests cover session success, rejected return URL, unsafe redirect, provider cancel/return, missing payment status, network ambiguity, and duplicate submission.

Dependencies: M00, M19.

## M22 — Customer order history

Scope:

- Verify authentication and ownership enforcement for `GET /orders/user/{id}`.
- Implement `/account/orders` only after approval.

Verification:

- Security test confirms one customer cannot request another customer’s orders.
- UI tests cover loading, empty, success, failure, and unauthorized states.

Dependencies: M00, M10, M20/M21.

## M23 — Conditional admin read-only routes

Scope:

- Verify role source and backend authorization for all-users and all-orders requests.
- Add feature-flagged `/admin/users` and `/admin/orders` only if verified.
- Do not add admin mutations.

Verification:

- Backend enforcement tests cover anonymous, customer, and admin access.
- Route tests confirm admin UI/navigation is absent for non-admins.
- Sensitive fields are excluded from UI, logs, and analytics.

Dependency: explicit admin authorization decision from M00.

## M24 — Production hardening

Scope:

- Complete accessibility, responsive behavior, metadata, performance budgets, observability redaction, security headers, and recovery-state review.
- Exercise catalog, auth, wishlist, cart, address, checkout, and enabled order flows end to end.

Verification:

- Automated accessibility and keyboard checks pass on all primary routes.
- End-to-end tests cover both happy paths and critical failures.
- No token, password, reset code, email, phone, address, or customer/order payload is captured by client logs or analytics.
- Build, lint, type checks, and the agreed test suite pass.
