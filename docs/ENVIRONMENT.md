# Environment Contract

This document defines the D10 environment contract. Private configuration is read only by the server boundary in `lib/env/server.ts`, which is guarded by `server-only` and validates values with Zod.

## Approved variables

| Variable | Required | Classification | Local development value | Meaning |
|---|---|---|---|---|
| `ECOMMERCE_API_BASE_URL` | Yes | Server-only, non-public | `https://ecommerce.routemisr.com/api/v1` | Verified third-party API host and `/api/v1` path. A trailing slash is normalized away. |
| `APP_ORIGIN` | Yes | Server-only, non-public | `http://localhost:3000` | The application origin used for application-owned return URL construction. It is not payment-success evidence. |

Both variables are required for every application environment. They must never be prefixed with `NEXT_PUBLIC_`.

## Validation rules

`ECOMMERCE_API_BASE_URL` must be an absolute HTTP or HTTPS URL using the verified host `ecommerce.routemisr.com` and path `/api/v1`. Credentials, query strings, fragments, and other hosts or paths are rejected. The normalized value has exactly one semantic `/api/v1` path and no trailing slash.

`APP_ORIGIN` must be an absolute origin only. Credentials, non-root paths, queries, and fragments are rejected. HTTP is allowed for `localhost`, `127.0.0.1`, and `::1` during local development. Non-localhost origins must use HTTPS. The normalized value contains only protocol, host, and optional port.

Examples:

```dotenv
# valid local values
ECOMMERCE_API_BASE_URL=https://ecommerce.routemisr.com/api/v1
APP_ORIGIN=http://localhost:3000
```

Invalid values include relative URLs, an API host other than `ecommerce.routemisr.com`, an API path other than `/api/v1`, `https://user:password@example.com`, `https://example.com/app`, `https://example.com/?next=/checkout`, `https://example.com/#return`, and external `http://` origins.

## Environment behavior

- `.env.example` contains non-secret local defaults and is committed as a template.
- `.env.local` is ignored and is the local place for overrides that must not enter Git.
- Tests must use deterministic non-secret values and must not depend on `.env.local`; test-account credentials and tokens remain in a separate ignored local secret store.
- Preview and production values are supplied by the deployment system and must use the same validation contract. Deployment-specific hosts, ports, and secret-store settings remain with the deployment milestone.
- Missing or invalid values fail at the server configuration boundary with a safe error that names only the invalid variable, never its value or another environment value.

## Secret handling and incidents

Do not commit, log, serialize, or send environment values to Client Components. Do not place tokens, passwords, reset codes, test-account credentials, checkout secrets, or private API configuration in `NEXT_PUBLIC_*` variables. Next.js inlines `NEXT_PUBLIC_*` values into browser bundles at build time.

User tokens and credentials are not static environment variables because they are per-account runtime data. They must use the server-controlled authentication/session boundary and remain out of client storage, URLs, serialized props, browser logs, and fixtures.

If a secret is exposed, stop using it, revoke or rotate it through the owning provider, replace it in the local/deployment secret store, inspect logs and build artifacts, and record only sanitized incident facts. Never add the exposed value to this document or another repository file.

`APP_ORIGIN` may later be used to construct an application-owned checkout return URL. It does not establish payment completion, authorize a redirect destination from an API response, or replace the unresolved checkout verification decisions.
