# Update Logged user password

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Update Logged user password` |
| HTTP method | `PUT` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/users/changeMyPassword` |
| Normalized endpoint | `/users/changeMyPassword` |
| Authentication category | Controlled account mutation |
| Observed success status | `200` |
| Validation error status | `400` |
| Invalid token status | `401` |
| Capture completed | `2026-08-20` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Passwords, tokens, emails, and response payloads remained in process memory and were redacted before recording. |

## Safe request parameters

```json
{
  "currentPassword": "<password>",
  "password": "<password>",
  "rePassword": "<password>"
}
```

The request requires string fields for current password, new password, and matching password confirmation.

## Safe success response example

```json
{
  "message": "success",
  "user": {
    "name": "<name>",
    "email": "<email>",
    "role": "user"
  },
  "token": "<token>"
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful change-password response root |
| `$.message` | string | Observed `"success"` |
| `$.user` | object | User identity record returned on success |
| `$.user.name` | string | Current user name |
| `$.user.email` | string | Current user email |
| `$.user.role` | string | Current user role |
| `$.token` | string | Replacement top-level token |

## Key contract findings

1. **Token Rotation & Invalidation (`AUTH-008`)**: `PUT /users/changeMyPassword` returns a replacement string `token`. The previous session token is **immediately invalidated** by the upstream server (returning HTTP `401` on subsequent requests).
2. **Credential Updates**: Sign-in with the new password returns HTTP `200` and a new token; sign-in with the old password returns HTTP `401`.
3. **Error Handling**: Wrong current password or password mismatch returns HTTP `400` with validation error structure.

## Related decisions

- `AUTH-008` — password change rotates and invalidates the previous token; application session must seal and replace the active session token.
- `AUTH-007` — password change returns user profile and replacement token.
