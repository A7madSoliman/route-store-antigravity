# Reset Password

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Reset Password` |
| HTTP method | `PUT` |
| Normalized endpoint | `/auth/resetPassword` |
| Authentication category | Controlled pre-auth request after code verification |
| Observed success status | `200` |
| Capture completed | `2026-08-12` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication sent | None; no token, cookie, or authorization header |
| Client-state handling | New independent cookie-disabled client after verification; request `Cookie`/`Authorization`/recovery-proof headers absent |
| Sanitization note | Email, replacement password, response token, and raw body remained in process memory and were not written or displayed. |

## Safe request parameters

```json
{
  "email": "<email>",
  "newPassword": "<password>"
}
```

The collection-established body was accepted after successful code
verification. No reset-code, recovery-token, query, or custom header field was
added.

## Safe success response example

```json
{
  "token": "<token>"
}
```

## Observed fields and data types

| JSON path | Observed type |
|---|---|
| `$` | object |
| `$.token` | string, nonempty |

A token field was returned. It was not persisted or used for a protected
request. One final controlled sign-in with the replacement password returned
the normal successful sign-in shape and a nonempty token, proving account
usability after reset. Session establishment, token rotation, and revocation
semantics remain unverified.

The controlled linkage verification used a different HTTP client and handler
from `verifyResetCode`, with cookie handling explicitly disabled for both. The
reset request contained only the observed `email` and `newPassword` body fields;
no reset code, recovery proof, cookie, authorization header, or token header was
sent. The reset succeeded with HTTP `200`, and final sign-in with the replacement
password succeeded. This supports the narrow observation that no client-carried
recovery state was required by the observed application flow; it does not prove
backend statelessness or universal reset-linkage semantics.
