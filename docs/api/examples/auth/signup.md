# Signup

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Signup` |
| HTTP method | `POST` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/auth/signup` |
| Normalized endpoint | `/auth/signup` |
| Authentication category | Controlled account mutation |
| Observed success status | `201` |
| Duplicate-account status | `409` |
| Capture completed | `2026-08-11T17:34:14Z` |
| Success response time | `1015.35 ms` |
| Duplicate response time | `246.43 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | No token, cookie, `Authorization`, or other authentication material was sent |
| Sanitization note | Both bodies were parsed in process memory. Account values, identifiers, messages, and tokens were replaced with placeholders before this record was written. |

## Safe request parameters

The JSON body contained exactly five string fields:

```json
{
  "name": "<name>",
  "email": "<email>",
  "password": "<password>",
  "rePassword": "<password>",
  "phone": "<phone>"
}
```

`rePassword` used the same in-memory value as `password`. No query parameters or authentication headers were sent.

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

## Safe duplicate response example

```json
{
  "statusMsg": "<redacted-status-message>",
  "message": "<redacted-duplicate-message>"
}
```

The duplicate observation repeated signup once with the same owned synthetic account after primary sign-in succeeded. It returned `409`; no alternate identifier or retry was attempted.

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful signup response root |
| `$.message` | string | Value redacted |
| `$.user` | object | Accompanied the token in this observation |
| `$.user.name` | string | Replaced with `<name>` |
| `$.user.email` | string | Replaced with `<email>` |
| `$.user.role` | string | Replaced with `<role>`; one response does not prove authorization semantics |
| `$.token` | string | Nonempty top-level value replaced with `<token>` |
| duplicate `$.statusMsg` | string | Value redacted |
| duplicate `$.message` | string | Value redacted |

## Before state, cleanup, and after state

The controlled inbox had not previously been used with this API. The `201` response established creation of the dedicated project-only account. There is no inventoried account-deletion endpoint, so the account is intentionally retained for F07 and later owned-account verification milestones. No unrelated or other-user resource was read or changed.

## Unknown behavior

- Field requiredness, accepted email/phone formats, password rules, normalization, and other validation failures remain unverified beyond this accepted request.
- Field optionality and stability across future responses remain unverified.
- The response role value was redacted and was not tested as authorization evidence.
- The signup token was not used against a protected endpoint.
- Token refresh, revocation, rotation, and expiry behavior remain unverified.

## Related decisions

- `API-004` — observed signup success and duplicate-account envelopes and statuses.
- `AUTH-001` — signup returned a nonempty top-level token string.
- `AUTH-003` — one exact five-string request was accepted; broader validation rules remain open.
- `AUTH-005` — token lifetime behavior remains open.
- `AUTH-007` — the success response included `user.name`, `user.email`, and `user.role`.

