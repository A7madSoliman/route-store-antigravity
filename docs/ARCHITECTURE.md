# Application Architecture

## 1. Purpose and authority

This document defines the application structure for implementation after milestone D07. It is an architecture specification, not application code, and it does not approve new routes, API operations, dependencies, or unverified response fields.

Functional and visual precedence remains:

1. `docs/API_INVENTORY.md` for known third-party requests.
2. `docs/PRD.md` for product scope.
3. `docs/ROUTES.md` for application URLs.
4. `docs/DECISIONS.md` for confirmed, provisional, conditional, deferred, and open choices.
5. `docs/TASKS.md` for implementation order and gates.
6. `docs/UI_SPEC.md` and approved Stitch screenshots for UI behavior and appearance.

Sanitized records under `docs/api/examples` are evidence, not runtime fixtures. They may guide schemas and adapters, but application code and tests must never import Markdown evidence files.

## 2. Repository decision

Keep the App Router at the repository root under `app/`.

This repository already has a root `app/`, root-relative `@/*` TypeScript alias, global CSS, and root configuration files. Moving to `src/` would require an application move and alias/configuration changes without providing a practical benefit for the current small project. Next.js supports both locations, and a root `app/` is valid.

Current facts at D07:

- `app/` contains only the starter layout, home page, global stylesheet, and favicon.
- TypeScript strict mode is enabled.
- `@/*` maps to the repository root.
- No runtime-validation, form, unit-test, component-test, or browser-test package is selected.
- `cacheComponents` is not enabled in `next.config.ts`.
- `public/` contains only starter assets; production static assets remain a D04 concern.

Retain one top-level `app/layout.tsx`. Route-group layouts nest beneath it and must not add another `<html>` or `<body>`. This avoids the full page reload behavior associated with separate root layouts.

## 3. Local Next.js 16 research basis

The D07 decisions use the installed documentation under `node_modules/next/dist/docs/`, specifically:

| Concern | Local documentation inspected | Applied rule |
|---|---|---|
| Project organization | `01-app/01-getting-started/02-project-structure.md` | Routes are exposed only by `page` or `route`; route groups do not affect URLs. |
| Pages and layouts | `01-app/01-getting-started/03-layouts-and-pages.md` | Keep one root layout; nested layouts own shared shells. |
| Route groups | `01-app/03-api-reference/03-file-conventions/route-groups.md` | Use groups for page families without duplicating URL paths. |
| Dynamic routes | `01-app/03-api-reference/03-file-conventions/dynamic-routes.md` | Await promised `params` and validate all route values as untrusted input. |
| Optional `src/` | `01-app/03-api-reference/03-file-conventions/src-folder.md` | Root `app/` remains supported; no move is needed. |
| Server and Client Components | `01-app/01-getting-started/05-server-and-client-components.md` | Server Components are the default; keep client boundaries low and mark sensitive modules server-only. |
| Data fetching | `01-app/01-getting-started/06-fetching-data.md` | Server Components fetch from the source; identical fetches are memoized but are not cached by default. |
| Mutations | `01-app/01-getting-started/07-mutating-data.md` | Use Server Actions for UI mutations and treat every action as directly callable. |
| Caching and revalidation | `01-app/01-getting-started/08-caching.md`, `09-revalidating.md`, and `01-app/02-guides/caching-without-cache-components.md` | The repository currently uses the non-Cache-Components model; caching must be explicit. |
| Error handling | `01-app/01-getting-started/10-error-handling.md` | Return expected failures, throw unexpected failures, and use route error/not-found files. |
| Route Handlers | `01-app/01-getting-started/15-route-handlers.md` and `01-app/02-guides/backend-for-frontend.md` | Route Handlers are public endpoints; Server Components must not fetch through an internal handler. |
| Cookies and authentication | `01-app/03-api-reference/04-functions/cookies.md` and `01-app/02-guides/authentication.md` | `cookies()` is asynchronous; write cookies only from a Server Action or Route Handler and authorize close to data access. |
| Data security | `01-app/02-guides/data-security.md` | Use a server-only data boundary, validate untrusted input, minimize DTOs, and repeat authorization inside actions. |
| Environment variables | `01-app/02-guides/environment-variables.md` | Non-public variables remain server-only; `NEXT_PUBLIC_` values are inlined into browser bundles. |
| Testing | `01-app/02-guides/testing/index.md`, `vitest.md`, and `playwright.md` | Separate unit, component, and E2E responsibilities; prefer E2E coverage for async Server Components. |
| Browser baseline | `03-architecture/supported-browsers.md` | Use the installed Next.js modern-browser baseline unless a later decision deliberately changes it. |

The Cache Components guide was inspected for contrast, but its APIs are not adopted because the required configuration flag is absent and D07 does not change configuration.

## 4. Route groups and approved URLs

Route groups organize layouts and ownership; they do not provide authorization. Pages, endpoint functions, and Server Actions still enforce their own session and ownership checks.

### 4.1 Route-group responsibilities

| Group | Responsibility | Shared shell |
|---|---|---|
| `app/(shop)` | Anonymous catalog discovery and product details | Storefront shell |
| `app/(auth)` | Pre-authentication and recovery forms | Auth shell |
| `app/(account)` | Authenticated profile, address, wishlist, and conditional order-history views | Account shell with responsive sidebar/navigation |
| `app/(checkout)` | Cart, checkout phases, payment return, and the checkout-styled new-address screen | Responsive checkout shell |
| `app/(admin)` | Conditional read-only admin candidates | No directory or shell until the admin authorization gate passes |

The checkout group owns `/account/addresses/new` because its approved screen uses the secure checkout shell. The account group owns the address list and read-only address detail. Static `new` and dynamic `[addressId]` remain distinct approved routes.

### 4.2 Complete route placement

The table maps all 26 entries from `ROUTES.md`. A conditional entry describes its future location only; it must not be created or linked before its gate passes.

| # | Public URL | Intended App Router file | Access and notes |
|---:|---|---|---|
| 1 | `/` | `app/(shop)/page.tsx` | Public storefront home |
| 2 | `/categories` | `app/(shop)/categories/page.tsx` | Public category directory |
| 3 | `/categories/[categoryId]` | `app/(shop)/categories/[categoryId]/page.tsx` | Public category detail and scoped subcategories |
| 4 | `/subcategories` | `app/(shop)/subcategories/page.tsx` | Public subcategory directory |
| 5 | `/subcategories/[subcategoryId]` | `app/(shop)/subcategories/[subcategoryId]/page.tsx` | Public subcategory detail |
| 6 | `/brands` | `app/(shop)/brands/page.tsx` | Public brand directory |
| 7 | `/brands/[brandId]` | `app/(shop)/brands/[brandId]/page.tsx` | Public brand detail |
| 8 | `/products` | `app/(shop)/products/page.tsx` | Public product list using only F05-approved queries |
| 9 | `/products/[productId]` | `app/(shop)/products/[productId]/page.tsx` | Public product detail |
| 10 | `/sign-up` | `app/(auth)/sign-up/page.tsx` | Pre-auth form |
| 11 | `/sign-in` | `app/(auth)/sign-in/page.tsx` | Pre-auth form and safe `returnTo` handling |
| 12 | `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Pre-auth recovery start |
| 13 | `/verify-reset-code` | `app/(auth)/verify-reset-code/page.tsx` | Pre-auth recovery verification |
| 14 | `/reset-password` | `app/(auth)/reset-password/page.tsx` | Pre-auth recovery completion |
| 15 | `/account/profile` | `app/(account)/account/profile/page.tsx` | Protected; authenticated Account navigation target |
| 16 | `/account/security` | `app/(account)/account/security/page.tsx` | Protected |
| 17 | `/account/addresses` | `app/(account)/account/addresses/page.tsx` | Protected address list |
| 18 | `/account/addresses/new` | `app/(checkout)/account/addresses/new/page.tsx` | Protected; checkout-styled form |
| 19 | `/account/addresses/[addressId]` | `app/(account)/account/addresses/[addressId]/page.tsx` | Protected read-only detail |
| 20 | `/wishlist` | `app/(account)/wishlist/page.tsx` | Protected; account shell |
| 21 | `/cart` | `app/(checkout)/cart/page.tsx` | Protected; responsive cart/checkout shell |
| 22 | `/checkout` | `app/(checkout)/checkout/page.tsx` | Protected; shipping/payment phases remain page state |
| 23 | `/checkout/online/return` | `app/(checkout)/checkout/online/return/page.tsx` | Protected neutral reconciliation page |
| 24 | `/account/orders` | `app/(account)/account/orders/page.tsx` | Conditional; absent until ownership/authentication gate passes |
| 25 | `/admin/users` | `app/(admin)/admin/users/page.tsx` | Conditional; absent until verified admin role evidence exists |
| 26 | `/admin/orders` | `app/(admin)/admin/orders/page.tsx` | Conditional; absent until verified admin role evidence exists |

Do not add `/account`, an order-detail route, product-management routes, address editing, or internal `/api` proxy routes. The current starter `app/page.tsx` is moved to `app/(shop)/page.tsx` only during its implementation milestone; D07 does not move it.

## 5. Proposed folder structure

The following is documentation only. Directories appear when their owning implementation milestone begins; do not scaffold the full tree in advance.

```text
app/
  layout.tsx
  globals.css
  global-error.tsx
  not-found.tsx
  (shop)/
    layout.tsx
    error.tsx
    page.tsx
    categories/
      page.tsx
      [categoryId]/page.tsx
    subcategories/
      page.tsx
      [subcategoryId]/page.tsx
    brands/
      page.tsx
      [brandId]/page.tsx
    products/
      page.tsx
      loading.tsx
      [productId]/
        page.tsx
        loading.tsx
  (auth)/
    layout.tsx
    error.tsx
    sign-up/page.tsx
    sign-in/page.tsx
    forgot-password/page.tsx
    verify-reset-code/page.tsx
    reset-password/page.tsx
  (account)/
    layout.tsx
    error.tsx
    wishlist/page.tsx
    account/
      profile/page.tsx
      security/page.tsx
      addresses/
        page.tsx
        [addressId]/page.tsx
      orders/page.tsx              # conditional; do not create before O00
  (checkout)/
    layout.tsx
    error.tsx
    cart/page.tsx
    checkout/
      page.tsx
      online/return/page.tsx
    account/addresses/new/page.tsx
  (admin)/                         # conditional; do not create before AD00
    admin/
      users/page.tsx
      orders/page.tsx

components/
  ui/
  layout/
  commerce/
  icons/

features/
  home/components/
  products/components/
  categories/components/
  brands/components/
  auth/
    actions/
    components/
  cart/
    actions/
    components/
  wishlist/
    actions/
    components/

lib/
  api/
    errors.server.ts
    transport/
      public-request.server.ts
      protected-request.server.ts
    endpoints/
      public/
        categories.server.ts
        subcategories.server.ts
        brands.server.ts
        products.server.ts
      pre-auth/
        auth.server.ts
      protected/
        account.server.ts
        wishlist.server.ts
        cart.server.ts
        addresses.server.ts
        checkout.server.ts
    schemas/
    adapters/
  auth/
    session.server.ts
    require-session.server.ts
    return-to.server.ts
  env/
    server.ts
  media/
    api-image.server.ts

types/
  catalog.ts
  account.ts
  cart.ts
  wishlist.ts
  checkout.ts
  action-result.ts

tests/
  unit/
  component/
  e2e/
  fixtures/
    api/

public/
  images/
    brand/
    marketing/
    decorative/
    empty-states/
```

Later address, checkout, profile, security, and order feature folders follow the same `actions/` plus `components/` pattern when their vertical milestone begins. Conditional endpoint and feature directories remain absent until their decisions pass.

## 6. Component ownership

| Location | Owns | Must not own |
|---|---|---|
| `components/ui` | `Button`, `IconButton`, `Card`, form controls, badges, banners, tabs, accordion, skeleton, pagination, empty state | API calls, feature rules, sessions, wire types |
| `components/layout` | `AppShell`, headers, announcement bar, page container, footer, account navigation/sidebar, bottom navigation, checkout stepper | Feature endpoints or protected mutations |
| `components/commerce` | Product cards/grids/rails/gallery, price display, cart line, order summary, address card, checkout items, payment choice, result card | Third-party response envelopes or server tokens |
| `components/icons` | Local inline SVG React components using the UI specification | Runtime icon fonts or third-party icon architecture |
| `features/<feature>/components` | Page sections and compositions specific to one feature | Direct transport calls from presentational files |
| `features/<feature>/actions` | Thin Server Actions for approved mutations | Reusable UI or low-level HTTP code |
| `types` | Minimal application-domain DTOs and safe action-result types | Unvalidated third-party wire declarations |

Shared components depend only on other shared components, domain types, and client-safe utilities. If a component becomes genuinely reusable across features, move it to the appropriate shared folder rather than importing a feature-private module.

## 7. Import and runtime boundaries

Allowed dependency direction is:

```text
app
  -> features
  -> components/layout and components/commerce
  -> approved server endpoint entry points

features
  -> components
  -> types
  -> approved endpoint/session entry points from server or action files only

components
  -> components
  -> types
  -> client-safe utilities only

lib/api/endpoints
  -> transport
  -> schemas
  -> adapters
  -> types

lib/api/transport
  -> server environment and normalized errors only
```

Rules:

- `lib/api`, `lib/auth`, server environment validation, and API-media validation are server-only.
- Add `import "server-only"` at the top of server-only roots. Use `.server.ts` for these modules.
- Add `"use client"` only to files that require state, effects, event handlers, context, or browser APIs. Everything imported by that file enters the client graph.
- Add `"use server"` only to Server Action entry files; treat every exported action as a directly callable POST boundary.
- Do not create a barrel that mixes server-only and client-safe exports.
- A feature may consume another feature only through an explicitly documented public entry point. It may not deep-import private components, actions, schemas, or adapters.
- `lib` never imports `app`, `features`, or presentation components.
- Use `@/*` for cross-root imports and relative imports within a small local folder.
- Circular dependencies and upward imports are prohibited.

## 8. Server and Client Component policy

Pages, layouts, data-loading components, metadata functions, and authorization-aware components are Server Components by default. They may call server-only endpoint functions and pass only minimal serializable domain DTOs to children.

Client Components are limited to the lowest interactive unit, including filters/drawers, galleries, quantity controls, form pending state, password visibility, tabs, accordions, and mobile navigation toggles. A page must not become a Client Component merely because it renders one of these controls.

Next.js 16 route inputs are untrusted asynchronous inputs:

- Await `params` and `searchParams` in Server Component pages.
- Validate dynamic IDs before building an upstream URL.
- Parse product queries through an allowlist that implements only F05-supported shapes.
- Use the page `searchParams` prop when query state changes server-loaded data; accept that this makes the page dynamically rendered.
- Pass only the values a Client Component needs, never the raw session, token, response envelope, or broad user/product record.

## 9. API architecture

### 9.1 Layer responsibilities

| Layer | Responsibility |
|---|---|
| Public transport | Base URL resolution, safe URL construction, JSON accept header, timeout/abort handling, redirect policy, response-status capture, and parsing JSON as `unknown`; cannot accept authentication material |
| Protected transport | All transport responsibilities plus the exact verified custom `token` header from the server session; always uncached |
| Endpoint module | Owns one inventoried path/method/body/query contract and calls the correct transport |
| Runtime schema | Validates only observed or subsequently verified response shapes; technology selected at D08 |
| Domain adapter | Converts validated wire data into minimal application DTOs, removes unsupported/private fields, and validates API media URLs |
| UI | Renders domain DTOs and invokes approved actions; never calls the third-party API directly |

Endpoint modules are divided into `public`, `pre-auth`, and `protected`. Conditional admin endpoints do not receive modules until normal authorization confirms access.

Transport rules:

- Read the base URL only through server environment validation.
- Store endpoint paths as constants and encode dynamic path values.
- Serialize only endpoint-allowlisted query keys. Repeated categories use repeated `category[in]` keys; unsupported F05 shapes are omitted.
- Send no body with a GET. Send no DELETE body unless later verification explicitly requires one.
- Preserve exact endpoint spelling, including `forgotPasswords`, and the custom `token` header.
- Do not follow an unexpected upstream redirect or expose its target without an endpoint-specific reviewed rule.
- Treat response JSON as `unknown` until runtime validation succeeds.
- Never return a raw third-party error body to the browser.

### 9.2 Public read flow

```text
Route Server Component
  -> public endpoint function
  -> public HTTP transport
  -> unknown JSON
  -> runtime response validation
  -> domain adapter
  -> page or feature component
```

Server Components call the source endpoint module directly. They must not call an internal Route Handler, which would add an avoidable HTTP round trip and can fail during prerendering/build.

### 9.3 Protected read flow

```text
Protected page or leaf Server Component
  -> requireSession()
  -> protected endpoint function
  -> protected transport with server-confined token
  -> runtime response validation
  -> minimal domain DTO
  -> protected page component
```

The session check occurs again inside the protected data boundary. A route-group layout or hidden navigation item is not authorization.

### 9.4 Protected mutation flow

```text
Client interaction or form
  -> Server Action
  -> validate submitted input
  -> requireSession() and verify ownership where applicable
  -> protected endpoint function
  -> protected transport with server-confined token
  -> runtime response validation
  -> domain adapter
  -> safe ActionResult
  -> refresh, revalidate, or redirect as appropriate
```

Server Actions stay thin and delegate contract work to endpoint modules. Every action repeats authentication and authorization because action identifiers are callable outside the rendered UI. Expected validation/authentication/mutation failures return a serializable discriminated result. Unexpected transport, programming, or response-contract failures throw after redacted server-side logging.

### 9.5 Route Handlers

Do not create internal Route Handlers for catalog reads or ordinary mutations. Route Handlers are public HTTP endpoints and require their own authentication, validation, rate limits, error filtering, and route approval.

A future Route Handler is considered only for an approved external callback, webhook, file response, or non-React client requirement. The current online-return page is a UI page and cannot independently establish payment success, so it does not justify a callback handler.

## 10. Session and navigation security

`lib/auth` exposes a stable server-side interface for creating, reading, requiring, and deleting the local application session. A00 selects an encrypted and authenticated stateless cookie backed by a 32-byte server-only AES-GCM key; deployment provisioning and operational key rotation remain T06 concerns.

The selected implementation is:

- an encrypted and authenticated HttpOnly cookie containing only a version and raw upstream token.

The third-party token may exist only inside that server-controlled implementation and protected transport. It must never appear in local storage, session storage, client-readable cookies, serialized props, URLs, analytics, browser logs, or a `NEXT_PUBLIC_` environment variable.

Session rules:

- Use asynchronous `cookies()` reads.
- Set or delete cookies only from a Server Action or a justified Route Handler, never during Server Component rendering.
- Production cookie settings include HttpOnly, Secure, SameSite, path, and an evidence-based expiry.
- `requireSession()` is called close to each protected data access and inside every protected Server Action.
- React `cache` may deduplicate session verification within one server render request; it is not a shared user-session cache.
- An optional future `proxy.ts` may perform optimistic redirects only. It never replaces endpoint/action authorization.
- Local sign-out deletes the application session. It does not claim upstream token revocation, rotation, or sign-out from other devices.

### 10.1 Safe `returnTo`

`lib/auth/return-to.server.ts` owns one allowlist-based normalizer:

- Accept only a string beginning with one `/`.
- Reject schemes, hosts, protocol-relative `//` values, backslashes, control characters, and fragments.
- Resolve against the application origin and require the resolved origin to remain unchanged.
- Match only an implemented route from `ROUTES.md`; conditional and planned-but-unimplemented routes are excluded until shipped.
- Preserve query parameters only when that destination explicitly allowlists them.
- A00 falls back only to the implemented generic `/`; A04 may add an account fallback once that route is implemented.

The anonymous Account navigation target is `/sign-in?returnTo=%2Faccount%2Fprofile`; the authenticated target is `/account/profile`. Admin destinations are never accepted as customer `returnTo` values.

## 11. Caching and revalidation

The current repository does not enable Cache Components. Do not use `use cache`, `cacheLife`, or Cache-Components-only behavior unless a later configuration decision adopts that model.

| Data class | Policy |
|---|---|
| Public catalog lists/details | Eligible for explicit shared caching, query-specific keys, and catalog tags after a feature records a freshness policy. Until then, requests are explicitly uncached. D07 defines no duration. |
| Authentication responses | Never cached; consume only inside the server-controlled authentication/session flow. |
| Profile and address data | `no-store`; never placed in a public/shared cache. |
| Wishlist and cart | `no-store`; refresh the current Server Component view after successful mutation. |
| Checkout and order data | `no-store`; server results are authoritative and must not be reused across users. |
| Session verification | May use request-scoped React memoization only. |

In the current model, a public endpoint that later opts into caching must declare the fetch cache/revalidation option explicitly. Mutations use the narrowest refresh or invalidation mechanism available. Protected mutations do not put returned sensitive data into a shared cache.

## 12. Error, not-found, and view-state policy

| Failure class | Handling |
|---|---|
| Expected form or mutation failure | Return a safe `ActionResult` and render an associated field/form message with an accessible live region. |
| Unexpected render or contract failure | Throw to the nearest route `error.tsx`; log only redacted server context. |
| Root-layout failure | `app/global-error.tsx`, a Client Component that supplies its own `<html>` and `<body>`. |
| Route-family failure | The nearest group `error.tsx`, a Client Component using the installed Next.js 16 retry interface. |
| Unknown application URL | Root `app/not-found.tsx`. |
| Missing dynamic resource | Call `notFound()` only after a verified upstream not-found status/shape; do not convert network or validation failures into 404. |
| API response validation failure | Raise a redacted contract error; never pass the invalid raw payload to UI or logs. |
| Authentication failure | Redirect with validated `returnTo` for page reads or return a safe authentication result for a mutation. |
| Recoverable client interaction failure | Keep the user on the current page, restore controls, and expose an accessible retry/message. |

Route `loading.tsx` files provide page-level skeletons. `<Suspense>` boundaries may provide narrower streaming fallbacks around slow or request-time components. Per `UI_SPEC.md`, loading, empty, error, and ready states are mutually exclusive.

## 13. Environment and media boundaries

`lib/env/server.ts` is the only application module that reads private `process.env` values directly. It validates required server configuration and returns a typed immutable object. Exact variable names and validation technology remain D10/D08 decisions.

No public environment module is created until an actual non-sensitive browser value is approved. Tokens, session secrets, test-account data, checkout secrets, and private API configuration never use `NEXT_PUBLIC_`.

API media remains response data:

- Accept only syntactically valid absolute HTTPS URLs.
- Require the exact hostname `ecommerce.routemisr.com` before producing a renderable public catalog media value. F04A observed that hostname for the documented media roles in `GET /categories`, `GET /brands`, and `GET /products`; it did not freshly reverify the other six catalog endpoints.
- Return `null` for invalid/unapproved media so the UI can use its approved neutral fallback or omit the slot.
- Do not copy API product, category, brand, cart, wishlist, checkout, or order media into `public/`.
- C01 may configure Next Image for HTTPS media from that exact hostname only. Other schemes or hosts remain unapproved until separately verified; protected-domain media remains gated by its own verification milestone.

Only D04-approved brand, marketing, decorative, and empty-state images belong under `public/images`. Icons are local inline SVG React components under `components/icons`, not a runtime icon dependency.

## 14. Test structure

D07 fixes test locations and responsibilities. D08 selects compatible packages and D09 installs them.

| Location | Responsibility |
|---|---|
| `tests/unit` | URL/query serialization, public/protected transport guards, schemas, adapters, session helpers, environment parsing, media allowlisting, and `returnTo` normalization |
| `tests/component` | Synchronous primitives and Client Components, mutually exclusive states, pending behavior, keyboard interaction, labels, focus, and accessibility |
| `tests/e2e` | Async Server Components, route-group shells, dynamic routes, authentication redirects, protected mutation flows, and responsive customer journeys |
| `tests/fixtures/api` | Small sanitized JSON fixtures derived from verified evidence; no real identifiers, credentials, or personal data |

Routine automated tests use mocked transport and sanitized fixtures. They do not call the live third-party API, use the dedicated synthetic account, or depend on network availability. Controlled live verification remains a separate `API_VERIFICATION.md` workflow.

Following the installed Next.js guidance, async Server Components receive primary browser/E2E coverage rather than being forced into a unit-test environment that may not support them.

## 15. Naming conventions

- Directories and ordinary files: kebab-case.
- Reusable React exports: PascalCase named exports.
- Next.js route files: framework-required names and default exports.
- Endpoint functions: verb plus resource, such as `getProducts`, `getProduct`, and `addCartItem`.
- Runtime schemas: `<operation>-response.schema.server.ts`; exported schema names use PascalCase, such as `GetProductsResponseSchema`.
- Domain adapters: `<domain>.adapter.server.ts`; functions use `toProduct`, `toProductSummary`, or another explicit target.
- Server Actions: `<operation>.action.ts`; functions use `<verb><Noun>Action`.
- Unit/component tests: `*.test.ts` or `*.test.tsx`.
- Browser tests: `*.spec.ts`.
- Fixtures: `<request>.<success|empty|error>.json` with sanitized placeholder values.

Avoid generic dumping-ground names such as `helpers.ts`, `utils.ts`, or `types.ts` when a domain-specific name is available.

## 16. Deferred architecture choices

D07 deliberately does not decide:

- the runtime-validation, form, unit/component-test, or browser-test packages;
- session sealing library, session-store provider, token lifetime, refresh, or rotation behavior;
- exact environment-variable names and values;
- public catalog cache durations;
- deployment provider and final runtime topology;
- unverified authentication identity/role fields or protected response contracts;
- conditional customer-order and admin route activation.

Those choices remain with D08–D10, F06–F12, O00, AD00, or the testing/deployment milestones named in `TASKS.md` and `DECISIONS.md`.

## 17. D07 acceptance checklist

- [x] Root `app/` remains the selected source location; no `src/` move occurs.
- [x] All 26 approved/conditional route-map entries have one intended file and no unsupported route is added.
- [x] One root layout and the five evaluated route groups are documented.
- [x] Shared UI, layouts, commerce components, features, API layers, domain types, auth, environment, assets, fixtures, and tests have one intended home.
- [x] Public reads, protected reads, and protected mutations use distinct server-controlled flows.
- [x] Presentational components cannot call the third-party API or receive tokens/raw envelopes.
- [x] Session, `returnTo`, cache, media, and error boundaries are explicit without claiming unresolved API behavior.
- [x] Conditional order/admin directories remain documentation-only until their gates pass.
- [x] `ARCH-001` and `ARCH-002` are Resolved; dependency/API-dependent choices remain Provisional, Open, or Conditional.
- [x] D07 changes documentation only.
