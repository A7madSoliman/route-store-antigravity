# Verify Reset Code

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Verify Reset Code` |
| HTTP method | `POST` |
| Normalized endpoint | `/auth/verifyResetCode` |
| Authentication category | Controlled pre-auth request |
| Observed success status | `200` |
| Capture completed | `2026-08-12` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication sent | None; no token, cookie, or authorization header |
| Client-state handling | Explicitly cookie-disabled independent client; request `Cookie`/`Authorization` headers absent; response `Set-Cookie` absent |
| Sanitization note | The reset code and response body remained in process memory and were never written or displayed. |

## Safe request parameters

```json
{
  "resetCode": "<reset-code>"
}
```

The collection-established code-only body was accepted. No email or additional
proof field was supplied.

## Safe success response example

```json
{
  "status": "<redacted-status>"
}
```

## Observed fields and data types

| JSON path | Observed type |
|---|---|
| `$` | object |
| `$.status` | string |

No recovery token or proof field was returned. Code format, expiry, resend, and
rate-limit behavior were not independently probed.

In a later controlled linkage verification, this request used a dedicated
cookie-disabled client. The verification client was disposed before the reset
request, and no response cookie or other client-carried recovery state was
retained. This is client-perspective evidence only; it does not establish that
the backend is stateless or that no implicit server-side recovery state exists.
