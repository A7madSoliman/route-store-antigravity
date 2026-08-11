# signin

## Observation

| Field | Recorded value |
|---|---|
| Request name | `signin` |
| HTTP method | `POST` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/auth/signin` |
| Normalized endpoint | `/auth/signin` |
| Authentication category | Controlled pre-auth request |
| Observed success status | `200` |
| Invalid-credential status | `401` |
| Capture completed | `2026-08-11T17:34:14Z` |
| Primary response time | `498.17 ms` |
| Invalid-credential response time | `501.07 ms` |
| Final response time | `497.33 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | No token, cookie, `Authorization`, or other authentication material was sent |
| Sanitization note | All bodies and JWT metadata were inspected in process memory. Credentials, messages, identity values, and tokens were redacted before this record was written. |

## Safe request parameters

The correct and invalid-credential requests used exactly two JSON string fields:

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

The invalid-credential observation used one generated wrong password against the owned synthetic account. No account enumeration, repeated guessing, query parameters, cookies, or authentication headers were used.

## Safe success response example

```json
{
  "message": "<redacted-success-message>",
  "user": {
    "name": "<name>",
    "email": "<email>",
    "role": "<role>"
  },
  "token": "<token>"
}
```

Both the primary and final correct sign-ins returned this top-level field/type shape and a nonempty token string. The final token replaced the earlier token in the ignored local store; historical token values were not retained.

## Safe invalid-credential response example

```json
{
  "statusMsg": "<redacted-status-message>",
  "message": "<redacted-invalid-credential-message>"
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful sign-in response root |
| `$.message` | string | Value redacted |
| `$.user` | object | Accompanied the token in both successful observations |
| `$.user.name` | string | Replaced with `<name>` |
| `$.user.email` | string | Replaced with `<email>` |
| `$.user.role` | string | Replaced with `<role>`; not treated as independently verified authorization |
| `$.token` | string | Nonempty top-level value replaced with `<token>` |
| invalid `$.statusMsg` | string | Value redacted |
| invalid `$.message` | string | Value redacted |

## JWT metadata observation

The primary sign-in token was JWT-shaped with three segments and `265` total characters. Its decoded payload exposed the following names and JSON types only:

| Claim | Observed type | Notes |
|---|---|---|
| `id` | string | Value discarded and represented only as `<user-id>` when needed |
| `name` | string | Value discarded |
| `role` | string | Value discarded; not authoritative role evidence |
| `iat` | number | Present |
| `exp` | number | Present; decoded timestamp `2026-11-09T17:33:59Z` |

Decoding was metadata inspection only. The signature, issuer, protected-request usability, refresh behavior, and server-side expiry enforcement were not verified.

## Before state, cleanup, and after state

The request used only the newly created dedicated account. One controlled invalid-password attempt was followed by a successful final sign-in, establishing that the account remained usable. The final token is retained only in the ignored `.env.f06.local`; no tracked artifact contains it.

## Unknown behavior

- Protected endpoint authentication and the custom `token` header were not behaviorally tested in F06.
- Error-message stability, account-enumeration behavior, lockout thresholds, and rate limits remain unverified.
- Token equality/rotation between responses was not compared.
- Token refresh, revocation, signature verification, and server-side expiry enforcement remain unverified.
- There is no inventoried refresh, logout, session-introspection, or current-user endpoint.

## Related decisions

- `API-004` — observed sign-in success and invalid-credential envelopes and statuses.
- `AUTH-001` — correct sign-in returned and reacquired a nonempty top-level token string.
- `AUTH-002` — no protected request was made, so the custom header remains provisional.
- `AUTH-005` — JWT shape and `iat`/`exp` presence were observed without proving lifecycle semantics.
- `AUTH-006` — token size/expiry evidence is available to A00; storage architecture remains undecided.
- `AUTH-007` — success responses included `user.name`, `user.email`, and `user.role`; decoded identity/role claim values were discarded.

