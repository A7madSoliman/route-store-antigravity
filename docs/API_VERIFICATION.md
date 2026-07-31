# Controlled Live API Verification

## Purpose and scope

Use this procedure to collect the smallest safe, sanitized evidence needed before defining TypeScript response types or application adapters. It does not expand product scope, authorize new endpoints, or replace `docs/API_INVENTORY.md`.

The planning base URL is `https://ecommerce.routemisr.com/api/v1`. Its status remains governed by `docs/DECISIONS.md`. A successful observation describes one endpoint at one capture time; it does not prove undocumented behavior for other endpoints.

Do not call the live API unless the current `docs/TASKS.md` milestone authorizes it. Never edit the raw Postman collection or use its credentials, tokens, personal values, or hardcoded IDs.

## Request safety categories

| Category | Allowed behavior | Required gate |
|---|---|---|
| **Safe public read** | Public GET request, no authentication, no request body, and no state change | The request appears as a public-read candidate in `docs/API_INVENTORY.md`; record anonymous access as an observation, not an assumption |
| **Controlled account read** | Uses only the dedicated synthetic test account and reads only resources returned for that account | The matching protected-verification milestone is active and ordinary authentication is confirmed |
| **Controlled mutation** | Uses only synthetic values; mutates the dedicated account when required or data created for the current verification; takes a sanitized before-state snapshot; has a known cleanup or restoration process | The matching milestone and decision gates authorize the mutation |
| **Conditional** | Checkout, order, ownership, payment, or authorization behavior is unclear | Do not call until every named decision and safety gate is satisfied |
| **Forbidden** | Another user's ID or data; guessed/substituted IDs; authorization bypass; raw Postman credentials; possible admin endpoints without verified role evidence; real payment or unsafe order/fulfillment | Never run |

An endpoint stays Conditional or Forbidden when its category is unclear. An unexpectedly permissive response never authorizes broader probing.

### Dedicated synthetic test-account convention

F02 does not create an account. When F06 authorizes creation, use a project-only account with a clearly synthetic display name in the form `route-store-verification-<environment>-<random-suffix>`. Use a dedicated inbox and synthetic phone/address values that do not belong to a real person. Keep its email, phone, password, reset codes, and tokens outside the repository in an ignored local secret store. Evidence refers to it only as `<test-account>` and never records its actual identifiers or credentials.

## Verification workflow

1. **Select the inventoried request.** Record its exact request name, method, normalized path, authentication evidence, enabled parameters, request body fields, and unknowns from `docs/API_INVENTORY.md`. Do not add a field, query, body, or endpoint from memory.
2. **Check gates and classify safety.** Read the related rows in `docs/DECISIONS.md` and the active `docs/TASKS.md` milestone. Assign exactly one safety category above. Stop if authorization, ownership, payment, fulfillment, privacy, or cleanup is unclear.
3. **Plan the smallest request.** For a Safe public read, send no credentials, body, or optional query. For protected work, use only the dedicated synthetic account and IDs returned by its own/list flow.
4. **Snapshot before mutation.** Record a sanitized before-state summary sufficient to prove restoration, such as item count and placeholder identifiers. Never store a raw protected response. If the account itself must change, record which synthetic fields will change and how access will be restored.
5. **Confirm cleanup before mutation.** Identify the exact cleanup endpoint or restoration request and its safety conditions. If none exists, reclassify the request as Conditional unless the milestone explicitly approves a reversible account-level change.
6. **Send one request.** Do not use automated retries or follow a redirect to an unreviewed host/path. Keep the raw response in process memory only and do not write it to the repository, a transcript file, or a fixture.
7. **Record the observation.** Capture request name, method, full request URL, normalized path, authentication category, actual status, UTC date, elapsed time, allowlisted safe headers, safe parameters, top-level structure, one representative item at most, observed JSON paths/types, and remaining unknowns. Response time is one observation, not an SLA.
8. **Sanitize before saving.** Apply the checklist below to the representative example, metadata, headers, errors, and before/after summaries. Reinspect the completed file manually.
9. **Update decisions narrowly.** Add the UTC date and evidence path only to decision rows directly affected by the observation. One success does not prove all endpoints, errors, bounds, idempotency, authorization enforcement, or future availability.
10. **Clean up and compare.** Run only the pre-approved cleanup/restoration step, capture a sanitized after-state summary, and confirm it matches the safe baseline. If cleanup fails, stop further mutations and record the blocker without exposing raw data.

### Rate limits and failures

- Do not run automated retry loops, load tests, concurrency tests, or speculative invalid requests.
- On `429`, record only the status and a safe `Retry-After` or rate-limit header when present, then stop.
- On DNS, TLS, timeout, redirect, non-JSON, or unexpected authorization behavior, record only safe diagnostics and stop. Do not switch endpoints or add credentials to make the request succeed.
- Do not persist a raw error body. Record only its sanitized field/type structure when it can be inspected safely.

## Evidence folders and filenames

Use one domain folder and one Markdown file per inventoried request:

```text
docs/api/examples/
  categories/
  subcategories/
  brands/
  products/
  auth/
  wishlist/
  cart/
  addresses/
  checkout/
  orders/
```

Name records with the kebab-case Postman request name, for example `categories/get-all-categories.md`. Create a domain directory only when adding its first evidence record; do not add empty placeholder files. Git history preserves earlier versions of a canonical request record.

## Standard evidence record

Each evidence file uses this structure:

```markdown
# <Request name>

## Observation

| Field | Recorded value |
|---|---|
| Request name | `<exact Postman request name>` |
| HTTP method | `<METHOD>` |
| Request URL | `https://<approved-base>/<path>` |
| Normalized endpoint | `/<path>` |
| Authentication category | `<safety category>` |
| Observed status code | `<actual status>` |
| Capture date | `<YYYY-MM-DDTHH:MM:SSZ>` |
| Response time | `<elapsed-ms> ms` |
| Safe response headers | `<allowlisted names and sanitized values, or None recorded>` |
| Sanitization note | `<what was removed/replaced; confirm no raw body was persisted>` |

## Safe request parameters

<Path/query/body description using placeholders, or `None`.>

## Safe response example

<One sanitized representative JSON example; never the full collection.>

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `<path>` | `<object/array/string/number/boolean/null>` | `<observation without inferred guarantees>` |

## Before state, cleanup, and after state

<Sanitized summaries for a controlled mutation, or `Not applicable — Safe public read`.>

## Unknown behavior

- <Behavior this observation did not prove.>

## Related decisions

- `<DECISION-ID>` — <status impact or evidence note>.
```

Use JSON types (`object`, `array`, `string`, `number`, `boolean`, and `null`) rather than language-specific runtime class names. Do not infer optionality, bounds, stability, or semantics from one example.

## Redaction checklist

Before committing any evidence, remove or replace:

- [ ] Tokens and authentication headers → `<token>`.
- [ ] Cookies and session values → `<cookie>`.
- [ ] Passwords and password confirmations → `<password>`.
- [ ] Reset codes or recovery proof → `<reset-code>`.
- [ ] Personal or synthetic-account emails → `<email>`.
- [ ] Phone numbers → `<phone>`.
- [ ] Street, shipping, or billing addresses → `<address>`.
- [ ] User IDs → `<user-id>`.
- [ ] Product and catalog IDs → `<product-id>`, `<category-id>`, `<subcategory-id>`, or `<brand-id>`.
- [ ] Cart and cart-line IDs → `<cart-id>` or `<cart-line-id>`.
- [ ] Order, payment, or checkout-session IDs → `<order-id>` or `<checkout-session-id>`.
- [ ] Customer names or other identifying free text → `<name>`.
- [ ] Unnecessary response headers. Keep only `Content-Type`, `Cache-Control`, `ETag`, `Retry-After`, or rate-limit headers when useful and safe.

Also replace remote media values in structural examples with role-based placeholders such as `<category-image-url>`. Public catalog content may be non-sensitive, but a structural evidence record should retain only the smallest representative value set needed to document types.

## Credential-free public GET examples

These examples use the provisional base URL, call only `GET /categories`, contain no authentication, and write no response body to the repository.

### PowerShell with Invoke-RestMethod

The assignment keeps the parsed response in memory. The command prints only top-level property names and runtime types, not the full catalog.

```powershell
$apiBase = 'https://ecommerce.routemisr.com/api/v1'
$categoryResponse = Invoke-RestMethod -Method Get -Uri "$apiBase/categories" -Headers @{ Accept = 'application/json' }

$categoryResponse.PSObject.Properties | ForEach-Object {
    $observedType = if ($null -eq $_.Value) { 'null' } else { $_.Value.GetType().Name }
    [pscustomobject]@{ Field = $_.Name; ObservedType = $observedType }
}

Remove-Variable categoryResponse
```

### PowerShell with curl.exe

This command discards the body and prints only status and total time.

```powershell
$apiBase = 'https://ecommerce.routemisr.com/api/v1'
curl.exe --silent --show-error --request GET --header "Accept: application/json" --output NUL --write-out "status=%{http_code} time_seconds=%{time_total}`n" "$apiBase/categories"
```

Do not add `--location`, an authorization header, output redirection, or a repository filename to either example.
