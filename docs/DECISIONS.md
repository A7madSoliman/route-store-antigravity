# Project Decision Register

## Purpose

This register separates confirmed source facts from provisional observations and unresolved choices. Update it after each controlled live-verification, design, architecture, dependency, or deployment milestone in `TASKS.md`.

A live response is evidence about the public third-party API at one point in time; it is not permission to inspect another user, bypass authorization, or enable an unsafe feature. When evidence is insufficient, keep the affected feature Conditional or Deferred and continue with unrelated milestones.

## Status definitions

| Status | Meaning |
|---|---|
| **Open** | No responsible implementation choice can be made from current evidence. |
| **Provisional** | A planning default exists, but controlled live evidence must confirm it before dependent integration. |
| **Confirmed** | Directly supported by the Postman source, existing repository, or sanitized live evidence. Include the evidence location. |
| **Conditional** | Work may proceed only if a named safety, authorization, or contract gate passes. |
| **Deferred** | Intentionally excluded because evidence or supported capability is absent. |
| **Resolved** | A project/architecture/design choice has been made and recorded; reopen only when its assumptions change. |

## Update rules

- Record the date and sanitized evidence path when a live observation changes a status.
- Never paste tokens, cookies, passwords, reset codes, personal emails/phones/addresses, or raw customer/order payloads into this file.
- Use IDs only as redacted placeholders such as `<product-id>` or `<own-user-id>`.
- A single successful response may confirm its observed shape, but it does not prove undocumented lifetime, authorization, idempotency, range, or error guarantees.
- Do not resolve authorization by requesting another user’s resource or by guessing an admin endpoint. Lack of safe evidence keeps the feature Conditional or Deferred.
- If the live API contradicts the inventory, preserve the inventory as source analysis, add sanitized evidence here, and explicitly decide whether the feature adapts or remains disabled.

## Confirmed source and repository facts

| Fact | Status | Evidence |
|---|---|---|
| The source collection contains 33 requests in nine feature folders. | **Confirmed** | `docs/API_INVENTORY.md`; sanitized collection count |
| The only response-field evidence in the collection is a top-level `token` read by signup/sign-in test scripts. | **Confirmed** | `docs/API_INVENTORY.md` response-evidence section |
| Sixteen source requests carried a manual custom `token` header and no Bearer auth configuration. | **Confirmed** | `docs/API_INVENTORY.md` authentication analysis |
| The collection has no address-update request. | **Confirmed** | Address inventory and PRD exclusion |
| The collection has no logout, refresh, or current-user request. | **Confirmed** | Authentication inventory and PRD exclusion |
| The collection has no order-detail, cancellation, return, refund, tracking, webhook, or payment-status request. | **Confirmed** | Orders inventory and PRD exclusions |
| Admin routes and customer order history are conditional. | **Confirmed** | `docs/PRD.md` A6/A7 and `docs/ROUTES.md` |
| Next.js is 16.2.12 with React 19.2.4, TypeScript strict mode, Tailwind 4, and App Router files under `app/`. | **Confirmed** | `package.json`, `tsconfig.json`, and repository tree |
| Local Next 16 documentation is the required implementation reference. | **Confirmed** | Root `AGENTS.md` |
| Filesystem validation found 27 PNG screenshots and 27 HTML exports with 27 matching base filenames and no unmatched files. | **Confirmed** | Direct repository audit on 2026-07-31; `design/stitch/screenshots` and `design/stitch/export` |
| Screenshots are the UI source of truth and exports are reference-only. | **Resolved** | `docs/UI_SPEC.md` source policy |

## API and product decisions

| ID | Question | Status | Current evidence and present decision | Resolve/update milestone | Blocks or constrains |
|---|---|---|---|---|---|
| `API-001` / PRD A1 | What is the API base URL? | **Provisional** | Use `https://ecommerce.routemisr.com/api/v1` for planning. The collection contains inconsistent unused variables and an unresolved `BaseUrl` spelling. | F03/F04 confirm anonymous requests; D10 records the environment value. | All live integration if the host fails or redirects unexpectedly. |
| `API-002` / PRD A2 | Are category, subcategory, brand, and product GETs public? | **Provisional** | No auth is shown, but that is not proof. Inspect only the nine catalog GETs anonymously. | F03, F04. | C01–C09 for any endpoint that does not allow anonymous access. |
| `API-003` / PRD A5 | What do all path IDs represent? | **Open** | Names/paths suggest category, subcategory, brand, product, address, cart/product, cart, and user IDs; the collection does not formally declare them. Use only IDs returned by the corresponding own/list flow. | F03, F04, F09–F12. | Detail routes and mutations using `{id}`. |
| `API-004` / PRD A9 | What are the success/error envelopes, statuses, and field types? | **Open** | No saved responses or schemas exist. Render nothing from guessed fields. | F03–F13, then T00. | All response adapters and UI data models. |
| `API-005` | What pagination envelopes, defaults, and bounds are supported? | **Open** | List requests expose candidate `limit`/`page` parameters, but examples are disabled and response metadata is unknown. | F03–F05. | Pagination controls and list adapters. |
| `API-006` | Which product query values and combinations work? | **Open** | Candidate keys are known; accepted values, combination rules, and duplicate `category[in]` encoding are unknown. | F05. | C09 and filtered links from category/brand pages. |
| `API-007` | Should GET/DELETE bodies and trailing slashes be normalized? | **Provisional** | Plan to send no GET/DELETE body and normalized paths without trailing slash; live tolerance is unknown. Preserve exact endpoint segment spelling such as `forgotPasswords`. | F03–F12. | Request transport serialization. |
| `API-008` | What error/redaction model should the frontend expose? | **Open** | Raw third-party errors may contain unstable or sensitive data. Plan one safe normalized error boundary with logged details redacted. | F03–F13 for shapes; D07 and C01 for architecture. | Error UI, logging, retry logic. |
| `AUTH-001` / PRD A3 | Do signup/sign-in return a usable top-level token? | **Provisional** | Postman tests read `json.token`; full shape and usability are unknown. | F06. | A00, A02, A03 and all protected features. |
| `AUTH-002` / PRD A4 | Is the custom `token` header the required transport? | **Provisional** | Sixteen requests show it; no Bearer scheme is documented. Preserve the custom header until live verification. | F06 and the first protected read in F09–F11. | A00 and protected API transport. |
| `AUTH-003` | What signup/password/phone validation rules apply? | **Open** | Body fields are known, but requiredness, password rules, and phone format are not. | F06–F08. | A01, A02, A07–A09. |
| `AUTH-004` | What proof links reset-code verification to reset password? | **Open** | The collection shows no token/cookie/proof field between the two requests. | F07. | A06, A07. |
| `AUTH-005` | What are token lifetime, refresh, and expiry semantics? | **Open** | No refresh endpoint or token lifetime contract exists; old collection credentials are unusable evidence. | F06/F08 observation; otherwise remain open. | Session expiry UX and long-lived authentication. |
| `AUTH-006` | Where should the frontend session be stored and transported? | **Open** | Security principles favor server-confined/HttpOnly handling, but response and deployment constraints must be checked against Next 16 architecture. | D07. | A00 and all protected routes. |
| `AUTH-007` | Where do current-user ID, profile fields, and role come from? | **Open** | There is no current-user endpoint. Signup/sign-in may return user data, but only `token` is evidenced. | F06, F08; architecture decision D07. | A08, O00, ADM00, account initial state. |
| `AUTH-008` | Does profile/password change rotate or invalidate the token? | **Open** | No response evidence exists. | F08. | A08/A09 reconciliation and continued session behavior. |
| `AUTH-009` | What does sign-out mean without a logout endpoint? | **Provisional** | After D07/A00 resolves the session boundary, sign-out may clear only the application session. It must never claim server token revocation or sign-out from all devices. | D07/A00 confirms storage and clearing mechanics. | Account navigation and expired-session UX. |
| `AUTH-010` | What are reset-code format, expiry, resend, and rate limits? | **Open** | Only a string `resetCode` field is known. | F07. | A05–A07 validation and timers. |
| `ACCOUNT-001` | Does `PUT /users/updateMe` require all fields or allow partial updates? | **Open** | Name, email, and phone are present; partial/full semantics and conflict errors are unknown. | F08. | A08. |
| `WISH-001` | Does wishlist removal use a product ID or wishlist-entry ID? | **Open** | Request name and raw placeholder suggest product ID, but semantics are not formal. | F09. | W03. |
| `WISH-002` | What happens on duplicate wishlist add and what do mutations return? | **Open** | No response examples or idempotency evidence. | F09. | W02/W03 reconciliation strategy. |
| `CART-001` | Does `/cart/{id}` use a product ID or cart-line ID, and what type is `count`? | **Open** | The raw collection labels the placeholder as product ID and encodes count as a string; live semantics are unknown. | F10. | W06/W07. |
| `CART-002` | What are quantity bounds, stock behavior, totals, currency, and empty-cart shape? | **Open** | No response evidence. Server values must be authoritative. | F10. | W04–W08 and checkout summary. |
| `CART-003` | Can product detail select an initial quantity atomically? | **Deferred** | `POST /cart` accepts only `productId`; initial implementation adds one item. Quantity changes occur later in the cart through verified `PUT /cart/{id}` behavior. Never repeat POST requests to emulate quantity. | Reopen only if F10 or another reviewed contract proves an atomic quantity-add workflow without undocumented probing. | Product-detail `QuantityStepper`; W05 sends one add request only. |
| `ADDR-001` | What address fields are required and what shapes/statuses are returned? | **Open** | Request body contains `name`, `details`, `phone`, and `city`; validation/list/detail shapes are unknown. | F11. | X01–X05. |
| `ADDR-002` | Can addresses be edited? | **Deferred** | No update endpoint exists. Do not expose edit-in-place or an edit route. | Reopen only if a new reviewed API source is added. | Edit controls shown in Stitch remain non-functional/absent. |
| `CHECKOUT-001` / PRD A8 | What checkout-session field contains the redirect and which destinations are safe? | **Open** | A `url` query parameter is present; response field, provider, allowlist, and callback semantics are unknown. | F12. | X07/X08. |
| `CHECKOUT-002` | Is order `{id}` the cart ID, and what are cash-order status, cart lifecycle, and idempotency? | **Open** | Flow/request names imply cart ID; no response or retry contract exists. | F12 if synthetic side effects are demonstrably safe. | X06. |
| `CHECKOUT-003` | What return URL format and payment-result reconciliation are valid? | **Open** | No webhook/status request exists. Query parameters cannot establish success. Present decision: return page stays neutral and refreshes only supported state. | F12 for URL/redirect evidence; X08 implements neutral behavior. | Online checkout outcome UX. |
| `CHECKOUT-004` | Can a saved address be mapped into checkout? | **Provisional** | Map only `details`, `phone`, and `city`; saved-address `name` is not part of order shipping body. | F11/F12. | X05. |
| `ORDER-001` / PRD A6 | Is own-user order history authenticated and ownership-enforced? | **Conditional** | `GET /orders/user/{id}` shows no auth header and accepts a user ID. Only the dedicated account’s own returned ID may be requested. Cross-user testing is prohibited, so insufficient evidence leaves the route deferred. | F12, O00. | O01/O02 and `/account/orders`. |
| `ORDER-002` | Is an order-detail route supportable? | **Deferred** | No detail endpoint exists. Do not invent `/account/orders/[orderId]`; list data may not be promoted into a detail contract without new evidence and route review. | Reopen only with a reviewed source/route change. | Order-detail Stitch screen remains reference-only. |
| `ADMIN-001` / PRD A7 | Are `GET /users` and `GET /orders` authorized admin endpoints, and what proves the role? | **Conditional** | No reliable auth/role evidence exists. Do not call them unless a normally issued session explicitly proves an authorized admin role. Customer UI/navigation omits them. | ADM00. | ADM01/ADM02 and both admin routes. |
| `ADMIN-002` | Which user/order fields are safe to display and log? | **Open** | Schemas and privacy boundaries are unknown. This is considered only after `ADMIN-001` passes. | Authorized verification under ADM01/ADM02, then T04. | Conditional admin UI. |

## Architecture and delivery decisions

| ID | Question | Status | Current evidence and present decision | Resolve/update milestone | Blocks or constrains |
|---|---|---|---|---|---|
| `ARCH-001` | Where are third-party API calls made and where are server/client boundaries? | **Open** | Next App Router is present. Prefer Server Components for reads and server-confined mutations/session transport, with Client Components only for interaction; confirm against local Next 16 docs and API requirements. | D07. | C01, A00, all adapters/mutations. |
| `ARCH-002` | What folder and route-group structure will be used? | **Open** | `ROUTES.md` proposes `(auth)`, `(shop)`, `(account)`, and conditional `(admin)` groups; current app is the starter structure. | D07. | All application milestones. |
| `ARCH-003` | Which runtime validation approach will guard third-party responses? | **Open** | Runtime validation is required because schemas are absent. Package choice is not yet approved. | D07/D08. | C01 and every response adapter. |
| `ARCH-004` | What data-fetching, caching, revalidation, and mutation strategy is appropriate? | **Open** | Must follow the installed Next 16 docs and keep protected/customer data uncached or correctly scoped. | D07. | Catalog freshness and all protected state. |
| `ARCH-005` | How will forms and client validation be managed? | **Open** | Native/framework capabilities may be sufficient; choose a library only if complexity and verified validation justify it. | D08. | Auth/address/account forms. |
| `ARCH-006` | What unit, component, and browser test stack will be used? | **Open** | No test scripts or test dependencies exist. The stack must support TypeScript, React 19, Next 16, accessibility, and fixture-backed tests. | D08. | Verification for implementation milestones. |
| `ARCH-007` | Which additional dependencies are approved? | **Open** | Existing packages are Next, React, React DOM, TypeScript, Tailwind, and ESLint. No new dependency is approved until purpose/compatibility/alternative are recorded. | D08; install at D09. | D09 and subsequent implementation. |
| `ARCH-008` | Which environment variables exist and which are public/private? | **Open** | API base, checkout return origin, and test/preview values are candidates. Tokens and test credentials must never use `NEXT_PUBLIC_` variables. | D10. | Live integration and deployment. |
| `ARCH-009` | What deployment target and runtime constraints apply? | **Open** | No target is documented. Decision must account for server-side session handling, environment configuration, redirects, logs, and third-party API reachability. | D07 initially; finalize T06. | Production architecture and online checkout URL. |
| `ARCH-010` | What is the supported browser/accessibility baseline? | **Open** | Use Next-supported browsers and WCAG AA-oriented requirements from `UI_SPEC.md`; document exact automated/manual gates before release. | D07/T02. | Polyfills, component behavior, QA. |
| `ARCH-011` | Must every protected API contract be verified before implementation starts? | **Resolved** | No. Use the documented vertical path: public verification and catalog first, then run F06–F12 immediately before their matching feature verticals. F13 is final consolidation and never a global prerequisite. | Maintain in `TASKS.md`; reopen only if release policy changes. | Milestone ordering and dependencies. |

## Design decisions

| ID | Question | Status | Current evidence and present decision | Resolve/update milestone | Blocks or constrains |
|---|---|---|---|---|---|
| `DESIGN-001` | Which Stitch artifact wins when sources differ? | **Resolved** | Approved screenshots are primary; `DESIGN.md` supplies intent; exported HTML/CSS is reference-only; PRD/routes constrain behavior. | D05/D06; reopen only after new approval. | All UI implementation. |
| `DESIGN-002` | Which media is local versus API-driven? | **Open** | Product, gallery, category, brand, cart, wishlist, checkout, and order media must come from verified API response fields and must not be copied locally. D04 localizes only approved static marketing, decorative, logo, empty-state, and SVG assets; those static files are still pending. | D04 for static assets; matching F/C/W/X/O milestones for API fields. | C00/C02 visual completion and all media adapters. |
| `DESIGN-003` | How are screenshot features that conflict with product scope handled? | **Deferred** | Social auth, rewards, editable addresses, saved cards/PayPal, reviews/variants, tracking, invoice/returns, profile extras, initial product-detail quantity, and direct payment-success claims remain visual references only. | Reopen individually only with API/route evidence. | Corresponding controls must be absent or non-functional as specified by `UI_SPEC.md`. |
| `DESIGN-004` | Is the UI implementation specification and artifact pairing available? | **Resolved** | `docs/UI_SPEC.md` exists. A 2026-07-31 filesystem audit confirmed 27 screenshot/export filename pairs. Project designation makes screenshots approved and primary; matching export code proves pairing only, not approval. | D06 validation after material changes. | C00 and all visual milestones. |
| `DESIGN-005` | What route owns the account overview and order-details designs? | **Deferred** | `ROUTES.md` contains neither `/account` overview nor an order-detail route. Both designs remain reference-only. | Reopen only through a deliberate PRD/route revision. | Those screens are not implementation milestones. |
| `DESIGN-006` | Where do Account and Orders navigation items go? | **Resolved** | Account targets `/account/profile` when authenticated and `/sign-in?returnTo=%2Faccount%2Fprofile` when anonymous, with an allowlisted relative decoded value. Orders is omitted until O00 passes and O02 ships `/account/orders`. | A04 implements and tests the policy. | Shared header, sidebar, and bottom navigation. |
| `DESIGN-007` | How does the homepage newsletter region behave without an API? | **Resolved** | Keep a static `NewsletterPromo` with approved styling/copy but no form, email input, or submit action. | C02. | Homepage component mapping and accessibility semantics. |
| `DESIGN-008` | Is signup terms consent required? | **Deferred** | No product/legal requirement or approved Terms and Privacy destinations exist. Omit the checkbox and legal links rather than collecting meaningless consent. | Reopen only when both the requirement and destinations are approved. | A01/A02. |
| `DESIGN-009` | What supplies customer profile avatars? | **Deferred** | No verified avatar field or upload API exists. Require no local avatar; use a generic account icon or initials from a verified name. | Reopen only after verified response/update support exists. | Account shell, profile, addresses, wishlist, and orders presentation. |

## Decision review checkpoints

- **After F03–F05:** update API host, public access, envelopes, pagination, fields, and query decisions, then proceed through D07–D10, D04, and public catalog without waiting for protected verification.
- **Immediately before each protected vertical:** run F06 for A00–A04, F07 for A05–A07, F08 for A08–A09, F09 for W01–W03, F10 for W04–W08, F11 for X01–X04, and F12 for X05–X08/O00–O02.
- **After F06–F12 individually:** update only the matching token, identity, recovery, profile, wishlist, cart, address, checkout, or order decisions and preserve all stop reasons.
- **At F13:** consolidate all evidence and remaining gates; do not use it to delay an unrelated or already-verified feature.
- **At D07–D10 and D04:** resolve architecture, dependency, environment, and static-asset defaults before C00.
- **At O00/ADM00:** keep conditional routes absent unless their narrow evidence gate passes.
- **Before T06/T07:** revalidate provisional live-API observations that can change deployment safety, especially host, session, checkout, and authorization behavior.
