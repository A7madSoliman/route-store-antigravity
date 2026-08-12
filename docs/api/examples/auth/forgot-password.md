# Forgot Password

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Forgot Password` |
| HTTP method | `POST` |
| Normalized endpoint | `/auth/forgotPasswords` |
| Authentication category | Controlled pre-auth request |
| Observed success status | `200` |
| Capture completed | `2026-08-12` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication sent | None; no token, cookie, or authorization header |
| Delivery observation | A controlled reset code was supplied from the dedicated inbox; the inbox itself was not accessed by the verification process |
| Sanitization note | The request body and response were inspected in process memory. Account values and message text were not written. |

## Safe request parameters

```json
{
  "email": "<email>"
}
```

The body contained exactly one string field. No query parameters, credentials,
cookies, or authentication headers were sent.

## Safe success response example

```json
{
  "statusMsg": "<redacted-status-message>",
  "message": "<redacted-message>"
}
```

## Observed fields and data types

| JSON path | Observed type |
|---|---|
| `$` | object |
| `$.statusMsg` | string |
| `$.message` | string |

No token or recovery-proof field was observed. HTTP `200` and API wording do not
by themselves prove delivery; the controlled code was obtained separately from
the dedicated inbox.

## Enumeration limitation

No unknown-account probe was performed. Account-enumeration behavior remains
**UNRESOLVED**.
