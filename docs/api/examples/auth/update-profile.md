# Update Logged user data

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Update Logged user data` |
| HTTP method | `PUT` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/users/updateMe` |
| Normalized endpoint | `/users/updateMe` |
| Authentication category | Controlled account mutation |
| Observed success status | `200` |
| Conflict status (duplicate email) | `400` |
| Invalid token status | `401` |
| Capture completed | `2026-08-20` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Synthetic test account values, names, emails, phones, and tokens were inspected in process memory and redacted before recording. |

## Safe request parameters

The endpoint was verified to support individual single-field updates as well as full body updates:

### Single field name update
```json
{
  "name": "<name>"
}
```

### Single field email update
```json
{
  "email": "<email>"
}
```

### Single field phone update
```json
{
  "phone": "<phone>"
}
```

## Safe success response example

```json
{
  "message": "success",
  "user": {
    "name": "<name>",
    "email": "<email>",
    "role": "user"
  }
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful update response root |
| `$.message` | string | Observed `"success"` |
| `$.user` | object | User identity record returned on success |
| `$.user.name` | string | Updated name value |
| `$.user.email` | string | Updated email value |
| `$.user.role` | string | Observed `"user"` |

## Key contract findings

1. **Partial / Atomic Updates (`ACCOUNT-001`)**: Supported. Sending single-field payloads (`{ name }`, `{ email }`, or `{ phone }`) succeeds with HTTP `200`.
2. **Phone Handling**: `user.phone` is not returned in the success response user object. The server does not reflect phone in the response user profile.
3. **Token Lifecycle**: No replacement token is returned in `PUT /users/updateMe`. The active session token remains valid.
4. **Error Handling**: Duplicate email returns HTTP `400` with validation error structure. Invalid/missing token returns HTTP `401`.

## Related decisions

- `ACCOUNT-001` — `PUT /users/updateMe` supports partial updates; A08 will send single-field updates.
- `AUTH-002` — confirmed custom `token` header works for protected transport on `/users/updateMe`.
- `AUTH-007` — `user.name`, `user.email`, and `user.role` are returned by updateMe; `user.phone` is not present in response.
- `AUTH-008` — profile updates do not rotate or invalidate the session token.
